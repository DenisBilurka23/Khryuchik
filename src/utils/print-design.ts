import {
  PRINT_DESIGN_COVER_TOLERANCE_PX,
  PRINT_DESIGN_DPI_GOOD_MIN,
  PRINT_DESIGN_DPI_NORMAL_MIN,
  PRINT_DESIGN_MAX_SCALE,
  PRINT_DESIGN_MIN_SCALE,
} from "@/constants/print-design";
import type {
  PrintDesignBox,
  PrintDesignDpiQuality,
  PrintDesignLayout,
  PrintDesignPoint,
  PrintDesignSize,
} from "@/types/catalog";

export const clampPrintScale = (scale: number) =>
  Math.min(PRINT_DESIGN_MAX_SCALE, Math.max(PRINT_DESIGN_MIN_SCALE, scale));

export const centerArtOnBox = (
  art: PrintDesignSize,
  box: PrintDesignBox,
  scale: number,
): PrintDesignLayout => ({
  scale,
  x: box.x + (box.width - art.width * scale) / 2,
  y: box.y + (box.height - art.height * scale) / 2,
});

export const fitArtToBox = (
  art: PrintDesignSize,
  box: PrintDesignBox,
): PrintDesignLayout =>
  centerArtOnBox(
    art,
    box,
    clampPrintScale(Math.max(box.width / art.width, box.height / art.height)),
  );

export const scaleArtAround = (
  layout: PrintDesignLayout,
  nextScale: number,
  anchor: PrintDesignPoint,
): PrintDesignLayout => {
  const scale = clampPrintScale(nextScale);
  const ratio = scale / layout.scale;

  return {
    scale,
    x: anchor.x - (anchor.x - layout.x) * ratio,
    y: anchor.y - (anchor.y - layout.y) * ratio,
  };
};

export const artCoversBox = (
  layout: PrintDesignLayout,
  art: PrintDesignSize,
  box: PrintDesignBox,
) =>
  layout.x <= box.x + PRINT_DESIGN_COVER_TOLERANCE_PX &&
  layout.y <= box.y + PRINT_DESIGN_COVER_TOLERANCE_PX &&
  layout.x + art.width * layout.scale >=
    box.x + box.width - PRINT_DESIGN_COVER_TOLERANCE_PX &&
  layout.y + art.height * layout.scale >=
    box.y + box.height - PRINT_DESIGN_COVER_TOLERANCE_PX;

export const getEffectiveDpi = (templateDpi: number, scale: number) =>
  Math.round(templateDpi / scale);

export const getPrintDpiQuality = (dpi: number): PrintDesignDpiQuality =>
  dpi >= PRINT_DESIGN_DPI_GOOD_MIN
    ? "good"
    : dpi >= PRINT_DESIGN_DPI_NORMAL_MIN
      ? "normal"
      : "bad";

const PNG_SIGNATURE_LENGTH = 8;
const INCHES_PER_METRE = 39.3700787;

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

const crc32 = (bytes: Uint8Array) => {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
};

const readChunkType = (bytes: Uint8Array, offset: number) =>
  String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));

export const setPngDpi = (
  png: Uint8Array,
  dpi: number,
): Uint8Array<ArrayBuffer> => {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const pixelsPerMetre = Math.round(dpi * INCHES_PER_METRE);
  const chunk = new Uint8Array(21);
  const chunkView = new DataView(chunk.buffer);
  const parts: Uint8Array[] = [png.subarray(0, PNG_SIGNATURE_LENGTH)];
  let offset = PNG_SIGNATURE_LENGTH;

  chunkView.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4);
  chunkView.setUint32(8, pixelsPerMetre);
  chunkView.setUint32(12, pixelsPerMetre);
  chunk[16] = 1;
  chunkView.setUint32(17, crc32(chunk.subarray(4, 17)));

  while (offset < png.length) {
    const end = offset + 12 + view.getUint32(offset);
    const type = readChunkType(png, offset);

    if (type !== "pHYs") {
      parts.push(png.subarray(offset, end));
    }

    if (type === "IHDR") {
      parts.push(chunk);
    }

    offset = end;
  }

  const result = new Uint8Array(
    parts.reduce((sum, part) => sum + part.length, 0),
  );
  let position = 0;

  for (const part of parts) {
    result.set(part, position);
    position += part.length;
  }

  return result;
};

export const findOpaqueBounds = (
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
): PrintDesignBox | null => {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (rgba[(y * width + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return maxX < 0
    ? null
    : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

export const findOutsideOfOutline = (
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8Array => {
  const outside = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const visit = (index: number) => {
    if (outside[index] === 0 && rgba[index * 4 + 3] === 0) {
      outside[index] = 1;
      queue[tail] = index;
      tail += 1;
    }
  };

  for (let x = 0; x < width; x += 1) {
    visit(x);
    visit((height - 1) * width + x);
  }

  for (let y = 0; y < height; y += 1) {
    visit(y * width);
    visit(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head];
    const x = index % width;

    head += 1;

    if (x > 0) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < width * (height - 1)) visit(index + width);
  }

  return outside;
};
