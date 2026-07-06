import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import { deleteUserAvatarObject } from "@/server/storage/r2-assets.service";
import { deleteAccountUserSelf } from "@/server/users/services/users.service";
import { UserOperationErrorReason } from "@/types/users";

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const currentPassword =
      typeof body?.currentPassword === "string" ? body.currentPassword : "";

    const result = await deleteAccountUserSelf(session.user.id, currentPassword);

    if (!result.ok) {
      const status =
        result.reason === UserOperationErrorReason.WrongPassword
          ? 403
          : result.reason === UserOperationErrorReason.LastAdmin
            ? 409
            : 404;
      return NextResponse.json({ error: result.reason }, { status });
    }

    if (result.avatarObjectKey) {
      await deleteUserAvatarObject(result.avatarObjectKey).catch((cleanupError) => {
        console.error("Account self-delete avatar cleanup failed", cleanupError);
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
