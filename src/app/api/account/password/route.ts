import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import { changeAccountUserPassword } from "@/server/users/services/users.service";
import { AuthInputErrorCode } from "@/types/auth";
import { UserOperationErrorReason } from "@/types/users";

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";

    if (!newPassword) {
      return NextResponse.json(
        { error: AuthInputErrorCode.MissingFields },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: AuthInputErrorCode.PasswordTooShort },
        { status: 400 },
      );
    }

    const result = await changeAccountUserPassword(
      session.user.id,
      currentPassword,
      newPassword,
    );

    if (!result.ok) {
      const status =
        result.reason === UserOperationErrorReason.WrongPassword ? 403 : 400;
      return NextResponse.json({ error: result.reason }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: AuthInputErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
