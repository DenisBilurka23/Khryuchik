export type ImportPrintifyProductButtonProps = {
  printifyProductId: string;
  action: (formData: FormData) => Promise<void>;
  label: string;
  pendingLabel: string;
};

export type SubmitButtonProps = Pick<
  ImportPrintifyProductButtonProps,
  "label" | "pendingLabel"
>;
