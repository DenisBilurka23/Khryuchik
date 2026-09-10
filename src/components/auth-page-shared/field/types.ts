export type AuthFieldType = "text" | "email" | "tel" | "password";

export type AuthFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
  type?: AuthFieldType;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};
