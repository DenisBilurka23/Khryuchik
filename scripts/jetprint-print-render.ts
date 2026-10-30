import { readFileSync } from "node:fs";

import { initializeCanvas, type Layer, readPsd } from "ag-psd";
import sharp, { type OverlayOptions } from "sharp";

import type { JetprintArtLayer } from "./jetprint-product-parse";

type GuideLayer = {
  left: number;
  top: number;
  width: number;
  height: number;
  pixels: Buffer;
};

export type PrintTemplateInfo = {
  width: number;
  height: number;
  dpi: number;
  guides: {
    width: number;
    height: number;
    layers: GuideLayer[];
  };
};

export type RenderableArtLayer = JetprintArtLayer & { source: Buffer };

const DEFAULT_DPI = 150;
const ASPECT_TOLERANCE = 0.01;
const GUIDE_LAYER_PATTERN = /bleed|hem|safe|guide|print area|overlays/i;
const GUIDE_OPACITY = 0.4;
const PREVIEW_WIDTH = 1200;
const PREVIEW_BACKGROUND = "#d9d9d9";

initializeCanvas(
  () => {
    throw new Error("Canvas is not available in scripts");
  },
  (width, height) =>
    ({
      width,
      height,
      data: new Uint8ClampedArray(width * height * 4),
      colorSpace: "srgb",
    }) as ImageData,
);

const flattenLayers = (layers: Layer[] = []): Layer[] =>
  layers.flatMap((layer) => [layer, ...flattenLayers(layer.children)]);

const coversWholeCanvas = (layer: Layer, width: number, height: number) =>
  (layer.left ?? 0) <= 0 &&
  (layer.top ?? 0) <= 0 &&
  (layer.right ?? 0) >= width &&
  (layer.bottom ?? 0) >= height;

const toGuideLayer = (layer: Layer): GuideLayer[] => {
  const image = layer.imageData;

  if (!image || image.width === 0 || image.height === 0) {
    return [];
  }

  return [
    {
      left: layer.left ?? 0,
      top: layer.top ?? 0,
      width: image.width,
      height: image.height,
      pixels: Buffer.from(
        image.data.buffer,
        image.data.byteOffset,
        image.data.byteLength,
      ),
    },
  ];
};

export const readPrintTemplate = (psdPath: string): PrintTemplateInfo => {
  const psd = readPsd(readFileSync(psdPath), {
    useImageData: true,
    skipCompositeImageData: true,
    skipThumbnail: true,
  });

  return {
    width: psd.width,
    height: psd.height,
    dpi: Math.round(
      psd.imageResources?.resolutionInfo?.horizontalResolution ?? DEFAULT_DPI,
    ),
    guides: {
      width: psd.width,
      height: psd.height,
      layers: flattenLayers(psd.children)
        .filter(
          (layer) =>
            !layer.children &&
            GUIDE_LAYER_PATTERN.test(layer.name ?? "") &&
            !coversWholeCanvas(layer, psd.width, psd.height),
        )
        .flatMap(toGuideLayer),
    },
  };
};

export const fitTemplateToPrintArea = (
  template: PrintTemplateInfo,
  area: { width: number; height: number },
): PrintTemplateInfo => {
  const ratio = area.width / template.width;

  if (Math.abs(area.height / template.height - ratio) > ASPECT_TOLERANCE) {
    throw new Error(
      `The template (${template.width}x${template.height}) and the factory print area (${area.width}x${area.height}) have different proportions`,
    );
  }

  return {
    ...template,
    width: area.width,
    height: area.height,
    dpi: Math.round(template.dpi * ratio),
  };
};

const toOverlay = async (
  template: PrintTemplateInfo,
  layer: RenderableArtLayer,
): Promise<OverlayOptions | null> => {
  const width = Math.round(layer.width);
  const height = Math.round(layer.height);
  const x = Math.round(layer.x);
  const y = Math.round(layer.y);
  const cropLeft = Math.max(0, -x);
  const cropTop = Math.max(0, -y);
  const cropWidth = Math.min(width - cropLeft, template.width - Math.max(0, x));
  const cropHeight = Math.min(
    height - cropTop,
    template.height - Math.max(0, y),
  );

  if (cropWidth <= 0 || cropHeight <= 0) {
    return null;
  }

  let image = sharp(layer.source, { limitInputPixels: false });

  if (layer.flipX) {
    image = image.flop();
  }

  if (layer.flipY) {
    image = image.flip();
  }

  const resized = await image
    .resize(width, height, { fit: "fill", kernel: "lanczos3" })
    .png()
    .toBuffer();

  return {
    input: await sharp(resized)
      .extract({
        left: cropLeft,
        top: cropTop,
        width: cropWidth,
        height: cropHeight,
      })
      .toBuffer(),
    left: Math.max(0, x),
    top: Math.max(0, y),
  };
};

export const renderPrintFile = async (
  template: PrintTemplateInfo,
  layers: RenderableArtLayer[],
) => {
  const overlays = (
    await Promise.all(layers.map((layer) => toOverlay(template, layer)))
  ).filter((overlay): overlay is OverlayOptions => overlay !== null);

  return sharp({
    create: {
      width: template.width,
      height: template.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(overlays)
    .png()
    .withMetadata({ density: template.dpi })
    .toBuffer();
};

export const getArtEffectiveDpi = async (
  template: PrintTemplateInfo,
  layer: RenderableArtLayer,
) => {
  const { width } = await sharp(layer.source, {
    limitInputPixels: false,
  }).metadata();

  return width ? Math.round((template.dpi * width) / layer.width) : 0;
};

const toGuideOverlay = async (
  layer: GuideLayer,
  canvasWidth: number,
  canvasHeight: number,
): Promise<OverlayOptions[]> => {
  const left = Math.max(0, layer.left);
  const top = Math.max(0, layer.top);
  const width = Math.min(layer.left + layer.width, canvasWidth) - left;
  const height = Math.min(layer.top + layer.height, canvasHeight) - top;

  if (width <= 0 || height <= 0) {
    return [];
  }

  const input = await sharp(layer.pixels, {
    raw: { width: layer.width, height: layer.height, channels: 4 },
  })
    .extract({
      left: left - layer.left,
      top: top - layer.top,
      width,
      height,
    })
    .png()
    .toBuffer();

  return [{ input, left, top }];
};

const renderGuides = async (template: PrintTemplateInfo, width: number) => {
  const { guides } = template;
  const overlays = await Promise.all(
    guides.layers.map((layer) =>
      toGuideOverlay(layer, guides.width, guides.height),
    ),
  );
  const canvas = await sharp({
    create: {
      width: guides.width,
      height: guides.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(overlays.flat())
    .png()
    .toBuffer();

  return sharp(canvas)
    .resize(width)
    .linear([1, 1, 1, GUIDE_OPACITY], [0, 0, 0, 0])
    .png()
    .toBuffer();
};

export const renderPrintPreview = async (
  template: PrintTemplateInfo,
  printFile: Buffer,
) => {
  const height = Math.round((template.height * PREVIEW_WIDTH) / template.width);

  return sharp({
    create: {
      width: PREVIEW_WIDTH,
      height,
      channels: 4,
      background: PREVIEW_BACKGROUND,
    },
  })
    .composite([
      { input: await sharp(printFile).resize(PREVIEW_WIDTH).toBuffer() },
      { input: await renderGuides(template, PREVIEW_WIDTH) },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();
};
