import type { Locale } from "@/i18n/config";

export type AccountDownloadMock = {
  title: string;
  format: string;
  size: string;
};

export type AccountPageMockData = {
  downloads: AccountDownloadMock[];
};

export const getAccountPageMockData = (
  locale: Locale,
): AccountPageMockData => {
  const isRussian = locale === "ru";

  return {
    downloads: isRussian
      ? [
          { title: "Хрючик зимой — RU PDF", format: "PDF", size: "18 MB" },
          { title: "Хрючик и друзья — RU PDF", format: "PDF", size: "14 MB" },
        ]
      : [
          { title: "Khryuchik in Winter — EN PDF", format: "PDF", size: "18 MB" },
          { title: "Khryuchik and Friends — EN EPUB", format: "EPUB", size: "6 MB" },
        ],
  };
};