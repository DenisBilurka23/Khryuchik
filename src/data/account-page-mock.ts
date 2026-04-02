import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary } from "@/i18n/types";

type AccountOrderMock = {
  id: string;
  date: string;
  status: string;
  total: string;
  items: string;
};

type AccountDownloadMock = {
  title: string;
  format: string;
  size: string;
};

type AccountAddressMock = {
  title: string;
  line1: string;
  line2: string;
  line3: string;
};

type AccountFavoriteMock = {
  title: string;
  subtitle: string;
  price: string;
  emoji: string;
};

type AccountPageMockData = {
  orders: AccountOrderMock[];
  downloads: AccountDownloadMock[];
  addresses: AccountAddressMock[];
  favorites: AccountFavoriteMock[];
};

export const getAccountPageMockData = (
  locale: Locale,
  dictionary: AccountPageDictionary,
): AccountPageMockData => {
  const isRussian = locale === "ru";

  return {
    orders: [
      {
        id: "#KH-2048",
        date: "25 Mar 2026",
        status: dictionary.delivered,
        total: "73 BYN",
        items: isRussian ? "Книга + кружка + наклейки" : "Book + mug + stickers",
      },
      {
        id: "#KH-1984",
        date: "12 Mar 2026",
        status: dictionary.inDelivery,
        total: "49 BYN",
        items: isRussian ? "Футболка Хрючик" : "Khryuchik T-shirt",
      },
    ],
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
    favorites: isRussian
      ? [
          {
            title: "Кружка Хрючик",
            subtitle: "Gift collection",
            price: "24 BYN",
            emoji: "☕",
          },
          {
            title: "Футболка Хрючик",
            subtitle: "Spring drop",
            price: "49 BYN",
            emoji: "👕",
          },
        ]
      : [
          {
            title: "Khryuchik mug",
            subtitle: "Gift collection",
            price: "24 BYN",
            emoji: "☕",
          },
          {
            title: "Khryuchik T-shirt",
            subtitle: "Spring drop",
            price: "49 BYN",
            emoji: "👕",
          },
        ],
  };
};