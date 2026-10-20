import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { buildAssetDownloadResponse } from "@/server/downloads/asset-response";
import { getEntertainmentDownload } from "@/server/entertainment/services/entertainment.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type EntertainmentDownloadRouteProps = {
  params: Promise<{ slug: string }>;
};

export const GET = async (
  _request: NextRequest,
  { params }: EntertainmentDownloadRouteProps,
) => {
  const { slug } = await params;
  const asset = await getEntertainmentDownload(slug);

  if (!asset) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return buildAssetDownloadResponse(asset, "public");
};
