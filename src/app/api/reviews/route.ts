import { NextResponse } from "next/server";

import { requireAccountApiAccess } from "@/server/auth/page-context";
import {
  createReview,
  ReviewValidationError,
} from "@/server/reviews/services/reviews.service";
import { formatPersonName } from "@/utils";

export const POST = async (request: Request) => {
  const access = await requireAccountApiAccess();

  if (!access) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { productId?: string; productSlug?: string; rating?: number; text?: string }
    | null;

  const productId = typeof payload?.productId === "string" ? payload.productId : "";
  const productSlug =
    typeof payload?.productSlug === "string" ? payload.productSlug : "";
  const rating = typeof payload?.rating === "number" ? payload.rating : 0;
  const text = typeof payload?.text === "string" ? payload.text : "";

  try {
    await createReview({
      userId: access.user.id,
      author: formatPersonName(access.user.firstName, access.user.lastName),
      email: access.user.email,
      productId,
      productSlug,
      rating,
      text,
    });
  } catch (error) {
    if (error instanceof ReviewValidationError) {
      return NextResponse.json({ error: error.code }, { status: 400 });
    }

    console.error("POST /api/reviews failed", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: "pending" });
};
