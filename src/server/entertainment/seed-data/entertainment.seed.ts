import type { EntertainmentItemDocument } from "@/types/entertainment";

const placeholderPlaylist = (slug: string) =>
  `https://media.invalid/entertainment/${slug}/master.m3u8`;

const seededAt = "2026-09-11T00:00:00.000Z";

export const entertainmentSeedDocuments: EntertainmentItemDocument[] = [
  {
    slug: "khryuchik-birthday",
    category: "cartoons",
    media: {
      type: "video",
      source: {
        kind: "hls",
        playlistUrl: placeholderPlaylist("khryuchik-birthday"),
        sourceObjectKey: "entertainment/khryuchik-birthday/source.mp4",
      },
      status: "ready",
      durationSeconds: 555,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 1,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Хрючик на дне рождения",
        description:
          "Хрючик готовит праздник, задувает свечи и узнаёт, что лучший подарок — это друзья рядом.",
      },
      en: {
        title: "Khryuchik's Birthday Party",
        description:
          "Khryuchik throws a party, blows out the candles, and learns that the best gift is friends nearby.",
      },
    },
  },
  {
    slug: "khryuchik-visiting",
    category: "cartoons",
    media: {
      type: "video",
      source: {
        kind: "hls",
        playlistUrl: placeholderPlaylist("khryuchik-visiting"),
        sourceObjectKey: "entertainment/khryuchik-visiting/source.mp4",
      },
      status: "ready",
      durationSeconds: 520,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 2,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Хрючик в гостях",
        description:
          "Большой стол, тёплая кухня и целая история о том, как вести себя в гостях.",
      },
      en: {
        title: "Khryuchik Comes to Visit",
        description:
          "A big table, a warm kitchen, and a whole story about being a good guest.",
      },
    },
  },
  {
    slug: "one-day-together",
    category: "cartoons",
    media: {
      type: "video",
      source: {
        kind: "hls",
        playlistUrl: placeholderPlaylist("one-day-together"),
        sourceObjectKey: "entertainment/one-day-together/source.mp4",
      },
      status: "ready",
      durationSeconds: 470,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 3,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Один день вместе с Хрючиком",
        description:
          "Обычный день с прогулкой, играми и маленькими открытиями во дворе.",
      },
      en: {
        title: "A Day Together with Khryuchik",
        description:
          "An ordinary day of walks, games, and small discoveries in the yard.",
      },
    },
  },
  {
    slug: "khryuchik-detective",
    category: "cartoons",
    media: {
      type: "video",
      source: {
        kind: "hls",
        playlistUrl: placeholderPlaylist("khryuchik-detective"),
        sourceObjectKey: "entertainment/khryuchik-detective/source.mp4",
      },
      status: "ready",
      durationSeconds: 545,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 4,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Хрючик-детектив",
        description:
          "Пропала любимая кружка. Хрючик берёт лупу и распутывает дело до самого вечера.",
      },
      en: {
        title: "Khryuchik the Detective",
        description:
          "A favourite mug has vanished. Khryuchik takes up a magnifying glass and cracks the case by evening.",
      },
    },
  },
  {
    slug: "coloring-forest-friends",
    category: "coloring",
    media: {
      type: "download",
      fileName: "khryuchik-forest-friends.pdf",
      objectKey: "entertainment/coloring/khryuchik-forest-friends.pdf",
      url: "https://media.invalid/entertainment/coloring/khryuchik-forest-friends.pdf",
      contentType: "application/pdf",
      sizeBytes: 1_840_000,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 1,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Раскраска «Лесные друзья»",
        description: "Шесть страниц для печати на обычном принтере.",
      },
      en: {
        title: "Forest Friends colouring pages",
        description: "Six pages ready to print on an ordinary printer.",
      },
    },
  },
  {
    slug: "games-find-the-difference",
    category: "games",
    media: {
      type: "download",
      fileName: "khryuchik-find-the-difference.pdf",
      objectKey: "entertainment/games/khryuchik-find-the-difference.pdf",
      url: "https://media.invalid/entertainment/games/khryuchik-find-the-difference.pdf",
      contentType: "application/pdf",
      sizeBytes: 960_000,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 1,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Найди отличия с Хрючиком",
        description: "Восемь заданий для детей от четырёх лет.",
      },
      en: {
        title: "Spot the difference with Khryuchik",
        description: "Eight puzzles for children aged four and up.",
      },
    },
  },
  {
    slug: "materials-birthday-kit",
    category: "materials",
    media: {
      type: "download",
      fileName: "khryuchik-birthday-kit.pdf",
      objectKey: "entertainment/materials/khryuchik-birthday-kit.pdf",
      url: "https://media.invalid/entertainment/materials/khryuchik-birthday-kit.pdf",
      contentType: "application/pdf",
      sizeBytes: 3_200_000,
    },
    status: { isActive: true, visibleOnHome: true },
    sortOrder: 1,
    createdAt: seededAt,
    updatedAt: seededAt,
    translations: {
      ru: {
        title: "Набор для дня рождения",
        description:
          "Флажки, колпачки и открытки — всё для домашнего праздника.",
      },
      en: {
        title: "Birthday party kit",
        description: "Bunting, hats, and cards for a party at home.",
      },
    },
  },
];
