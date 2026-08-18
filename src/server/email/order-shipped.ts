import "server-only";

import type { OrderDocument } from "@/types/order";
import {
  formatOrderNumber,
  formatOrderTracking,
  getLocalizedPath,
  getOrderTracking,
} from "@/utils";

import {
  buildButtonHtml,
  buildEmailShell,
  buildParagraphHtml,
  type EmailShellStrings,
} from "./template-shell";
import {
  createTransporter,
  type EmailContent,
  getAppOrigin,
  getSmtpConfig,
} from "./transport";

const html = String.raw;

type OrderShippedEmailStrings = EmailShellStrings & {
  para1: string;
  trackingLine?: string;
  para2: string;
  buttonLabel: string;
};

const buildOrderShippedBodyHtml = (
  strings: OrderShippedEmailStrings,
  buttonUrl: string,
) => html` 
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${
                      strings.trackingLine
                        ? buildParagraphHtml(strings.trackingLine, 14)
                        : ""
                    }
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, buttonUrl)}
                  </td>
                </tr>`;

const buildAddressLine = (order: OrderDocument) =>
  [order.shippingAddress?.line1, order.shippingAddress?.city]
    .filter(Boolean)
    .join(", ");

const orderShippedEmailBuilders: Record<
  string,
  (order: OrderDocument, ordersUrl: string) => EmailContent
> = {
  ru: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const addressLine = buildAddressLine(order);
    const tracking = getOrderTracking(order);
    const trackingLine = tracking
      ? `Трек-номер: ${formatOrderTracking(tracking)}`
      : undefined;
    const buttonUrl = tracking?.url ?? ordersUrl;
    const strings: OrderShippedEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} отправлен и уже в пути.`,
      eyebrow: "Заказ отправлен",
      h1Line1: "Ваш заказ",
      h1Line2: "уже в пути",
      para1: `Заказ ${orderNumber} передан в доставку по адресу: ${addressLine}.`,
      trackingLine,
      para2: "Следить за статусом можно в личном кабинете.",
      buttonLabel: tracking?.url ? "Отследить посылку" : "Посмотреть заказ",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: `Заказ ${orderNumber} отправлен — Хрючик`,
      text: [
        `Заказ ${orderNumber} передан в доставку по адресу: ${addressLine}.`,
        ...(trackingLine ? ["", trackingLine] : []),
        "",
        tracking?.url
          ? `Отследить посылку: ${tracking.url}`
          : `Посмотреть заказ: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderShippedBodyHtml(strings, buttonUrl),
      ),
    };
  },

  en: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const addressLine = buildAddressLine(order);
    const tracking = getOrderTracking(order);
    const trackingLine = tracking
      ? `Tracking number: ${formatOrderTracking(tracking)}`
      : undefined;
    const buttonUrl = tracking?.url ?? ordersUrl;
    const strings: OrderShippedEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} has shipped and is on its way.`,
      eyebrow: "Order shipped",
      h1Line1: "Your order is",
      h1Line2: "on its way",
      para1: `Order ${orderNumber} is on its way to: ${addressLine}.`,
      trackingLine,
      para2: "You can track its status from your account.",
      buttonLabel: tracking?.url ? "Track parcel" : "View order",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: `Order ${orderNumber} shipped — Khryuchik`,
      text: [
        `Order ${orderNumber} is on its way to: ${addressLine}.`,
        ...(trackingLine ? ["", trackingLine] : []),
        "",
        tracking?.url
          ? `Track parcel: ${tracking.url}`
          : `View order: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderShippedBodyHtml(strings, buttonUrl),
      ),
    };
  },
};

export const sendOrderShippedEmail = async (
  order: OrderDocument,
): Promise<void> => {
  const to = order.customer.email;
  if (!to) {
    return;
  }

  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping order shipped email",
    );
    return;
  }

  const ordersUrl = `${getAppOrigin()}${getLocalizedPath(order.locale, "/account?section=orders")}`;
  const builder =
    orderShippedEmailBuilders[order.locale] ?? orderShippedEmailBuilders.en;
  const { subject, html: bodyHtml, text } = builder(order, ordersUrl);
  const transporter = createTransporter(config);

  try {
    await transporter.sendMail({
      from: config.user,
      to,
      subject,
      text,
      html: bodyHtml,
    });
  } catch (error) {
    console.error("[email] sendOrderShippedEmail failed:", error);
  }
};
