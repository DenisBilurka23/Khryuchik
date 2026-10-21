import { ObjectId, type WithId } from "mongodb";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/entertainment/repositories/entertainment.repository", () => ({
  findEntertainmentItemBySlug: vi.fn(),
}));
vi.mock("@/server/storage/r2", () => ({
  getPrivateObject: vi.fn(),
  getPublicObject: vi.fn(),
}));

import { GET } from "@/app/api/entertainment/[slug]/download/route";
import { buildAssetDownloadResponse } from "@/server/downloads/asset-response";
import { findEntertainmentItemBySlug } from "@/server/entertainment/repositories/entertainment.repository";
import { getPrivateObject, getPublicObject } from "@/server/storage/r2";
import type { EntertainmentItemDocument } from "@/types/entertainment";
import { readSignedFileUrl } from "@/utils";

const filesBaseUrl = "https://files.example.com";
const filesSecret = "test-files-secret";

const pdf = "%PDF-1.7\ncoloring pages";
const item: WithId<EntertainmentItemDocument> = {
  _id: new ObjectId(),
  slug: "coloring-pages",
  category: "coloring",
  media: {
    type: "download",
    fileName: "coloring.pdf",
    objectKey: "entertainment/coloring/files/coloring.pdf",
    url: "https://cdn.example.com/coloring.pdf",
    contentType: "application/pdf",
    sizeBytes: Buffer.byteLength(pdf),
  },
  status: { isActive: true, visibleOnHome: true },
  sortOrder: 1,
  createdAt: "2026-10-20T00:00:00.000Z",
  updatedAt: "2026-10-20T00:00:00.000Z",
  translations: { en: { title: "Coloring pages" } },
};

const storedPdf = () =>
  ({
    $metadata: {},
    Body: { transformToWebStream: () => new Response(pdf).body! },
    ContentType: "application/pdf",
    ContentLength: Buffer.byteLength(pdf),
  }) as Awaited<ReturnType<typeof getPublicObject>>;

const download = () =>
  GET(
    new NextRequest(
      "http://localhost/api/entertainment/coloring-pages/download",
    ),
    {
      params: Promise.resolve({ slug: "coloring-pages" }),
    },
  );

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("FILES_BASE_URL", "");
  vi.stubEnv("FILES_SIGNING_SECRET", "");
  vi.mocked(findEntertainmentItemBySlug).mockResolvedValue(item);
  vi.mocked(getPublicObject).mockResolvedValue(storedPdf());
  vi.mocked(getPrivateObject).mockResolvedValue(storedPdf());
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const useFilesWorker = () => {
  vi.stubEnv("FILES_BASE_URL", filesBaseUrl);
  vi.stubEnv("FILES_SIGNING_SECRET", filesSecret);
};

const readRedirect = async (response: Response) => {
  const location = response.headers.get("location");

  if (!location) throw new Error("Expected a redirect location");

  return {
    location,
    link: await readSignedFileUrl(new URL(location), filesSecret),
  };
};

describe("entertainment downloads", () => {
  it("streams the public PDF as an attachment with its original name and bytes", async () => {
    const response = await download();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toBe(
      "attachment; filename=\"coloring.pdf\"; filename*=UTF-8''coloring.pdf",
    );
    expect(response.headers.get("content-length")).toBe(
      String(Buffer.byteLength(pdf)),
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.text()).toBe(pdf);
    expect(getPublicObject).toHaveBeenCalledWith(
      "entertainment/coloring/files/coloring.pdf",
    );
    expect(getPrivateObject).not.toHaveBeenCalled();
  });

  it("encodes Cyrillic names and reserved characters safely in download headers", async () => {
    if (item.media.type !== "download") throw new Error("Expected a download");
    const fileName = "Раскраски Хрючика (1)'\"\r\n.pdf";
    vi.mocked(findEntertainmentItemBySlug).mockResolvedValue({
      ...item,
      media: { ...item.media, fileName },
    });

    const response = await download();
    const disposition = response.headers.get("content-disposition")!;

    expect(response.status).toBe(200);
    expect(disposition).not.toMatch(/[\r\n]/);
    expect(disposition).toContain("%281%29%27%22%0D%0A.pdf");
    expect(decodeURIComponent(disposition.split("filename*=UTF-8''")[1])).toBe(
      fileName,
    );
  });

  it("returns 404 when no published item exists", async () => {
    vi.mocked(findEntertainmentItemBySlug).mockResolvedValue(null);

    expect((await download()).status).toBe(404);
    expect(getPublicObject).not.toHaveBeenCalled();
  });

  it("does not offer video sources through the public download route", async () => {
    vi.mocked(findEntertainmentItemBySlug).mockResolvedValue({
      ...item,
      category: "cartoons",
      media: {
        type: "video",
        source: null,
        status: "ready",
        durationSeconds: 60,
      },
    });

    expect((await download()).status).toBe(404);
    expect(getPublicObject).not.toHaveBeenCalled();
  });

  it("returns 502 when storage cannot supply the file", async () => {
    vi.mocked(getPublicObject).mockRejectedValue(
      new Error("Storage unavailable"),
    );

    expect((await download()).status).toBe(502);
  });

  it("returns 502 for an empty storage response", async () => {
    vi.mocked(getPublicObject).mockResolvedValue({ $metadata: {} });

    expect((await download()).status).toBe(502);
  });

  it("keeps purchased downloads in the private bucket by default", async () => {
    if (item.media.type !== "download") throw new Error("Expected a download");
    const response = await buildAssetDownloadResponse(item.media);

    expect(response.status).toBe(200);
    expect(getPrivateObject).toHaveBeenCalledWith(item.media.objectKey);
    expect(getPublicObject).not.toHaveBeenCalled();
  });
});

describe("downloads through the files worker", () => {
  it("redirects to a signed public link instead of streaming the file", async () => {
    useFilesWorker();
    const before = Math.floor(Date.now() / 1000);

    const response = await download();
    const { location, link } = await readRedirect(response);

    expect(response.status).toBe(302);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(location.startsWith(`${filesBaseUrl}/public/entertainment/`)).toBe(
      true,
    );
    expect(link.ok).toBe(true);
    if (!link.ok) return;
    expect(link.file).toMatchObject({
      bucket: "public",
      objectKey: "entertainment/coloring/files/coloring.pdf",
      fileName: "coloring.pdf",
      contentType: "application/pdf",
    });
    expect(link.file.expiresAtSeconds - before).toBeGreaterThanOrEqual(600);
    expect(link.file.expiresAtSeconds - before).toBeLessThanOrEqual(601);
    expect(getPublicObject).not.toHaveBeenCalled();
  });

  it("signs purchased downloads for the private bucket", async () => {
    useFilesWorker();
    if (item.media.type !== "download") throw new Error("Expected a download");

    const response = await buildAssetDownloadResponse(item.media);
    const { link } = await readRedirect(response);

    expect(response.status).toBe(302);
    expect(link.ok && link.file.bucket).toBe("private");
    expect(getPrivateObject).not.toHaveBeenCalled();
  });

  it("keeps streaming when only part of the worker settings is present", async () => {
    vi.stubEnv("FILES_BASE_URL", filesBaseUrl);

    const response = await download();

    expect(response.status).toBe(200);
    expect(getPublicObject).toHaveBeenCalled();
  });
});
