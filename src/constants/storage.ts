export const ORPHAN_MIN_AGE_MS = 24 * 60 * 60 * 1000;

export const ORPHAN_REPORT_SAMPLE_SIZE = 50;

export const ORPHAN_SWEEP_PREFIXES = {
  public: ["entertainment/", "products/"],
  private: ["entertainment/", "books/"],
} as const;
