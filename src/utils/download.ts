import type { AccountDownload, OrderDownload } from "@/types/download";

import { formatFileSize } from "./format-file-size";

export const getDownloadMeta = (download: AccountDownload | OrderDownload) => {
  const locale = "locale" in download ? download.locale : undefined;
  const languageName = locale
    ? (new Intl.DisplayNames([locale], { type: "language" }).of(locale) ??
      locale.toUpperCase())
    : undefined;

  return [
    download.format,
    download.sizeBytes ? formatFileSize(download.sizeBytes) : undefined,
    languageName,
  ]
    .filter(Boolean)
    .join(" • ");
};
