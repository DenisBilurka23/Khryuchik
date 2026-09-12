import "server-only";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";
const USER_AGENT = "Khryuchik Store";
const DISPATCH_TIMEOUT_MS = 10_000;

export const ENTERTAINMENT_TRANSCODE_EVENT_TYPE = "entertainment-transcode";

const { GITHUB_DISPATCH_TOKEN, GITHUB_REPOSITORY } = process.env;

export const isEntertainmentTranscodeDispatchConfigured = Boolean(
  GITHUB_DISPATCH_TOKEN && GITHUB_REPOSITORY,
);

export const dispatchEntertainmentTranscode = async (slug: string) => {
  if (!isEntertainmentTranscodeDispatchConfigured) {
    return false;
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_REPOSITORY}/dispatches`,
      {
        method: "POST",
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${GITHUB_DISPATCH_TOKEN}`,
          "content-type": "application/json",
          "user-agent": USER_AGENT,
          "x-github-api-version": GITHUB_API_VERSION,
        },
        body: JSON.stringify({
          event_type: ENTERTAINMENT_TRANSCODE_EVENT_TYPE,
          client_payload: { slug },
        }),
        signal: AbortSignal.timeout(DISPATCH_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      console.error(
        `Entertainment transcode dispatch rejected for "${slug}": HTTP ${response.status}`,
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `Entertainment transcode dispatch failed for "${slug}"`,
      error,
    );

    return false;
  }
};
