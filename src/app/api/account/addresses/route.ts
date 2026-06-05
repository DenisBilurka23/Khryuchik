import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import {
  addAccountUserShippingAddress,
  selectAccountUserShippingAddress,
} from "@/server/users/services/users.service";
import { UserOperationErrorReason } from "@/types/users";

const getStringField = (body: unknown, key: string): string => {
  if (typeof body !== "object" || body === null) return "";
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
};

const getStatusForReason = (reason: UserOperationErrorReason) => {
  switch (reason) {
    case UserOperationErrorReason.NotFound:
    case UserOperationErrorReason.AddressNotFound:
      return 404;
    case UserOperationErrorReason.MissingFields:
    case UserOperationErrorReason.InvalidCountry:
      return 400;
    default:
      return 400;
  }
};

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const result = await addAccountUserShippingAddress(session.user.id, {
      title: getStringField(body, "title"),
      line1: getStringField(body, "line1"),
      line2: getStringField(body, "line2") || undefined,
      city: getStringField(body, "city"),
      region: getStringField(body, "region") || undefined,
      postalCode: getStringField(body, "postalCode") || undefined,
      country: getStringField(body, "country") as "BY" | "US",
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.reason },
        { status: getStatusForReason(result.reason) },
      );
    }

    return NextResponse.json({ ok: true, user: result.user, address: result.address });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const result = await selectAccountUserShippingAddress(
      session.user.id,
      getStringField(body, "addressId"),
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: result.reason },
        { status: getStatusForReason(result.reason) },
      );
    }

    return NextResponse.json({ ok: true, user: result.user });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}