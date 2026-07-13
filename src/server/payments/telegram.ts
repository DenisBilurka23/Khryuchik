import "server-only";

import type { ContactMessageInput } from "@/types/contact";
import type { OrderDocument } from "@/types/order";

const TELEGRAM_API = "https://api.telegram.org";

const paymentMethodLabels: Record<string, string> = {
  stripe: "Карта · Stripe",
  cod: "Наложенный платёж",
  telegram_transfer: "Перевод на карту",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Ожидает оплаты",
  paid: "Оплачен",
  failed: "Ошибка оплаты",
  cod_pending: "Оплата при получении",
};

const getBotConfig = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return null;
  }

  return { token, chatId };
};

const formatAddress = (order: OrderDocument): string => {
  const { line1, line2, city, region, postalCode } = order.shippingAddress;
  return [line1, line2, city, region, postalCode]
    .filter((part) => part && part.length > 0)
    .join(", ");
};

const formatContact = (order: OrderDocument): string => {
  const parts: string[] = [];
  if (order.customer.email) parts.push(order.customer.email);
  if (order.customer.phone) parts.push(order.customer.phone);
  if (order.customer.telegram) parts.push(`@${order.customer.telegram.replace(/^@/, "")}`);
  return parts.length > 0 ? parts.join(" · ") : "—";
};

const formatItems = (order: OrderDocument): string =>
  order.items
    .map((item) => {
      const name = item.variant ? `${item.title} — ${item.variant}` : item.title;
      return `• ${name} ×${item.quantity} — ${item.lineTotal.toFixed(2)} ${order.currency}`;
    })
    .join("\n");

const orderHeader = (orderId: string) =>
  `#${orderId.slice(0, 8).toUpperCase()}`;

const buildNewOrderMessage = (order: OrderDocument): string => {
  const payment =
    paymentMethodLabels[order.payment.method] ?? order.payment.method;
  const status =
    paymentStatusLabels[order.payment.status] ?? order.payment.status;

  return [
    `🆕 Новый заказ ${orderHeader(order.id)}`,
    "",
    `👤 ${order.customer.name}`,
    `📞 ${formatContact(order)}`,
    `🌍 ${order.country} · ${order.currency}`,
    `💳 ${payment} (${status})`,
    "",
    "📦 Товары:",
    formatItems(order),
    "",
    `📍 ${formatAddress(order)}`,
    "",
    `Сумма: ${order.total.toFixed(2)} ${order.currency}`,
    order.notes ? `\n📝 Комментарий: ${order.notes}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
};

const buildPaidOrderMessage = (order: OrderDocument): string =>
  [
    `✅ Заказ ${orderHeader(order.id)} оплачен`,
    "",
    `👤 ${order.customer.name}`,
    `💳 ${paymentMethodLabels[order.payment.method] ?? order.payment.method}`,
    `Сумма: ${order.total.toFixed(2)} ${order.currency}`,
  ].join("\n");

const buildContactMessage = (input: ContactMessageInput): string =>
  [
    "✉️ Новое сообщение с сайта",
    "",
    `👤 ${input.name}`,
    `📧 ${input.email}`,
    "",
    input.message,
  ].join("\n");

const sendMessage = async (text: string): Promise<boolean> => {
  const config = getBotConfig();

  if (!config) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is not set — skipping admin notification",
    );
    return false;
  }

  try {
    const response = await fetch(
      `${TELEGRAM_API}/bot${config.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );

    if (!response.ok) {
      console.error(
        `[telegram] sendMessage failed: ${response.status}`,
        await response.text(),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[telegram] sendMessage threw:", error);
    return false;
  }
};

export const notifyAdminNewOrder = (order: OrderDocument): Promise<void> =>
  sendMessage(buildNewOrderMessage(order)).then(() => undefined);

export const notifyAdminOrderPaid = (order: OrderDocument): Promise<void> =>
  sendMessage(buildPaidOrderMessage(order)).then(() => undefined);

export const notifyAdminContactMessage = (
  input: ContactMessageInput,
): Promise<boolean> => sendMessage(buildContactMessage(input));
