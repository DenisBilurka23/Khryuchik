import { NextResponse } from "next/server";

import { registerUser } from "@/server/users/services/users.service";
import { EMAIL_PATTERN } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "missing_fields" },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "invalid_email" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "password_too_short" },
        { status: 400 },
      );
    }

    const result = await registerUser({ name, email, phone, password });

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 409 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}