import type { NextRequest } from "next/server";

export const isCronAuthorized = (request: NextRequest) => {
  const secret = process.env.CRON_SECRET;

  return (
    Boolean(secret) &&
    request.headers.get("authorization") === `Bearer ${secret}`
  );
};
