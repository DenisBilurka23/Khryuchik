import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import { updateAccountUserProfile } from "@/server/users/services/users.service";
import { EMAIL_PATTERN } from "@/utils/validation";

export async function PATCH(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!name || !email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const result = await updateAccountUserProfile(session.user.id, {
      name,
      email,
      phone,
    });

    if (!result.ok) {
      const status =
        result.reason === "email_taken"
          ? 409
          : result.reason === "email_managed_by_google"
            ? 403
            : result.reason === "not_found"
              ? 404
              : 400;

      return NextResponse.json({ error: result.reason }, { status });
    }

    return NextResponse.json({ ok: true, user: result.user });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}