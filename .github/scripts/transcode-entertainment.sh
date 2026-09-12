#!/usr/bin/env bash
#
# Builds the HLS ladder for one entertainment item and uploads it to R2.
#
# The ladder is deliberately video-only variants plus a separate audio group,
# even while there is a single audio track: adding a dub later must rewrite the
# master playlist without re-encoding a single frame of video.
#
# Required environment:
#   SITE_URL, CRON_SECRET            - to claim the job and report the result
#   R2_TRANSCODE_ACCESS_KEY_ID       - write access to the public bucket only;
#   R2_TRANSCODE_SECRET_ACCESS_KEY     the master is pulled via a signed URL
#   SLUG                             - the item to build
#
# Nothing here may echo a credential: the repository is public and so are its
# logs. The signed source URL and the access keys are never printed.

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
REPORTED=0

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

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
    '{slug: $slug, sourceObjectKey: $sourceObjectKey, status: $status}
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

echo "--- downloading the master"
curl -sS --fail --max-time 3600 -o "$WORK_DIR/source" "$SOURCE_URL"

SOURCE_HEIGHT="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=height -of csv=p=0 "$WORK_DIR/source" | head -1)"

if [ -z "$SOURCE_HEIGHT" ]; then
  echo "::error::The master has no video stream"
  exit 1
fi

echo "--- master is ${SOURCE_HEIGHT}p"
mkdir -p "$OUT_DIR"

# Upscaling only wastes bytes, so a rendition taller than the master is skipped —
# unless every rendition would be skipped, in which case the smallest is kept.
variant_count="$(jq '.job.variants | length' "$JOB")"
built_variants=()

for index in $(seq 0 $((variant_count - 1))); do
  name="$(jq -r ".job.variants[$index].name" "$JOB")"
  height="$(jq -r ".job.variants[$index].height" "$JOB")"
  crf="$(jq -r ".job.variants[$index].crf" "$JOB")"
  max_kbps="$(jq -r ".job.variants[$index].maxBitrateKbps" "$JOB")"
  profile="$(jq -r ".job.variants[$index].profile" "$JOB")"
  level="$(jq -r ".job.variants[$index].level" "$JOB")"

  if [ "$height" -gt "$SOURCE_HEIGHT" ] && [ "${#built_variants[@]}" -gt 0 ]; then
    echo "--- skipping $name, the master is smaller"
    continue
  fi

  echo "--- encoding $name"
  mkdir -p "$OUT_DIR/$name"

  # -g/-keyint_min/-sc_threshold pin keyframes to identical timestamps across
  # every rendition. Without that, switching quality mid-playback glitches.
  ffmpeg -nostdin -y -loglevel error -i "$WORK_DIR/source" \
    -an \
    -vf "scale=-2:$height" \
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

# Audio is always re-encoded to one common AAC at the video's segment length.
# `-c:a copy` would keep each dub's own encoder delay and segment boundaries,
# and switching language would stutter.
audio_count="$(jq '.job.audioTracks | length' "$JOB")"

for index in $(seq 0 $((audio_count - 1))); do
  track_id="$(jq -r ".job.audioTracks[$index].id" "$JOB")"
  track_source_url="$(jq -r ".job.audioTracks[$index].sourceUrl // empty" "$JOB")"
  input="$WORK_DIR/source"

  if [ -n "$track_source_url" ]; then
    echo "--- downloading dub $track_id"
    curl -sS --fail --max-time 3600 -o "$WORK_DIR/audio-$track_id" "$track_source_url"
    input="$WORK_DIR/audio-$track_id"
  fi

  echo "--- encoding audio $track_id"
  mkdir -p "$OUT_DIR/audio/$track_id"

  # -map 0:a:0 takes the first audio stream, so a dub delivered as a whole video
  # container needs no special handling.
  ffmpeg -nostdin -y -loglevel error -i "$input" \
    -vn -map 0:a:0 \
    -c:a aac -b:a "${AUDIO_BITRATE}k" -ac 2 -ar 48000 \
    -f hls -hls_time "$SEGMENT_SECONDS" -hls_playlist_type vod \
    -hls_segment_filename "$OUT_DIR/audio/$track_id/seg_%05d.ts" \
    "$OUT_DIR/audio/$track_id/index.m3u8" >> "$LOG_FILE" 2>&1
done

if [ "${#built_variants[@]}" -eq 0 ]; then
  echo "::error::No renditions were produced"
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
for index in $(seq 0 $((audio_count - 1))); do
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

for entry in "${built_variants[@]}"; do
  index="${entry%%:*}"
  name="${entry#*:}"
  max_kbps="$(jq -r ".job.variants[$index].maxBitrateKbps" "$JOB")"
  codec="$(jq -r ".job.variants[$index].codec" "$JOB")"
  first_segment="$OUT_DIR/$name/seg_00000.ts"
  resolution="$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height -of csv=s=x:p=0 "$first_segment" | head -1)"
  bandwidth="$(((max_kbps + AUDIO_BITRATE) * 1000))"

  printf '#EXT-X-STREAM-INF:BANDWIDTH=%s,RESOLUTION=%s,CODECS="%s,%s",AUDIO="%s"\n%s/index.m3u8\n' \
    "$bandwidth" "$resolution" "$codec" "$AUDIO_CODEC" "$AUDIO_GROUP" "$name" \
    >> "$MASTER"
done

echo "--- uploading to r2://$BUCKET/$HLS_PREFIX"
export AWS_ACCESS_KEY_ID="$R2_TRANSCODE_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_TRANSCODE_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"
export AWS_EC2_METADATA_DISABLED="true"
# R2 rejects the trailing checksums newer AWS CLI builds add by default.
export AWS_REQUEST_CHECKSUM_CALCULATION="when_required"
export AWS_RESPONSE_CHECKSUM_VALIDATION="when_required"

# A rebuild that produced fewer segments than last time would otherwise leave the
# tail of the previous ladder behind, and the playlist is rewritten anyway.
aws s3 rm "s3://$BUCKET/$HLS_PREFIX" --recursive \
  --endpoint-url "$S3_ENDPOINT" --only-show-errors

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
