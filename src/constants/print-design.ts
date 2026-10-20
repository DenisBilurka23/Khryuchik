export const PRINT_DESIGN_DEFAULT_DPI = 150;

export const PRINT_DESIGN_DPI_GOOD_MIN = 150;

export const PRINT_DESIGN_DPI_NORMAL_MIN = 100;

export const PRINT_DESIGN_MIN_SCALE = 0.02;

export const PRINT_DESIGN_MAX_SCALE = 10;

export const PRINT_DESIGN_COVER_TOLERANCE_PX = 0.5;

export const PRINT_DESIGN_NUDGE_PX = 4;

export const PRINT_DESIGN_NUDGE_FAST_PX = 40;

export const PRINT_DESIGN_WHEEL_ZOOM_STEP = 1.05;

export const PRINT_DESIGN_ARROW_OFFSETS: Partial<
  Record<string, readonly [number, number]>
> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export const PRINT_DESIGN_CUT_MASK_RGBA = [24, 18, 12, 150] as const;

export const PRINT_DESIGN_LAYER_MATCHERS = {
  bleed: /bleed/i,
  hem: /hem/i,
  safe: /safe/i,
} as const;

export const PRINT_DESIGN_TEMPLATE_ACCEPT = ".psd,image/vnd.adobe.photoshop";

export const PRINT_DESIGN_ART_ACCEPT = "image/png,image/jpeg";
