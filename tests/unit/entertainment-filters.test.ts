import { ObjectId, type WithId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/entertainment/repositories/entertainment.repository", () => ({
  findHomeEntertainmentItems: vi.fn(),
  findPublishedEntertainmentItems: vi.fn(),
}));

import {
  DEFAULT_ENTERTAINMENT_CATEGORY,
  DEFAULT_ENTERTAINMENT_FILTER,
} from "@/constants/entertainment";
import {
  findHomeEntertainmentItems,
  findPublishedEntertainmentItems,
} from "@/server/entertainment/repositories/entertainment.repository";
import {
  getEntertainmentView,
  getHomeEntertainmentView,
} from "@/server/entertainment/services/entertainment.service";
import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
} from "@/types/entertainment";
import {
  isEntertainmentCategory,
  isEntertainmentFilter,
} from "@/utils/entertainment";

const makeItem = (
  slug: string,
  category: EntertainmentCategoryKey,
): WithId<EntertainmentItemDocument> => ({
  _id: new ObjectId(),
  slug,
  category,
  media:
    category === "cartoons"
      ? { type: "video", source: null, status: "ready", durationSeconds: 60 }
      : {
          type: "download",
          fileName: `${slug}.pdf`,
          objectKey: `entertainment/${slug}.pdf`,
          url: `https://cdn.example.com/${slug}.pdf`,
          contentType: "application/pdf",
          sizeBytes: 1000,
        },
  status: { isActive: true, visibleOnHome: true },
  sortOrder: 1,
  createdAt: "2026-10-20T00:00:00.000Z",
  updatedAt: "2026-10-20T00:00:00.000Z",
  translations: {
    en: { title: `EN ${slug}` },
    ru: { title: `RU ${slug}` },
  },
});

const items = [
  makeItem("cartoon-1", "cartoons"),
  makeItem("coloring-1", "coloring"),
  makeItem("cartoon-2", "cartoons"),
  makeItem("coloring-2", "coloring"),
  makeItem("cartoon-3", "cartoons"),
  makeItem("coloring-3", "coloring"),
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(findPublishedEntertainmentItems).mockResolvedValue(items);
  vi.mocked(findHomeEntertainmentItems).mockResolvedValue(items);
});

describe("entertainment filters", () => {
  it("shows all categories by default without changing their order", async () => {
    const view = await getEntertainmentView("en", DEFAULT_ENTERTAINMENT_FILTER);

    expect(view.selectedCategory).toBe("all");
    expect(view.availableCategories).toEqual(["cartoons", "coloring"]);
    expect(view.items.map((item) => item.slug)).toEqual(
      items.map((item) => item.slug),
    );
  });

  it.each(["cartoons", "coloring"] as const)(
    "only returns %s when that filter is selected",
    async (category) => {
      const view = await getEntertainmentView("en", category);

      expect(view.selectedCategory).toBe(category);
      expect(view.items.map((item) => item.slug)).toEqual(
        items
          .filter((item) => item.category === category)
          .map((item) => item.slug),
      );
    },
  );

  it("uses the selected locale when mixing material types", async () => {
    const view = await getEntertainmentView("ru", "all");

    expect(view.items.map((item) => item.title)).toEqual(
      items.map((item) => `RU ${item.slug}`),
    );
  });

  it("falls back to all materials for an unavailable category", async () => {
    const view = await getEntertainmentView("en", "games");

    expect(view.selectedCategory).toBe("all");
    expect(view.items).toHaveLength(items.length);
  });

  it("includes coloring pages after the first four cartoons on the homepage", async () => {
    const homeItems = [
      ...Array.from({ length: 4 }, (_, index) =>
        makeItem(`cartoon-${index}`, "cartoons"),
      ),
      ...items.filter((item) => item.category === "coloring"),
    ];
    vi.mocked(findHomeEntertainmentItems).mockResolvedValue(homeItems);
    const view = await getHomeEntertainmentView("en", "all");

    expect(view.selectedCategory).toBe("all");
    expect(view.availableCategories).toEqual(["cartoons", "coloring"]);
    expect(view.items.map((item) => item.slug)).toEqual(
      homeItems.map((item) => item.slug),
    );
  });

  it("shows every homepage material in the selected category", async () => {
    const coloringItems = Array.from({ length: 6 }, (_, index) =>
      makeItem(`coloring-${index}`, "coloring"),
    );
    vi.mocked(findHomeEntertainmentItems).mockResolvedValue([
      makeItem("cartoon", "cartoons"),
      ...coloringItems,
    ]);
    const view = await getHomeEntertainmentView("en", "coloring");

    expect(view.items.map((item) => item.slug)).toEqual(
      coloringItems.map((item) => item.slug),
    );
  });

  it("only shows homepage materials even when the full catalog has more items", async () => {
    vi.mocked(findHomeEntertainmentItems).mockResolvedValue(items.slice(0, 2));
    const view = await getHomeEntertainmentView("en", "all");

    expect(view.items.map((item) => item.slug)).toEqual(
      items.slice(0, 2).map((item) => item.slug),
    );
  });

  it("handles an empty catalog without inventing an available category", async () => {
    vi.mocked(findPublishedEntertainmentItems).mockResolvedValue([]);
    const view = await getEntertainmentView("en", "all");

    expect(view).toEqual({
      selectedCategory: "all",
      availableCategories: [],
      items: [],
    });
  });

  it("keeps all as a storefront filter and cartoons as the admin default category", () => {
    expect(isEntertainmentFilter("all")).toBe(true);
    expect(isEntertainmentCategory("all")).toBe(false);
    expect(DEFAULT_ENTERTAINMENT_CATEGORY).toBe("cartoons");
  });

  it.each([undefined, "", "unknown"])(
    "rejects an invalid filter: %s",
    (value) => {
      expect(isEntertainmentFilter(value)).toBe(false);
    },
  );
});
