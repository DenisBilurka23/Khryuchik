import "server-only";

export const parseString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
};

export const parseOptionalString = (formData: FormData, key: string) => {
  const value = parseString(formData, key).trim();

  return value || undefined;
};

export const parseNumber = (formData: FormData, key: string, fallback = 0) => {
  const value = Number(parseString(formData, key));

  return Number.isFinite(value) ? value : fallback;
};

export const parseOptionalNumber = (formData: FormData, key: string) => {
  const rawValue = parseString(formData, key).trim();

  if (!rawValue) {
    return undefined;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : undefined;
};

export const parseBoolean = (formData: FormData, key: string) =>
  formData.get(key) === "on";

export const parseCsvList = (formData: FormData, key: string) =>
  parseString(formData, key)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

export const parseMultilineList = (formData: FormData, key: string) =>
  parseString(formData, key)
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);

export const parseJsonField = <T>(
  formData: FormData,
  key: string,
  fallback: T,
): T => {
  const rawValue = parseString(formData, key).trim();

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    throw new Error(`Invalid JSON in field: ${key}`);
  }
};
