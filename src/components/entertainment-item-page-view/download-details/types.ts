import type { ReactNode } from "react";

import type { LocalizedEntertainmentItem } from "@/types/entertainment";

export type EntertainmentDownloadDetailsProps = {
  item: LocalizedEntertainmentItem;
  categoryLabel: string;
  downloadLabel: string;
  openPdfLabel: string;
  children?: ReactNode;
};
