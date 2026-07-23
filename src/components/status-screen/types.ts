import type { ReactNode } from "react";

export type StatusScreenAction =
  | {
      kind: "link";
      label: string;
      href: string;
      variant: "primary" | "ghost";
    }
  | {
      kind: "button";
      label: string;
      onClick: () => void;
      variant: "primary" | "ghost";
    };

export type StatusScreenProps = {
  emoji: string;
  blobTone?: "pink" | "warm";
  code?: string;
  title: string;
  titleTone?: "default" | "danger";
  text: string;
  actions: StatusScreenAction[];
  showFloats?: boolean;
  footer?: ReactNode;
};
