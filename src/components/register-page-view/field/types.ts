export type RegisterFieldType = "text" | "email" | "tel" | "password";

export type RegisterFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
  type?: RegisterFieldType;
};
