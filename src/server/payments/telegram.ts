import "server-only";

import type { ContactMessageInput } from "@/types/contact";
import type { OrderDocument } from "@/types/order";
import type { ReviewDocument } from "@/types/reviews";
import { formatCustomerName } from "@/utils";

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

const DIGITAL_FULFILLMENT_LABEL = "Цифровая доставка";

const formatAddress = (order: OrderDocument): string => {
  if (!order.shippingAddress) {
    return "";
  }
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
    `👤 ${formatCustomerName(order.customer)}`,
    `📞 ${formatContact(order)}`,
    `🌍 ${order.country} · ${order.currency}`,
    `💳 ${payment} (${status})`,
    "",
    "📦 Товары:",
    formatItems(order),
    "",
    order.fulfillmentType === "digital"
      ? `📍 ${DIGITAL_FULFILLMENT_LABEL}`
      : `📍 ${formatAddress(order)}`,
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
    `👤 ${formatCustomerName(order.customer)}`,
    `💳 ${paymentMethodLabels[order.payment.method] ?? order.payment.method}`,
    `Сумма: ${order.total.toFixed(2)} ${order.currency}`,
  ].join("\n");

const buildPrintifyFailureMessage = (
  order: OrderDocument,
  reason: string,
): string =>
  [
    `⚠️ Заказ ${orderHeader(order.id)} не ушёл в Printify`,
    "",
    `👤 ${formatCustomerName(order.customer)}`,
    `📍 ${formatAddress(order)}`,
    "",
    `Причина: ${reason}`,
    "",
    "🖐 Требуется ручная отправка через дашборд Printify",
  ].join("\n");

const buildNewReviewMessage = (review: ReviewDocument): string =>
  [
    `⭐️ Новый отзыв ${orderHeader(review.id)}`,
    "",
    `👤 ${review.author}`,
    `📦 ${review.productSlug}`,
    `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} (${review.rating}/5)`,
    "",
    review.text,
    "",
    "🔎 Требует модерации в админке",
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

export const notifyAdminPrintifyOrderFailed = (
  order: OrderDocument,
  reason: string,
): Promise<void> =>
  sendMessage(buildPrintifyFailureMessage(order, reason)).then(() => undefined);

export const notifyAdminNewReview = (review: ReviewDocument): Promise<void> =>
  sendMessage(buildNewReviewMessage(review)).then(() => undefined);

export const notifyAdminContactMessage = (
  input: ContactMessageInput,
): Promise<boolean> => sendMessage(buildContactMessage(input));
