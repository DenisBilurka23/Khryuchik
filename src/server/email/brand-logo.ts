import "server-only";

import { brandLogoPngBase64 } from "./brand-logo.data";

export const BRAND_LOGO_CID = "khryuchik-logo";

export const getBrandLogoAttachment = () => ({
  filename: "khryuchik-logo.png",
  cid: BRAND_LOGO_CID,
  contentType: "image/png",
  content: Buffer.from(brandLogoPngBase64, "base64"),
});
