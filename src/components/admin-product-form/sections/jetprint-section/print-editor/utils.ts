import type { Layer, Psd } from "ag-psd";

import {
  PRINT_DESIGN_CUT_MASK_RGBA,
  PRINT_DESIGN_DEFAULT_DPI,
  PRINT_DESIGN_LAYER_MATCHERS,
} from "@/constants/print-design";
import { findOpaqueBounds, findOutsideOfOutline, setPngDpi } from "@/utils";

import type {
  EditablePrintArt,
  EditablePrintDesign,
  EditablePrintTemplate,
  PrintTemplateImportErrorCode,
} from "./types";

export class PrintTemplateImportError extends Error {
  constructor(readonly code: PrintTemplateImportErrorCode) {
    super(code);
    this.name = "PrintTemplateImportError";
  }
}

const collectLayers = (layers: Layer[] | undefined): Layer[] =>
  (layers ?? []).flatMap((layer) => [layer, ...collectLayers(layer.children)]);

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  return canvas;
};

const getContext = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("canvas-unavailable");
  }

  return context;
};

const canvasToFile = (canvas: HTMLCanvasElement, fileName: string) =>
  new Promise<File>((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], fileName, { type: "image/png" }));
      } else {
        reject(new Error("canvas-export-failed"));
      }
    }, "image/png"),
  );

const drawLayer = (context: CanvasRenderingContext2D, layer: Layer) => {
  if (layer.canvas) {
    context.drawImage(layer.canvas, layer.left ?? 0, layer.top ?? 0);
  }
};

const toAsset = (file: File) => ({ url: URL.createObjectURL(file), file });

const CENTIMETRES_PER_INCH = 2.54;

const readTemplateDpi = (psd: Psd) => {
  const info = psd.imageResources?.resolutionInfo;

  if (!info?.horizontalResolution) {
    return PRINT_DESIGN_DEFAULT_DPI;
  }

  return Math.round(
    info.horizontalResolutionUnit === "PPCM"
      ? info.horizontalResolution * CENTIMETRES_PER_INCH
      : info.horizontalResolution,
  );
};

export const importPrintTemplate = async (
  file: File,
): Promise<EditablePrintTemplate> => {
  const { readPsd } = await import("ag-psd");
  let psd: ReturnType<typeof readPsd>;

  try {
    psd = readPsd(await file.arrayBuffer(), {
      skipCompositeImageData: true,
      skipThumbnail: true,
    });
  } catch {
    throw new PrintTemplateImportError("unreadable");
  }

  const layers = collectLayers(psd.children);
  const findLayer = (matcher: RegExp) =>
    layers.find(
      (layer) =>
        !layer.children && layer.canvas && matcher.test(layer.name ?? ""),
    );
  const bleed = findLayer(PRINT_DESIGN_LAYER_MATCHERS.bleed);
  const hem = findLayer(PRINT_DESIGN_LAYER_MATCHERS.hem);
  const safe = findLayer(PRINT_DESIGN_LAYER_MATCHERS.safe);

  if (!bleed || !hem || !safe) {
    throw new PrintTemplateImportError("missing-layers");
  }

  const { width, height } = psd;
  const bleedContext = getContext(createCanvas(width, height));
  const safeContext = getContext(createCanvas(width, height));

  drawLayer(bleedContext, bleed);
  drawLayer(safeContext, safe);

  const bleedPixels = bleedContext.getImageData(0, 0, width, height).data;
  const bleedBox = findOpaqueBounds(bleedPixels, width, height);
  const safeBox = findOpaqueBounds(
    safeContext.getImageData(0, 0, width, height).data,
    width,
    height,
  );

  if (!bleedBox || !safeBox) {
    throw new PrintTemplateImportError("missing-layers");
  }

  const outside = findOutsideOfOutline(bleedPixels, width, height);
  const maskCanvas = createCanvas(width, height);
  const maskContext = getContext(maskCanvas);
  const mask = maskContext.createImageData(width, height);
  const [red, green, blue, alpha] = PRINT_DESIGN_CUT_MASK_RGBA;

  outside.forEach((isOutside, index) => {
    if (isOutside) {
      mask.data[index * 4] = red;
      mask.data[index * 4 + 1] = green;
      mask.data[index * 4 + 2] = blue;
      mask.data[index * 4 + 3] = alpha;
    }
  });
  maskContext.putImageData(mask, 0, 0);

  const guidesCanvas = createCanvas(width, height);
  const guidesContext = getContext(guidesCanvas);

  drawLayer(guidesContext, bleed);
  drawLayer(guidesContext, hem);
  drawLayer(guidesContext, safe);

  const [guidesFile, cutMaskFile] = await Promise.all([
    canvasToFile(guidesCanvas, "template-guides.png"),
    canvasToFile(maskCanvas, "template-cut-mask.png"),
  ]);

  return {
    width,
    height,
    dpi: readTemplateDpi(psd),
    bleedBox,
    safeBox,
    guides: toAsset(guidesFile),
    cutMask: toAsset(cutMaskFile),
  };
};

export const loadImage = (src: string, isRemote: boolean) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    if (isRemote) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

export const readArtFile = async (file: File): Promise<EditablePrintArt> => {
  const source = toAsset(file);
  const image = await loadImage(source.url, false);

  return { width: image.naturalWidth, height: image.naturalHeight, source };
};

export const renderPrintFile = async (
  design: EditablePrintDesign,
): Promise<File> => {
  const { template, art, layout } = design;
  const image = await loadImage(art.source.url, !art.source.file);
  const canvas = createCanvas(template.width, template.height);
  const context = getContext(canvas);

  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    layout.x,
    layout.y,
    art.width * layout.scale,
    art.height * layout.scale,
  );

  const rendered = await canvasToFile(canvas, "print-file.png");
  const withDpi = setPngDpi(
    new Uint8Array(await rendered.arrayBuffer()),
    template.dpi,
  );

  return new File([withDpi], rendered.name, { type: "image/png" });
};
