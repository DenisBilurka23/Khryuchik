import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { requireAdminApiAccess } from "@/server/admin/auth";
import { getAdminProductOptions } from "@/server/admin/catalog.service";

export const GET = async (request: NextRequest) => {
  try {
    const session = await requireAdminApiAccess();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const localeParam = request.nextUrl.searchParams.get("locale");
    const query = request.nextUrl.searchParams.get("q") ?? "";
    const excludeProductId =
      request.nextUrl.searchParams.get("excludeProductId") ?? undefined;
    const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "10");
    const locale =
      localeParam && isLocale(localeParam) ? localeParam : defaultLocale;
    const items = await getAdminProductOptions({
      locale,
      query,
      excludeProductId,
      limit: Number.isFinite(limitParam)
        ? Math.min(Math.max(limitParam, 1), 20)
        : 10,
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
};
