import type { ReactNode } from "react";

export type AdminSectionCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};