import { crc32 } from "node:zlib";

import { describe, expect, it } from "vitest";

import {
  artCoversBox,
  centerArtOnBox,
  clampPrintScale,
  findOpaqueBounds,
  findOutsideOfOutline,
  fitArtToBox,
  getEffectiveDpi,
  getPrintDpiQuality,
  scaleArtAround,
  setPngDpi,
} from "@/utils/print-design";

const BLEED = { x: 508, y: 69, width: 1845, height: 2725 };

const drawSquareOutline = (size: number, from: number, to: number) => {
  const rgba = new Uint8ClampedArray(size * size * 4);
  const paint = (x: number, y: number) => {
    rgba[(y * size + x) * 4 + 3] = 255;
  };

  for (let i = from; i <= to; i += 1) {
    paint(i, from);
    paint(i, to);
    paint(from, i);
    paint(to, i);
  }

  return rgba;
};

describe("fitArtToBox", () => {
  it("scales the artwork until it covers the box and centres it", () => {
    const art = { width: 1600, height: 2400 };
    const layout = fitArtToBox(art, BLEED);

    expect(layout.scale).toBeCloseTo(1.153125, 6);
    expect(layout.x).toBeCloseTo(508, 6);
    expect(artCoversBox(layout, art, BLEED)).toBe(true);
    expect(layout.y + (art.height * layout.scale) / 2).toBeCloseTo(
      BLEED.y + BLEED.height / 2,
      6,
    );
  });

  it("shrinks a large artwork down to the box instead of overflowing it", () => {
    const art = { width: 6000, height: 6000 };
    const layout = fitArtToBox(art, BLEED);

    expect(layout.scale).toBeCloseTo(2725 / 6000, 6);
    expect(layout.scale).toBeLessThan(1);
    expect(artCoversBox(layout, art, BLEED)).toBe(true);
  });
});

describe("artCoversBox", () => {
  const art = { width: 2000, height: 3000 };

  it("notices a gap on any side", () => {
    const covering = centerArtOnBox(art, BLEED, 1);

    expect(artCoversBox(covering, art, BLEED)).toBe(true);
    expect(artCoversBox({ ...covering, x: BLEED.x + 10 }, art, BLEED)).toBe(
      false,
    );
    expect(
      artCoversBox(
        { ...covering, y: BLEED.y + BLEED.height - 3000 - 10 },
        art,
        BLEED,
      ),
    ).toBe(false);
  });

  it("forgives sub-pixel rounding", () => {
    const covering = centerArtOnBox(art, BLEED, 1);

    expect(artCoversBox({ ...covering, x: BLEED.x + 0.4 }, art, BLEED)).toBe(
      true,
    );
  });
});

describe("scaleArtAround", () => {
  it("keeps the point under the cursor in place", () => {
    const layout = { x: 100, y: 200, scale: 1 };
    const anchor = { x: 600, y: 700 };
    const scaled = scaleArtAround(layout, 2, anchor);

    expect(scaled.scale).toBe(2);
    expect((anchor.x - scaled.x) / scaled.scale).toBeCloseTo(
      (anchor.x - layout.x) / layout.scale,
      6,
    );
    expect((anchor.y - scaled.y) / scaled.scale).toBeCloseTo(
      (anchor.y - layout.y) / layout.scale,
      6,
    );
  });

  it("refuses absurd scales", () => {
    expect(clampPrintScale(0)).toBeGreaterThan(0);
    expect(
      scaleArtAround({ x: 0, y: 0, scale: 1 }, 1000, { x: 0, y: 0 }).scale,
    ).toBe(clampPrintScale(1000));
  });
});

describe("findOpaqueBounds", () => {
  it("finds the drawn part of a layer", () => {
    expect(findOpaqueBounds(drawSquareOutline(20, 3, 15), 20, 20)).toEqual({
      x: 3,
      y: 3,
      width: 13,
      height: 13,
    });
    expect(
      findOpaqueBounds(new Uint8ClampedArray(10 * 10 * 4), 10, 10),
    ).toBeNull();
  });
});

describe("findOutsideOfOutline", () => {
  it("floods everything outside a closed outline and nothing inside", () => {
    const size = 20;
    const outside = findOutsideOfOutline(
      drawSquareOutline(size, 3, 15),
      size,
      size,
    );

    expect(outside[0]).toBe(1);
    expect(outside[19 * size + 19]).toBe(1);
    expect(outside[9 * size + 9]).toBe(0);
    expect(outside[3 * size + 3]).toBe(0);
  });

  it("leaks inside when the outline has a gap", () => {
    const size = 20;
    const rgba = drawSquareOutline(size, 3, 15);

    rgba[(3 * size + 9) * 4 + 3] = 0;

    expect(findOutsideOfOutline(rgba, size, size)[9 * size + 9]).toBe(1);
  });
});

describe("print resolution", () => {
  it("lowers the effective DPI as the artwork is enlarged", () => {
    expect(getEffectiveDpi(150, 1)).toBe(150);
    expect(getEffectiveDpi(150, 0.5)).toBe(300);
    expect(getEffectiveDpi(150, 1.25)).toBe(120);
  });

  it("grades it with JetPrint's thresholds", () => {
    expect(getPrintDpiQuality(150)).toBe("good");
    expect(getPrintDpiQuality(149)).toBe("normal");
    expect(getPrintDpiQuality(100)).toBe("normal");
    expect(getPrintDpiQuality(99)).toBe("bad");
  });
});

describe("setPngDpi", () => {
  const chunk = (type: string, data: Uint8Array) => {
    const bytes = new Uint8Array(12 + data.length);
    const view = new DataView(bytes.buffer);

    view.setUint32(0, data.length);
    bytes.set(Buffer.from(type, "latin1"), 4);
    bytes.set(data, 8);
    view.setUint32(8 + data.length, crc32(bytes.subarray(4, 8 + data.length)));

    return bytes;
  };

  const png = (...chunks: Uint8Array[]) =>
    new Uint8Array(
      Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        ...chunks,
      ]),
    );

  const readChunks = (bytes: Uint8Array) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const chunks: { type: string; data: Uint8Array; crcOk: boolean }[] = [];
    let offset = 8;

    while (offset < bytes.length) {
      const length = view.getUint32(offset);
      const type = Buffer.from(bytes.subarray(offset + 4, offset + 8)).toString(
        "latin1",
      );
      const data = bytes.subarray(offset + 8, offset + 8 + length);
      const crc = view.getUint32(offset + 8 + length);

      chunks.push({
        type,
        data,
        crcOk: crc === crc32(bytes.subarray(offset + 4, offset + 8 + length)),
      });
      offset += 12 + length;
    }

    return chunks;
  };

  const ihdr = chunk("IHDR", new Uint8Array(13));
  const iend = chunk("IEND", new Uint8Array(0));

  it("adds a 150 DPI pHYs chunk right after IHDR", () => {
    const chunks = readChunks(setPngDpi(png(ihdr, iend), 150));
    const phys = new DataView(chunks[1].data.buffer, chunks[1].data.byteOffset);

    expect(chunks.map(({ type }) => type)).toEqual(["IHDR", "pHYs", "IEND"]);
    expect(chunks.every(({ crcOk }) => crcOk)).toBe(true);
    expect(phys.getUint32(0)).toBe(5906);
    expect(phys.getUint32(4)).toBe(5906);
    expect(chunks[1].data[8]).toBe(1);
  });

  it("replaces a pHYs chunk that is already there", () => {
    const existing = chunk("pHYs", new Uint8Array(9));
    const chunks = readChunks(setPngDpi(png(ihdr, existing, iend), 300));

    expect(chunks.map(({ type }) => type)).toEqual(["IHDR", "pHYs", "IEND"]);
    expect(
      new DataView(chunks[1].data.buffer, chunks[1].data.byteOffset).getUint32(
        0,
      ),
    ).toBe(11811);
  });
});
