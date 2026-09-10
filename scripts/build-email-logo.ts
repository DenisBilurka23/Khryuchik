import { writeFileSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SOURCE_PATH = path.join(process.cwd(), "src/assets/khryuchik-logo.png");
const TARGET_PATH = path.join(
  process.cwd(),
  "src/server/email/brand-logo.data.ts",
);
const LOGO_SIZE = 200;

const main = async () => {
  const png = await sharp(SOURCE_PATH)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: "cover" })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const fileContents = [
    "export const brandLogoPngBase64 =",
    `  "${png.toString("base64")}";`,
    "",
  ].join("\n");

  writeFileSync(TARGET_PATH, fileContents, "utf8");

  console.log(
    `[email:logo] wrote ${TARGET_PATH} (${LOGO_SIZE}x${LOGO_SIZE}, ${png.length} bytes)`,
  );
};

void main();
