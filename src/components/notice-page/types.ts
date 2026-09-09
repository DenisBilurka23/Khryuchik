import type { ReactNode } from "react";

export type NoticePageProps = {
  title: string;
  label?: ReactNode;
  text: ReactNode;
  children?: ReactNode;
};
