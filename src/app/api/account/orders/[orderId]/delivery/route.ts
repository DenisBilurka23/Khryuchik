import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import { confirmOrderDeliveryByCustomer } from "@/server/orders/services/delivery.service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await getServerAuthSession();

  if (!session?.user?.id && !session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  try {
    const result = await confirmOrderDeliveryByCustomer(orderId, {
      userId: session.user.id,
      email: session.user.email ?? undefined,
    });

    if (result.status === "unknown_order") {
      return NextResponse.json({ error: "unknown_order" }, { status: 404 });
    }

    if (result.status === "not_confirmable") {
      return NextResponse.json({ error: "not_confirmable" }, { status: 409 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Customer delivery confirmation failed", error);

    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
