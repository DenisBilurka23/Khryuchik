import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary } from "@/i18n/types";

export type AccountOrderMock = {
  id: string;
  date: string;
  status: string;
  total: string;
  items: string;
};

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

export type AccountFavoriteMock = {
  title: string;
  subtitle: string;
  price: string;
  emoji: string;
  category: string;
  availability: string;
  badge: string;
  availabilityTone: "in-stock" | "warning" | "preorder";
};

export type AccountFavoriteSuggestionMock = {
  title: string;
  subtitle: string;
  emoji: string;
};

export type AccountPageMockData = {
  orders: AccountOrderMock[];
  downloads: AccountDownloadMock[];
  addresses: AccountAddressMock[];
  favorites: AccountFavoriteMock[];
  favoriteSuggestions: AccountFavoriteSuggestionMock[];
  favoritesTotal: string;
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
            category: "Для дома",
            availability: "В наличии",
            badge: "Хит",
            availabilityTone: "in-stock",
          },
          {
            title: "Футболка Хрючик",
            subtitle: "Spring drop",
            price: "49 BYN",
            emoji: "👕",
            category: "Одежда",
            availability: "Осталось 3",
            badge: "Лимит",
            availabilityTone: "warning",
          },
          {
            title: "Стикеры Хрючик",
            subtitle: "Fun pack",
            price: "12 BYN",
            emoji: "✨",
            category: "Аксессуары",
            availability: "В наличии",
            badge: "Новинка",
            availabilityTone: "in-stock",
          },
          {
            title: "Подарочный бокс Хрючик",
            subtitle: "Winter collection",
            price: "79 BYN",
            emoji: "🎁",
            category: "Подарки",
            availability: "Предзаказ",
            badge: "Популярно",
            availabilityTone: "preorder",
          },
        ]
      : [
          {
            title: "Khryuchik mug",
            subtitle: "Gift collection",
            price: "24 BYN",
            emoji: "☕",
            category: "Home",
            availability: "In stock",
            badge: "Bestseller",
            availabilityTone: "in-stock",
          },
          {
            title: "Khryuchik T-shirt",
            subtitle: "Spring drop",
            price: "49 BYN",
            emoji: "👕",
            category: "Clothes",
            availability: "Only 3 left",
            badge: "Limited",
            availabilityTone: "warning",
          },
          {
            title: "Khryuchik stickers",
            subtitle: "Fun pack",
            price: "12 BYN",
            emoji: "✨",
            category: "Accessories",
            availability: "In stock",
            badge: "New",
            availabilityTone: "in-stock",
          },
          {
            title: "Khryuchik gift box",
            subtitle: "Winter collection",
            price: "79 BYN",
            emoji: "🎁",
            category: "Gifts",
            availability: "Preorder",
            badge: "Popular",
            availabilityTone: "preorder",
          },
        ],
    favoriteSuggestions: isRussian
      ? [
          {
            title: "Плюшевый Хрючик",
            subtitle: "Подобрано на основе вашего избранного",
            emoji: "🧸",
          },
          {
            title: "Новая книга Хрючика",
            subtitle: "Подобрано на основе вашего избранного",
            emoji: "📕",
          },
          {
            title: "Арома-свеча Хрючик",
            subtitle: "Подобрано на основе вашего избранного",
            emoji: "🕯️",
          },
        ]
      : [
          {
            title: "Khryuchik plush toy",
            subtitle: "Picked based on your wishlist",
            emoji: "🧸",
          },
          {
            title: "New Khryuchik book",
            subtitle: "Picked based on your wishlist",
            emoji: "📕",
          },
          {
            title: "Khryuchik aroma candle",
            subtitle: "Picked based on your wishlist",
            emoji: "🕯️",
          },
        ],
    favoritesTotal: "164 BYN",
  };
};