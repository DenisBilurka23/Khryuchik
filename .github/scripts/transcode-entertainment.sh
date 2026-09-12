#!/usr/bin/env bash
#
# Builds the HLS ladder for one entertainment item and uploads it to R2.
#
# The ladder is video-only variants plus a separate audio group, so adding a dub
# later rewrites the master playlist without re-encoding a single frame of video.
# That incremental path is what `rebuildVideo: false` in the job selects.
#
# Required environment:
#   SITE_URL, CRON_SECRET            - to claim the job and report the result
#   R2_TRANSCODE_ACCESS_KEY_ID       - write access to the public bucket only;
#   R2_TRANSCODE_SECRET_ACCESS_KEY     sources move through signed URLs
#   SLUG                             - the item to build
#
# Nothing here may echo a credential: the repository is public and so are its
# logs. The signed URLs and the access keys are never printed.

set -euo pipefail

: "${SITE_URL:?SITE_URL is required}"
: "${CRON_SECRET:?CRON_SECRET is required}"
: "${R2_TRANSCODE_ACCESS_KEY_ID:?R2_TRANSCODE_ACCESS_KEY_ID is required}"
: "${R2_TRANSCODE_SECRET_ACCESS_KEY:?R2_TRANSCODE_SECRET_ACCESS_KEY is required}"
: "${SLUG:?SLUG is required}"

ENDPOINT="${SITE_URL%/}/api/cron/entertainment-transcode"
WORK_DIR="$(mktemp -d)"
LOG_FILE="$WORK_DIR/ffmpeg.log"
OUT_DIR="$WORK_DIR/hls"
SOURCE_OBJECT_KEY=""
TRACK_RESULTS="$WORK_DIR/tracks.json"
REPORTED=0

echo "[]" > "$TRACK_RESULTS"

cleanup() {
  rm -rf "$WORK_DIR"
}

record_track() {
  local id="$1" status="$2" reason="${3:-}"

  jq --arg id "$id" --arg status "$status" --arg reason "$reason" \
    '. + [{id: $id, status: $status} + (if $reason == "" then {} else {failureReason: $reason} end)]' \
    "$TRACK_RESULTS" > "$TRACK_RESULTS.next"
  mv "$TRACK_RESULTS.next" "$TRACK_RESULTS"
}

# Reports the outcome exactly once, so the trap cannot overwrite a success that
# has already been posted.
report() {
  local status="$1"
  local reason="${2:-}"

  if [ "$REPORTED" = "1" ] || [ -z "$SOURCE_OBJECT_KEY" ]; then
    return 0
  fi

  REPORTED=1

  jq -n \
    --arg slug "$SLUG" \
    --arg sourceObjectKey "$SOURCE_OBJECT_KEY" \
    --arg status "$status" \
    --arg failureReason "$reason" \
    --slurpfile tracks "$TRACK_RESULTS" \
    '{slug: $slug, sourceObjectKey: $sourceObjectKey, status: $status, tracks: $tracks[0]}
     + (if $failureReason == "" then {} else {failureReason: $failureReason} end)' \
    > "$WORK_DIR/result.json"

  curl -sS --max-time 60 -X POST \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json" \
    --data-binary "@$WORK_DIR/result.json" \
    "$ENDPOINT" > /dev/null || echo "::warning::Could not report the result back"
}

on_failure() {
  local exit_code="$?"

  if [ "$exit_code" -ne 0 ]; then
    local reason
    reason="$(tail -c 400 "$LOG_FILE" 2>/dev/null | tr '\n' ' ' || true)"
    report "failed" "${reason:-transcode failed with exit code $exit_code}"
  fi
}
trap 'on_failure; cleanup' EXIT

echo "--- claiming job for $SLUG"
http_status="$(curl -sS --max-time 60 --get \
  -H "Authorization: Bearer $CRON_SECRET" \
  --data-urlencode "slug=$SLUG" \
  -o "$WORK_DIR/job.json" -w "%{http_code}" \
  "$ENDPOINT")" || http_status="000"

if [ "$http_status" != "200" ]; then
  echo "::error::Could not claim a job for $SLUG (HTTP $http_status)"
  exit 1
fi

JOB="$WORK_DIR/job.json"
SOURCE_OBJECT_KEY="$(jq -r '.job.sourceObjectKey' "$JOB")"
SOURCE_URL="$(jq -r '.job.sourceUrl' "$JOB")"
HLS_PREFIX="$(jq -r '.job.hlsPrefix' "$JOB")"
BUCKET="$(jq -r '.job.storage.bucket' "$JOB")"
S3_ENDPOINT="$(jq -r '.job.storage.endpoint' "$JOB")"
SEGMENT_SECONDS="$(jq -r '.job.segmentSeconds' "$JOB")"
FRAME_RATE="$(jq -r '.job.frameRate' "$JOB")"
AUDIO_BITRATE="$(jq -r '.job.audioBitrateKbps' "$JOB")"
AUDIO_CODEC="$(jq -r '.job.audioCodec' "$JOB")"
AUDIO_GROUP="$(jq -r '.job.audioGroupId' "$JOB")"
REBUILD_VIDEO="$(jq -r '.job.rebuildVideo' "$JOB")"
GOP="$((FRAME_RATE * SEGMENT_SECONDS))"

if [ -z "$SOURCE_OBJECT_KEY" ] || [ "$SOURCE_OBJECT_KEY" = "null" ]; then
  # Without it the callback cannot be attributed to this master, so there is
  # nothing safe to report and the item stays processing for a manual re-queue.
  SOURCE_OBJECT_KEY=""
  echo "::error::The job carries no source key"
  exit 1
fi

if [ -z "$BUCKET" ] || [ "$BUCKET" = "null" ] || [ -z "$S3_ENDPOINT" ] || [ "$S3_ENDPOINT" = "null" ]; then
  echo "::error::The job carries no storage target"
  exit 1
fi

export AWS_ACCESS_KEY_ID="$R2_TRANSCODE_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_TRANSCODE_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"
export AWS_EC2_METADATA_DISABLED="true"
# R2 rejects the trailing checksums newer AWS CLI builds add by default.
export AWS_REQUEST_CHECKSUM_CALCULATION="when_required"
export AWS_RESPONSE_CHECKSUM_VALIDATION="when_required"

audio_count="$(jq '.job.audioTracks | length' "$JOB")"
needs_master=0

if [ "$REBUILD_VIDEO" = "true" ]; then
  needs_master=1
elif [ "$(jq '[.job.audioTracks[] | select(.needed and .isDefault)] | length' "$JOB")" -gt 0 ]; then
  # The default track's audio lives inside the master, so it is pulled even when
  # the video itself is staying exactly as published.
  needs_master=1
fi

mkdir -p "$OUT_DIR"

if [ "$needs_master" = "1" ]; then
  echo "--- downloading the master"
  curl -sS --fail --max-time 3600 -o "$WORK_DIR/source" "$SOURCE_URL"
fi

built_variants=()

if [ "$REBUILD_VIDEO" = "true" ]; then
  SOURCE_DIMENSIONS="$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height -of csv=s=x:p=0 "$WORK_DIR/source" | head -1)"
  SOURCE_WIDTH="${SOURCE_DIMENSIONS%x*}"
  SOURCE_HEIGHT="${SOURCE_DIMENSIONS#*x}"

  if [ -z "$SOURCE_WIDTH" ] || [ -z "$SOURCE_HEIGHT" ]; then
    echo "::error::The master has no video stream"
    exit 1
  fi

  # Rungs are measured on the short side, so a portrait cartoon gets the same
  # pixel budget as a landscape one instead of a sliver.
  if [ "$SOURCE_WIDTH" -gt "$SOURCE_HEIGHT" ]; then
    SOURCE_SHORT="$SOURCE_HEIGHT"
    ORIENTATION="landscape"
  else
    SOURCE_SHORT="$SOURCE_WIDTH"
    ORIENTATION="portrait"
  fi

  echo "--- master is ${SOURCE_WIDTH}x${SOURCE_HEIGHT} ($ORIENTATION, short side $SOURCE_SHORT)"

  # Upscaling only wastes bytes, so a rung above the master is skipped — unless
  # every rung would be skipped, in which case the smallest is kept.
  variant_count="$(jq '.job.variants | length' "$JOB")"

  for index in $(seq 0 $((variant_count - 1))); do
    name="$(jq -r ".job.variants[$index].name" "$JOB")"
    short_side="$(jq -r ".job.variants[$index].shortSide" "$JOB")"
    crf="$(jq -r ".job.variants[$index].crf" "$JOB")"
    max_kbps="$(jq -r ".job.variants[$index].maxBitrateKbps" "$JOB")"
    profile="$(jq -r ".job.variants[$index].profile" "$JOB")"
    level="$(jq -r ".job.variants[$index].level" "$JOB")"

    if [ "$short_side" -gt "$SOURCE_SHORT" ] && [ "${#built_variants[@]}" -gt 0 ]; then
      echo "--- skipping $name, the master is smaller"
      continue
    fi

    echo "--- encoding $name"
    mkdir -p "$OUT_DIR/$name"

    # -g/-keyint_min/-sc_threshold pin keyframes to identical timestamps across
    # every rendition. Without that, switching quality mid-playback glitches.
    ffmpeg -nostdin -y -loglevel error -i "$WORK_DIR/source" \
      -an \
      -vf "scale='if(gt(iw,ih),-2,$short_side)':'if(gt(iw,ih),$short_side,-2)'" \
      -r "$FRAME_RATE" \
      -c:v libx264 -preset veryfast -crf "$crf" \
      -maxrate "${max_kbps}k" -bufsize "$((max_kbps * 2))k" \
      -profile:v "$profile" -level:v "$level" \
      -g "$GOP" -keyint_min "$GOP" -sc_threshold 0 \
      -pix_fmt yuv420p \
      -f hls -hls_time "$SEGMENT_SECONDS" -hls_playlist_type vod \
      -hls_segment_filename "$OUT_DIR/$name/seg_%05d.ts" \
      "$OUT_DIR/$name/index.m3u8" >> "$LOG_FILE" 2>&1

    built_variants+=("$index:$name")
  done

  if [ "${#built_variants[@]}" -eq 0 ]; then
    echo "::error::No renditions were produced"
    exit 1
  fi
else
  echo "--- keeping the published video, rebuilding audio only"
  aws s3 cp "s3://$BUCKET/${HLS_PREFIX}master.m3u8" "$WORK_DIR/old-master.m3u8" \
    --endpoint-url "$S3_ENDPOINT" --only-show-errors
fi

# Audio is always a single unified AAC encode at the video's segment length; the
# same encode is both the stored source and the segmented rendition, so nothing
# drifts between them and switching language cannot stutter.
built_audio=()

for index in $(seq 0 $((audio_count - 1))); do
  track_id="$(jq -r ".job.audioTracks[$index].id" "$JOB")"
  track_needed="$(jq -r ".job.audioTracks[$index].needed" "$JOB")"
  track_source_url="$(jq -r ".job.audioTracks[$index].sourceUrl // empty" "$JOB")"
  track_upload_url="$(jq -r ".job.audioTracks[$index].extractedUploadUrl // empty" "$JOB")"

  if [ "$track_needed" != "true" ]; then
    echo "--- audio $track_id is already published, leaving it alone"
    built_audio+=("$index")
    continue
  fi

  echo "=== audio $track_id"

  # A bad dub must not strand the rest: each track builds in a subshell, and a
  # failure is recorded against that track alone.
  if ! (
    set -e
    input="$WORK_DIR/source"

    if [ -n "$track_source_url" ]; then
      curl -sS --fail --max-time 3600 -o "$WORK_DIR/dub-$track_id" "$track_source_url"
      input="$WORK_DIR/dub-$track_id"
    fi

    # -map 0:a:0 takes the first audio stream, so a dub delivered as a whole
    # video container needs no special handling.
    ffmpeg -nostdin -y -loglevel error -i "$input" \
      -vn -map 0:a:0 \
      -c:a aac -b:a "${AUDIO_BITRATE}k" -ac 2 -ar 48000 \
      -movflags +faststart \
      "$WORK_DIR/audio-$track_id.m4a" >> "$LOG_FILE" 2>&1

    mkdir -p "$OUT_DIR/audio/$track_id"

    ffmpeg -nostdin -y -loglevel error -i "$WORK_DIR/audio-$track_id.m4a" \
      -c:a copy \
      -f hls -hls_time "$SEGMENT_SECONDS" -hls_playlist_type vod \
      -hls_segment_filename "$OUT_DIR/audio/$track_id/seg_%05d.ts" \
      "$OUT_DIR/audio/$track_id/index.m3u8" >> "$LOG_FILE" 2>&1

    # The uploaded container is thrown away once this lands, so the extracted
    # audio has to become the track's source first.
    if [ -n "$track_upload_url" ]; then
      curl -sS --fail --max-time 600 -X PUT \
        -H "Content-Type: audio/mp4" \
        --upload-file "$WORK_DIR/audio-$track_id.m4a" \
        "$track_upload_url" > /dev/null
    fi
  ); then
    reason="$(tail -c 200 "$LOG_FILE" 2>/dev/null | tr '\n' ' ' || true)"
    echo "::warning::Audio track $track_id failed"
    record_track "$track_id" "failed" "${reason:-could not build this soundtrack}"
    rm -rf "${OUT_DIR:?}/audio/$track_id"
    continue
  fi

  record_track "$track_id" "ready"
  built_audio+=("$index")
done

if [ "${#built_audio[@]}" -eq 0 ]; then
  echo "::error::No soundtrack could be built"
  exit 1
fi

echo "--- writing the master playlist"
MASTER="$OUT_DIR/master.m3u8"
{
  echo "#EXTM3U"
  echo "#EXT-X-VERSION:3"
} > "$MASTER"

# EXT-X-MEDIA is what makes the audio selectable at all: hls.js reads NAME as the
# menu label and LANGUAGE as the code the player matches the locale against.
for index in "${built_audio[@]}"; do
  track_id="$(jq -r ".job.audioTracks[$index].id" "$JOB")"
  track_name="$(jq -r ".job.audioTracks[$index].name" "$JOB")"
  track_language="$(jq -r ".job.audioTracks[$index].language // empty" "$JOB")"
  is_default="$(jq -r ".job.audioTracks[$index].isDefault" "$JOB")"
  default_flag="NO"
  language_attribute=""

  if [ "$is_default" = "true" ]; then
    default_flag="YES"
  fi

  if [ -n "$track_language" ]; then
    language_attribute="LANGUAGE=\"$track_language\","
  fi

  printf '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="%s",NAME="%s",%sDEFAULT=%s,AUTOSELECT=YES,URI="audio/%s/index.m3u8"\n' \
    "$AUDIO_GROUP" "$track_name" "$language_attribute" "$default_flag" "$track_id" \
    >> "$MASTER"
done

if [ "$REBUILD_VIDEO" = "true" ]; then
  for entry in "${built_variants[@]}"; do
    index="${entry%%:*}"
    name="${entry#*:}"
    max_kbps="$(jq -r ".job.variants[$index].maxBitrateKbps" "$JOB")"
    codec="$(jq -r ".job.variants[$index].codec" "$JOB")"
    resolution="$(ffprobe -v error -select_streams v:0 \
      -show_entries stream=width,height -of csv=s=x:p=0 \
      "$OUT_DIR/$name/seg_00000.ts" | head -1)"
    bandwidth="$(((max_kbps + AUDIO_BITRATE) * 1000))"

    printf '#EXT-X-STREAM-INF:BANDWIDTH=%s,RESOLUTION=%s,CODECS="%s,%s",AUDIO="%s"\n%s/index.m3u8\n' \
      "$bandwidth" "$resolution" "$codec" "$AUDIO_CODEC" "$AUDIO_GROUP" "$name" \
      >> "$MASTER"
  done
else
  # The variants stay exactly as published, so their declarations are carried
  # over verbatim rather than guessed at.
  awk '/^#EXT-X-STREAM-INF/{print; getline; print}' "$WORK_DIR/old-master.m3u8" \
    >> "$MASTER"
fi

echo "--- uploading to r2://$BUCKET/$HLS_PREFIX"

if [ "$REBUILD_VIDEO" = "true" ]; then
  # A rebuild that produced fewer segments than last time would otherwise leave
  # the tail of the previous ladder behind.
  aws s3 rm "s3://$BUCKET/$HLS_PREFIX" --recursive \
    --endpoint-url "$S3_ENDPOINT" --only-show-errors
fi

# Content types are set explicitly: several mime databases map .ts to TypeScript,
# which makes every segment unplayable.
aws s3 sync "$OUT_DIR" "s3://$BUCKET/$HLS_PREFIX" \
  --endpoint-url "$S3_ENDPOINT" --only-show-errors --no-progress \
  --exclude "*" --include "*.ts" \
  --content-type "video/mp2t" \
  --cache-control "public, max-age=86400"

aws s3 sync "$OUT_DIR" "s3://$BUCKET/$HLS_PREFIX" \
  --endpoint-url "$S3_ENDPOINT" --only-show-errors --no-progress \
  --exclude "*" --include "*.m3u8" \
  --content-type "application/vnd.apple.mpegurl" \
  --cache-control "no-cache"

echo "--- done, reporting ready"
report "ready"
