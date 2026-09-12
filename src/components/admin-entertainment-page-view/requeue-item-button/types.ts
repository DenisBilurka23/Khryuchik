export type RequeueEntertainmentItemButtonProps = {
  slug: string;
  action: (formData: FormData) => Promise<void>;
  size?: "small" | "medium" | "large";
};
