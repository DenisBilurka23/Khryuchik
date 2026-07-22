export type AdminSelectOption = {
  code: string;
  label: string;
};

export type AdminSelectFieldProps = {
  name: string;
  label: string;
  options: AdminSelectOption[];
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  noOptionsText?: string;
  onValueChangeAction?: (code: string | null) => void;
};
