const POSTAL_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 -]{0,10}[A-Za-z0-9]$/;

export const isPostalCodeValid = (value: string) =>
  POSTAL_CODE_PATTERN.test(value.trim());
