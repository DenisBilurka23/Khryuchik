import { CircularProgress } from "@mui/material";

import { NoticePage } from "@/components/notice-page";

import type { NoticePageLoadingProps } from "./types";

export const NoticePageLoading = ({ title, text }: NoticePageLoadingProps) => (
  <NoticePage title={title} text={text}>
    <CircularProgress size={32} aria-label={title} />
  </NoticePage>
);

export type { NoticePageLoadingProps } from "./types";
