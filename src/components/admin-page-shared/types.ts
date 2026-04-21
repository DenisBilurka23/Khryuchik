import type { ReactNode } from "react";

export type AdminSectionCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export type AdminStatCardProps = {
  title: string;
  value: string | number;
  note: string;
};

export type AdminStatusChipTone = "success" | "warning" | "info" | "neutral" | "accent";

export type AdminStatusChipProps = {
  label: string;
  tone?: AdminStatusChipTone;
};

export type AdminPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
};

export type AdminEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};