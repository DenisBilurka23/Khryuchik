export type AccountPasswordFieldProps = {
  label: string;
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
  required?: boolean;
  showPasswordLabel: string;
  hidePasswordLabel: string;
};
