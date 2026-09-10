import type { AccountDownload, OrderDownload } from "@/types/download";

export type DownloadRowProps = {
  download: AccountDownload | OrderDownload;
  actionLabel: string;
};
