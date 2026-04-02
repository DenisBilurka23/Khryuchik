import type { ReactNode } from "react";

export type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};