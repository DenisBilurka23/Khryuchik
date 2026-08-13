export type CountryOption = {
  code: string;
  label: string;
};

export type CountrySelectProps = {
  value: string;
  options: CountryOption[];
  label: string;
  onChange: (code: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
};
