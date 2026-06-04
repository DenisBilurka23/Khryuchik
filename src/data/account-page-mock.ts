import type { Locale } from "@/i18n/config";

export type AccountDownloadMock = {
  title: string;
  format: string;
  size: string;
};

export type AccountAddressMock = {
  title: string;
  line1: string;
  line2: string;
  line3: string;
};

export type AccountPageMockData = {
  downloads: AccountDownloadMock[];
  addresses: AccountAddressMock[];
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
    addresses: isRussian
      ? [
          {
            title: "Дом",
            line1: "Минск",
            line2: "Проспект Победителей, 12",
            line3: "Беларусь",
          },
          {
            title: "Подарки",
            line1: "Toronto, ON",
            line2: "Front St W, 115",
            line3: "Canada",
          },
        ]
      : [
          {
            title: "Home",
            line1: "Toronto, ON",
            line2: "Front St W, 115",
            line3: "Canada",
          },
          {
            title: "Gifts",
            line1: "Minsk",
            line2: "Prospekt Pobediteley, 12",
            line3: "Belarus",
          },
        ],
  };
};