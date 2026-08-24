export type RegionSelectProps = {
  value: string;
  country: string;
  label: string;
  onChange: (code: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
};
