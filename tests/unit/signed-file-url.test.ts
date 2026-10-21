import { describe, expect, it } from "vitest";

import type { SignedFile } from "@/types/download";
import { createSignedFileUrl, readSignedFileUrl } from "@/utils";

const baseUrl = "https://files.example.com";
const secret = "test-files-secret";
const now = Date.UTC(2026, 9, 20, 12, 0, 0);

const file: SignedFile = {
  bucket: "private",
  objectKey: "books/hrjuchik/Книга с пробелами (1).pdf",
  fileName: "Хрючик и друзья.pdf",
  contentType: "application/pdf",
  expiresAtSeconds: now / 1000 + 600,
};

const signedUrl = async (overrides: Partial<SignedFile> = {}) =>
  new URL(
    await createSignedFileUrl(baseUrl, secret, { ...file, ...overrides }),
  );

const withParam = (url: URL, name: string, value: string) => {
  const next = new URL(url);

  next.searchParams.set(name, value);

  return next;
};

describe("signed file links", () => {
  it("reads back the exact file it was signed for", async () => {
    const url = await signedUrl();

    expect(url.origin).toBe(baseUrl);
    expect(url.pathname.startsWith("/private/books/hrjuchik/")).toBe(true);
    expect(await readSignedFileUrl(url, secret, now)).toEqual({
      ok: true,
      file,
    });
  });

  it("works without a content type", async () => {
    const withoutType = { ...file, contentType: undefined };
    const url = new URL(
      await createSignedFileUrl(baseUrl, secret, withoutType),
    );

    expect(url.searchParams.has("type")).toBe(false);
    expect(await readSignedFileUrl(url, secret, now)).toEqual({
      ok: true,
      file: withoutType,
    });
  });

  it("rejects a link signed with another secret", async () => {
    const url = await signedUrl();

    expect(await readSignedFileUrl(url, "other-secret", now)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it.each([
    ["name", "other.pdf"],
    ["type", "text/html"],
    ["exp", String(file.expiresAtSeconds + 3600)],
  ])("rejects a link whose %s was changed", async (name, value) => {
    const url = withParam(await signedUrl(), name, value);

    expect((await readSignedFileUrl(url, secret, now)).ok).toBe(false);
  });

  it("rejects a link pointed at another file or bucket", async () => {
    const url = await signedUrl();
    const otherFile = new URL(url);
    const otherBucket = new URL(url);

    otherFile.pathname = "/private/books/other.pdf";
    otherBucket.pathname = url.pathname.replace("/private/", "/public/");

    expect((await readSignedFileUrl(otherFile, secret, now)).ok).toBe(false);
    expect((await readSignedFileUrl(otherBucket, secret, now)).ok).toBe(false);
  });

  it("reports an authentic but expired link as expired", async () => {
    const url = await signedUrl();

    expect(
      await readSignedFileUrl(url, secret, file.expiresAtSeconds * 1000),
    ).toEqual({ ok: false, reason: "expired" });
  });

  it.each([
    ["no signature", (url: URL) => url.searchParams.delete("sig")],
    ["a broken signature", (url: URL) => url.searchParams.set("sig", "%%%")],
    ["a fractional expiry", (url: URL) => url.searchParams.set("exp", "1.5")],
    ["an unknown bucket", (url: URL) => (url.pathname = "/secret/key.pdf")],
    ["no object key", (url: URL) => (url.pathname = "/private")],
  ])("rejects a link with %s", async (_label, mutate) => {
    const url = await signedUrl();

    mutate(url);

    expect(await readSignedFileUrl(url, secret, now)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});
