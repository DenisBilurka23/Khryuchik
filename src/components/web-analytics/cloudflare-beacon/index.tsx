import Script from "next/script";

import { CLOUDFLARE_BEACON_SRC } from "@/constants/analytics";

import type { CloudflareBeaconProps } from "../types";

export const CloudflareBeacon = ({ token }: CloudflareBeaconProps) => (
  <Script
    src={CLOUDFLARE_BEACON_SRC}
    strategy="afterInteractive"
    data-cf-beacon={JSON.stringify({ token })}
  />
);
