import type { Locale } from "@/i18n/config";
import type { ProductDetails } from "@/types/product-details";

const productDetailsMap: Record<Locale, Record<string, ProductDetails>> = {
  ru: {
    mug: {
      slug: "mug",
      title: "Кружка Хрючик",
      subtitle: "Уютная кружка для тёплых семейных историй",
      price: 24,
      oldPrice: 29,
      badge: "Хит недели",
      storyLabel: "Коллекция: Хрючик зимой",
      storyTitle: "Хрючик зимой",
      sku: "KHR-MUG-01",
      description:
        "Керамическая кружка с Хрючиком — тёплый подарок для ребёнка, родителей или семейной коллекции. Отлично подходит для чая, какао и уютных домашних вечеров.",
      images: [
        { id: "1", emoji: "☕", bgColor: "#FFF8F0" },
        { id: "2", emoji: "🐷", bgColor: "#FCE5EA" },
        { id: "3", emoji: "🎁", bgColor: "#FFF0C9" },
        { id: "4", emoji: "✨", bgColor: "#DDF3E8" },
      ],
      colors: [
        { label: "Молочный", value: "cream" },
        { label: "Розовый", value: "pink" },
      ],
      specs: [
        { label: "Материал", value: "Керамика" },
        { label: "Объём", value: "330 мл" },
        { label: "Уход", value: "Подходит для ручной мойки" },
        { label: "Коллекция", value: "Хрючик зимой" },
      ],
      delivery: [
        "Доставка по Беларуси 2-5 дней",
        "Международная доставка рассчитывается при оформлении",
        "Безопасная онлайн-оплата банковской картой",
      ],
      reviews: [
        {
          id: "r1",
          author: "Анна",
          date: "12 марта 2026",
          rating: 5,
          text: "Очень милая кружка. Ребёнок в восторге, теперь просит читать Хрючика каждый вечер.",
        },
        {
          id: "r2",
          author: "Елена",
          date: "8 марта 2026",
          rating: 5,
          text: "Качественная печать и очень уютный дизайн. Брала в подарок вместе с книгой.",
        },
      ],
      relatedIds: ["book-winter", "tshirt", "stickers"],
    },
    "book-winter": {
      slug: "book-winter",
      title: "Книга «Хрючик зимой»",
      subtitle: "Добрая зимняя история на русском и английском",
      price: 29,
      badge: "Новая книга",
      storyLabel: "Сюжетная история Хрючика",
      storyTitle: "Хрючик зимой",
      sku: "KHR-BOOK-01",
      description:
        "Тёплая семейная сказка, вдохновлённая жизненными событиями. Подходит для совместного чтения и подарка детям и родителям.",
      images: [
        { id: "1", emoji: "📘", bgColor: "#FCE5EA" },
        { id: "2", emoji: "📖", bgColor: "#FFF8F0" },
        { id: "3", emoji: "❄️", bgColor: "#DDF3E8" },
        { id: "4", emoji: "🐷", bgColor: "#FFF0C9" },
      ],
      languages: [
        { label: "Русский", value: "ru" },
        { label: "English", value: "en" },
      ],
      formats: [
        { label: "Печатная версия", value: "print" },
        { label: "PDF", value: "pdf" },
      ],
      specs: [
        { label: "Возраст", value: "3+" },
        { label: "Язык", value: "Русский / English" },
        { label: "Формат", value: "Печатная книга / PDF" },
        { label: "Коллекция", value: "Хрючик зимой" },
      ],
      delivery: [
        "PDF отправляется после оплаты",
        "Печатная версия доставляется 2-5 дней по Беларуси",
        "Доступна международная доставка",
      ],
      reviews: [
        {
          id: "r3",
          author: "Мария",
          date: "10 марта 2026",
          rating: 5,
          text: "Очень добрая история, ребёнок попросил читать её несколько раз подряд.",
        },
      ],
      relatedIds: ["mug", "tshirt", "stickers"],
    },
    "book-country-house": {
      slug: "book-country-house",
      title: "Книга «Хрючик на даче»",
      subtitle: "Летняя история о каникулах, семье и маленьких открытиях",
      price: 27,
      badge: "Семейная история",
      storyLabel: "Сюжетная история Хрючика",
      storyTitle: "Хрючик на даче",
      sku: "KHR-BOOK-02",
      description:
        "Светлая история о поездках на дачу, семейных воспоминаниях и тех самых летних днях, которые остаются с нами надолго.",
      images: [
        { id: "1", emoji: "📚", bgColor: "#FCE5EA" },
        { id: "2", emoji: "🌿", bgColor: "#DDF3E8" },
        { id: "3", emoji: "🏡", bgColor: "#FFF8F0" },
        { id: "4", emoji: "🐷", bgColor: "#FFF0C9" },
      ],
      languages: [
        { label: "Русский", value: "ru" },
        { label: "English", value: "en" },
      ],
      formats: [
        { label: "Печатная версия", value: "print" },
        { label: "PDF", value: "pdf" },
      ],
      specs: [
        { label: "Возраст", value: "3+" },
        { label: "Язык", value: "Русский / English" },
        { label: "Формат", value: "Печатная книга / PDF" },
        { label: "Тема", value: "Лето, семья, дача" },
      ],
      delivery: [
        "PDF отправляется после оплаты",
        "Печатная версия доставляется 2-5 дней по Беларуси",
        "Доступна международная доставка",
      ],
      reviews: [
        {
          id: "r6",
          author: "Татьяна",
          date: "5 марта 2026",
          rating: 5,
          text: "Очень тёплая и узнаваемая история. Напомнила наши семейные поездки за город.",
        },
      ],
      relatedIds: ["mug", "stickers", "book-winter"],
    },
    "book-friends": {
      slug: "book-friends",
      title: "Книга «Хрючик и друзья»",
      subtitle: "Добрая история о дружбе, заботе и совместных приключениях",
      price: 27,
      badge: "Для чтения перед сном",
      storyLabel: "Сюжетная история Хрючика",
      storyTitle: "Хрючик и друзья",
      sku: "KHR-BOOK-03",
      description:
        "Книга о том, как дружба, внимание друг к другу и маленькие добрые поступки делают каждый день теплее и интереснее.",
      images: [
        { id: "1", emoji: "📚", bgColor: "#FCE5EA" },
        { id: "2", emoji: "🤝", bgColor: "#FFF8F0" },
        { id: "3", emoji: "🐷", bgColor: "#FFF0C9" },
        { id: "4", emoji: "✨", bgColor: "#DDF3E8" },
      ],
      languages: [
        { label: "Русский", value: "ru" },
        { label: "English", value: "en" },
      ],
      formats: [
        { label: "Печатная версия", value: "print" },
        { label: "PDF", value: "pdf" },
      ],
      specs: [
        { label: "Возраст", value: "3+" },
        { label: "Язык", value: "Русский / English" },
        { label: "Формат", value: "Печатная книга / PDF" },
        { label: "Тема", value: "Дружба и забота" },
      ],
      delivery: [
        "PDF отправляется после оплаты",
        "Печатная версия доставляется 2-5 дней по Беларуси",
        "Доступна международная доставка",
      ],
      reviews: [
        {
          id: "r7",
          author: "Наталья",
          date: "1 марта 2026",
          rating: 5,
          text: "Очень добрая книга. Хорошо подходит для совместного чтения и разговоров с ребёнком.",
        },
      ],
      relatedIds: ["stickers", "mug", "book-winter"],
    },
    tshirt: {
      slug: "tshirt",
      title: "Футболка Хрючик",
      subtitle: "Мягкая футболка для прогулок, чтения и подарков",
      price: 49,
      badge: "Бестселлер",
      storyLabel: "Коллекция: Хрючик зимой",
      storyTitle: "Хрючик зимой",
      sku: "KHR-TEE-01",
      description:
        "Базовая футболка с мягким принтом Хрючика. Подходит детям и взрослым, легко сочетается с подарочными наборами и книгами.",
      images: [
        { id: "1", emoji: "👕", bgColor: "#FFF8F0" },
        { id: "2", emoji: "🐷", bgColor: "#FCE5EA" },
        { id: "3", emoji: "✨", bgColor: "#DDF3E8" },
        { id: "4", emoji: "🎁", bgColor: "#FFF0C9" },
      ],
      sizes: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
      ],
      colors: [
        { label: "Кремовый", value: "cream" },
        { label: "Пудровый", value: "rose" },
      ],
      specs: [
        { label: "Материал", value: "Хлопок 95%" },
        { label: "Посадка", value: "Свободная" },
        { label: "Уход", value: "Деликатная стирка при 30°C" },
        { label: "Коллекция", value: "Хрючик зимой" },
      ],
      delivery: [
        "Доставка по Беларуси 2-5 дней",
        "Размер уточняется перед отправкой",
        "Международная доставка доступна по запросу",
      ],
      reviews: [
        {
          id: "r4",
          author: "Ольга",
          date: "4 марта 2026",
          rating: 5,
          text: "Очень приятная ткань и нежный принт. Смотрится как часть красивого подарочного набора.",
        },
      ],
      relatedIds: ["mug", "book-winter", "stickers"],
    },
    stickers: {
      slug: "stickers",
      title: "Наклейки Хрючик",
      subtitle: "Мини-набор для подарков, тетрадей и упаковки",
      price: 12,
      badge: "Маленький подарок",
      storyLabel: "Стикеры по мотивам книги",
      storyTitle: "Хрючик зимой",
      sku: "KHR-STK-01",
      description:
        "Набор наклеек с Хрючиком для открыток, подарочной упаковки, ноутбуков и детских тетрадей. Хорошо дополняет книгу или кружку.",
      images: [
        { id: "1", emoji: "✨", bgColor: "#FFF0C9" },
        { id: "2", emoji: "🐷", bgColor: "#FCE5EA" },
        { id: "3", emoji: "📮", bgColor: "#FFF8F0" },
        { id: "4", emoji: "🎀", bgColor: "#DDF3E8" },
      ],
      specs: [
        { label: "Количество", value: "12 штук" },
        { label: "Материал", value: "Матовая виниловая плёнка" },
        { label: "Размер", value: "4-7 см" },
        { label: "Коллекция", value: "Хрючик зимой" },
      ],
      delivery: [
        "Отправка вместе с книгами и мерчем",
        "Подходит как дополнение к подарочному набору",
        "Международная доставка доступна",
      ],
      reviews: [
        {
          id: "r5",
          author: "Ирина",
          date: "2 марта 2026",
          rating: 5,
          text: "Очень милые наклейки, ребёнок украсил ими коробку с книжками и пенал.",
        },
      ],
      relatedIds: ["mug", "book-winter", "tshirt"],
    },
  },
  en: {
    mug: {
      slug: "mug",
      title: "Khryuchik mug",
      subtitle: "A cozy mug for warm family stories",
      price: 24,
      oldPrice: 29,
      badge: "This week's favorite",
      storyLabel: "Collection: Khryuchik in Winter",
      storyTitle: "Khryuchik in Winter",
      sku: "KHR-MUG-01",
      description:
        "A ceramic Khryuchik mug that makes a warm gift for children, parents, or a family collection. Perfect for tea, cocoa, and quiet evenings at home.",
      images: [
        { id: "1", emoji: "☕", bgColor: "#FFF8F0" },
        { id: "2", emoji: "🐷", bgColor: "#FCE5EA" },
        { id: "3", emoji: "🎁", bgColor: "#FFF0C9" },
        { id: "4", emoji: "✨", bgColor: "#DDF3E8" },
      ],
      colors: [
        { label: "Cream", value: "cream" },
        { label: "Pink", value: "pink" },
      ],
      specs: [
        { label: "Material", value: "Ceramic" },
        { label: "Capacity", value: "330 ml" },
        { label: "Care", value: "Suitable for gentle hand washing" },
        { label: "Collection", value: "Khryuchik in Winter" },
      ],
      delivery: [
        "Shipping across Belarus in 2-5 days",
        "International shipping is calculated at checkout",
        "Secure online card payments are available",
      ],
      reviews: [
        {
          id: "r1",
          author: "Anna",
          date: "12 March 2026",
          rating: 5,
          text: "Such a sweet mug. My child loves it and now asks to read Khryuchik every evening.",
        },
        {
          id: "r2",
          author: "Elena",
          date: "8 March 2026",
          rating: 5,
          text: "Beautiful print quality and a very cozy design. I bought it together with the book as a gift.",
        },
      ],
      relatedIds: ["book-winter", "tshirt", "stickers"],
    },
    "book-winter": {
      slug: "book-winter",
      title: "Book 'Khryuchik in Winter'",
      subtitle: "A gentle winter story in Russian and English",
      price: 29,
      badge: "New book",
      storyLabel: "A story-led Khryuchik title",
      storyTitle: "Khryuchik in Winter",
      sku: "KHR-BOOK-01",
      description:
        "A warm family tale inspired by real-life moments. Perfect for shared reading and as a gift for children and parents.",
      images: [
        { id: "1", emoji: "📘", bgColor: "#FCE5EA" },
        { id: "2", emoji: "📖", bgColor: "#FFF8F0" },
        { id: "3", emoji: "❄️", bgColor: "#DDF3E8" },
        { id: "4", emoji: "🐷", bgColor: "#FFF0C9" },
      ],
      languages: [
        { label: "Russian", value: "ru" },
        { label: "English", value: "en" },
      ],
      formats: [
        { label: "Printed edition", value: "print" },
        { label: "PDF", value: "pdf" },
      ],
      specs: [
        { label: "Age", value: "3+" },
        { label: "Language", value: "Russian / English" },
        { label: "Format", value: "Printed book / PDF" },
        { label: "Collection", value: "Khryuchik in Winter" },
      ],
      delivery: [
        "PDF is sent after payment",
        "Printed edition ships across Belarus in 2-5 days",
        "International delivery is available",
      ],
      reviews: [
        {
          id: "r3",
          author: "Maria",
          date: "10 March 2026",
          rating: 5,
          text: "A very kind story. My child asked to read it several times in a row.",
        },
      ],
      relatedIds: ["mug", "tshirt", "stickers"],
    },
    "book-country-house": {
      slug: "book-country-house",
      title: "Book 'Khryuchik at the Country House'",
      subtitle: "A summer story about family time and small discoveries",
      price: 27,
      badge: "Family story",
      storyLabel: "A story-led Khryuchik title",
      storyTitle: "Khryuchik at the Country House",
      sku: "KHR-BOOK-02",
      description:
        "A bright story about time spent at the country house, family memories, and the kind of summer days that stay with you for years.",
      images: [
        { id: "1", emoji: "📚", bgColor: "#FCE5EA" },
        { id: "2", emoji: "🌿", bgColor: "#DDF3E8" },
        { id: "3", emoji: "🏡", bgColor: "#FFF8F0" },
        { id: "4", emoji: "🐷", bgColor: "#FFF0C9" },
      ],
      languages: [
        { label: "Russian", value: "ru" },
        { label: "English", value: "en" },
      ],
      formats: [
        { label: "Printed edition", value: "print" },
        { label: "PDF", value: "pdf" },
      ],
      specs: [
        { label: "Age", value: "3+" },
        { label: "Language", value: "Russian / English" },
        { label: "Format", value: "Printed book / PDF" },
        { label: "Theme", value: "Summer, family, country house" },
      ],
      delivery: [
        "PDF is sent after payment",
        "Printed edition ships across Belarus in 2-5 days",
        "International delivery is available",
      ],
      reviews: [
        {
          id: "r6",
          author: "Tatiana",
          date: "5 March 2026",
          rating: 5,
          text: "A very warm and familiar story. It reminded me of our own family trips out of town.",
        },
      ],
      relatedIds: ["mug", "stickers", "book-winter"],
    },
    "book-friends": {
      slug: "book-friends",
      title: "Book 'Khryuchik and Friends'",
      subtitle: "A gentle story about friendship, care, and shared adventures",
      price: 27,
      badge: "Perfect for bedtime",
      storyLabel: "A story-led Khryuchik title",
      storyTitle: "Khryuchik and Friends",
      sku: "KHR-BOOK-03",
      description:
        "A book about how friendship, attention, and small acts of kindness can make every day warmer and more memorable.",
      images: [
        { id: "1", emoji: "📚", bgColor: "#FCE5EA" },
        { id: "2", emoji: "🤝", bgColor: "#FFF8F0" },
        { id: "3", emoji: "🐷", bgColor: "#FFF0C9" },
        { id: "4", emoji: "✨", bgColor: "#DDF3E8" },
      ],
      languages: [
        { label: "Russian", value: "ru" },
        { label: "English", value: "en" },
      ],
      formats: [
        { label: "Printed edition", value: "print" },
        { label: "PDF", value: "pdf" },
      ],
      specs: [
        { label: "Age", value: "3+" },
        { label: "Language", value: "Russian / English" },
        { label: "Format", value: "Printed book / PDF" },
        { label: "Theme", value: "Friendship and care" },
      ],
      delivery: [
        "PDF is sent after payment",
        "Printed edition ships across Belarus in 2-5 days",
        "International delivery is available",
      ],
      reviews: [
        {
          id: "r7",
          author: "Natalia",
          date: "1 March 2026",
          rating: 5,
          text: "A very kind book. It works perfectly for shared reading and gentle conversations with a child.",
        },
      ],
      relatedIds: ["stickers", "mug", "book-winter"],
    },
    tshirt: {
      slug: "tshirt",
      title: "Khryuchik T-shirt",
      subtitle: "A soft everyday T-shirt for walks, reading, and gifting",
      price: 49,
      badge: "Bestseller",
      storyLabel: "Collection: Khryuchik in Winter",
      storyTitle: "Khryuchik in Winter",
      sku: "KHR-TEE-01",
      description:
        "A relaxed-fit T-shirt with a soft Khryuchik print. A lovely match for books and gift bundles for both children and adults.",
      images: [
        { id: "1", emoji: "👕", bgColor: "#FFF8F0" },
        { id: "2", emoji: "🐷", bgColor: "#FCE5EA" },
        { id: "3", emoji: "✨", bgColor: "#DDF3E8" },
        { id: "4", emoji: "🎁", bgColor: "#FFF0C9" },
      ],
      sizes: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
      ],
      colors: [
        { label: "Cream", value: "cream" },
        { label: "Rose", value: "rose" },
      ],
      specs: [
        { label: "Material", value: "95% cotton" },
        { label: "Fit", value: "Relaxed" },
        { label: "Care", value: "Delicate wash at 30°C" },
        { label: "Collection", value: "Khryuchik in Winter" },
      ],
      delivery: [
        "Ships across Belarus in 2-5 days",
        "Size is confirmed before dispatch",
        "International delivery is available on request",
      ],
      reviews: [
        {
          id: "r4",
          author: "Olga",
          date: "4 March 2026",
          rating: 5,
          text: "The fabric feels great and the print is so soft. It looks lovely as part of a gift bundle.",
        },
      ],
      relatedIds: ["mug", "book-winter", "stickers"],
    },
    stickers: {
      slug: "stickers",
      title: "Khryuchik stickers",
      subtitle: "A mini set for gifts, notebooks, and wrapping",
      price: 12,
      badge: "A small gift",
      storyLabel: "Stickers inspired by the book",
      storyTitle: "Khryuchik in Winter",
      sku: "KHR-STK-01",
      description:
        "A sticker pack with Khryuchik for cards, gift wrapping, laptops, and children's notebooks. A perfect add-on to a book or mug.",
      images: [
        { id: "1", emoji: "✨", bgColor: "#FFF0C9" },
        { id: "2", emoji: "🐷", bgColor: "#FCE5EA" },
        { id: "3", emoji: "📮", bgColor: "#FFF8F0" },
        { id: "4", emoji: "🎀", bgColor: "#DDF3E8" },
      ],
      specs: [
        { label: "Count", value: "12 stickers" },
        { label: "Material", value: "Matte vinyl" },
        { label: "Size", value: "4-7 cm" },
        { label: "Collection", value: "Khryuchik in Winter" },
      ],
      delivery: [
        "Ships together with books and merch",
        "Great as a small add-on for gift bundles",
        "International delivery is available",
      ],
      reviews: [
        {
          id: "r5",
          author: "Irina",
          date: "2 March 2026",
          rating: 5,
          text: "Very cute stickers. My child used them on a book box and pencil case right away.",
        },
      ],
      relatedIds: ["mug", "book-winter", "tshirt"],
    },
  },
};

export const getProductDetails = (locale: Locale, slug: string) =>
  productDetailsMap[locale][slug];

export const getProductSlugs = () =>
  Array.from(new Set(Object.keys(productDetailsMap.ru)));
