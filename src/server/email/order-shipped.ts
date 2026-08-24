import "server-only";

import type {
  OrderDocument,
  OrderFulfillmentSource,
  OrderTracking,
} from "@/types/order";
import {
  formatOrderNumber,
  formatOrderTracking,
  getLocalizedPath,
  getOrderTrackings,
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

type EmailLang = "ru" | "en";

type OrderShippedEmailStrings = EmailShellStrings & {
  para1: string;
  trackingLines: string[];
  para2: string;
  buttonLabel: string;
};

const trackingLabels: Record<EmailLang, string> = {
  ru: "Трек-номер",
  en: "Tracking number",
};

const parcelLabels: Record<
  EmailLang,
  Record<OrderFulfillmentSource, string>
> = {
  ru: { printify: "Мерч под заказ", manual: "Книги" },
  en: { printify: "Made-to-order merch", manual: "Books" },
};

const buildTrackingLines = (
  trackings: OrderTracking[],
  lang: EmailLang,
): string[] =>
  trackings.map((tracking) => {
    const label =
      trackings.length > 1 && tracking.source
        ? parcelLabels[lang][tracking.source]
        : trackingLabels[lang];

    return `${label}: ${formatOrderTracking(tracking)}`;
  });

const buildOrderShippedBodyHtml = (
  strings: OrderShippedEmailStrings,
  buttonUrl: string,
) => html` 
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${strings.trackingLines
                      .map((line) => buildParagraphHtml(line, 14))
                      .join("")}
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
    const trackings = getOrderTrackings(order);
    const trackingLines = buildTrackingLines(trackings, "ru");
    const trackingUrl = trackings.length === 1 ? trackings[0].url : undefined;
    const buttonUrl = trackingUrl ?? ordersUrl;
    const strings: OrderShippedEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} отправлен и уже в пути.`,
      eyebrow: "Заказ отправлен",
      h1Line1: "Ваш заказ",
      h1Line2: "уже в пути",
      para1: `Заказ ${orderNumber} передан в доставку по адресу: ${addressLine}.`,
      trackingLines,
      para2: "Следить за статусом можно в личном кабинете.",
      buttonLabel: trackingUrl ? "Отследить посылку" : "Посмотреть заказ",
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
        ...(trackingLines.length > 0 ? ["", ...trackingLines] : []),
        "",
        trackingUrl
          ? `Отследить посылку: ${trackingUrl}`
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
    const trackings = getOrderTrackings(order);
    const trackingLines = buildTrackingLines(trackings, "en");
    const trackingUrl = trackings.length === 1 ? trackings[0].url : undefined;
    const buttonUrl = trackingUrl ?? ordersUrl;
    const strings: OrderShippedEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} has shipped and is on its way.`,
      eyebrow: "Order shipped",
      h1Line1: "Your order is",
      h1Line2: "on its way",
      para1: `Order ${orderNumber} is on its way to: ${addressLine}.`,
      trackingLines,
      para2: "You can track its status from your account.",
      buttonLabel: trackingUrl ? "Track parcel" : "View order",
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
        ...(trackingLines.length > 0 ? ["", ...trackingLines] : []),
        "",
        trackingUrl
          ? `Track parcel: ${trackingUrl}`
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
