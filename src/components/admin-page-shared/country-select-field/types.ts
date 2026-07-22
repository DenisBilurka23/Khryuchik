export type AdminCountrySelectFieldProps = {
  name: string;
  label: string;
  locale: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  noOptionsText?: string;
  excludeCodes?: string[];
  onValueChangeAction?: (code: string | null) => void;
};
