export type ReviewButtonTone = "accent" | "done";

export type ReviewButtonProps = {
  tone: ReviewButtonTone;
  label: string;
  onClick: () => void;
};
