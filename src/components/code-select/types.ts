export type CodeOption = {
  code: string;
  label: string;
};

export type CodeSelectProps = {
  value: string;
  options: CodeOption[];
  label: string;
  onChange: (code: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  aliasesOf?: (option: CodeOption) => string[];
  inputName: string;
  autoComplete: string;
};
