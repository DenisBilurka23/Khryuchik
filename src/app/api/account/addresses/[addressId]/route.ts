import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import {
  deleteAccountUserShippingAddress,
  updateAccountUserShippingAddress,
} from "@/server/users/services/users.service";
import { statusForUserOperationError } from "@/server/users/user-error-status";
import { readShippingAddressInput } from "@/utils/account-page";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ addressId: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { addressId } = await params;
    const body = await request.json().catch(() => null);
    const result = await updateAccountUserShippingAddress(
      session.user.id,
      addressId,
      readShippingAddressInput(body),
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: result.reason },
        { status: statusForUserOperationError(result.reason) },
      );
    }

    return NextResponse.json({
      ok: true,
      user: result.user,
      address: result.address,
    });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ addressId: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { addressId } = await params;
    const result = await deleteAccountUserShippingAddress(
      session.user.id,
      addressId,
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: result.reason },
        { status: statusForUserOperationError(result.reason) },
      );
    }

    return NextResponse.json({ ok: true, user: result.user });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
