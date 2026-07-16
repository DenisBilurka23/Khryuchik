import "server-only";

import type { OrderDocument } from "@/types/order";
import { formatOrderNumber, getLocalizedPath } from "@/utils";

import {
  buildButtonHtml,
  buildEmailShell,
  buildParagraphHtml,
  type EmailShellStrings,
} from "./template-shell";
import {
  createTransporter,
  getAppOrigin,
  getSmtpConfig,
  type EmailContent,
} from "./transport";

const html = String.raw;

type OrderShippedEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
};

const buildOrderShippedBodyHtml = (
  strings: OrderShippedEmailStrings,
  ordersUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, ordersUrl)}
                  </td>
                </tr>`;

const orderShippedEmailBuilders: Record<
  string,
  (order: OrderDocument, ordersUrl: string) => EmailContent
> = {
  ru: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const addressLine = [
      order.shippingAddress?.line1,
      order.shippingAddress?.city,
    ]
      .filter(Boolean)
      .join(", ");
    const strings: OrderShippedEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} отправлен и уже в пути.`,
      eyebrow: "Заказ отправлен",
      h1Line1: "Ваш заказ",
      h1Line2: "уже в пути",
      para1: `Заказ ${orderNumber} передан в доставку по адресу: ${addressLine}.`,
      para2: "Следить за статусом можно в личном кабинете.",
      buttonLabel: "Посмотреть заказ",
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
        "",
        `Посмотреть заказ: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderShippedBodyHtml(strings, ordersUrl),
      ),
    };
  },

  en: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const addressLine = [
      order.shippingAddress?.line1,
      order.shippingAddress?.city,
    ]
      .filter(Boolean)
      .join(", ");
    const strings: OrderShippedEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} has shipped and is on its way.`,
      eyebrow: "Order shipped",
      h1Line1: "Your order is",
      h1Line2: "on its way",
      para1: `Order ${orderNumber} is on its way to: ${addressLine}.`,
      para2: "You can track its status from your account.",
      buttonLabel: "View order",
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
        "",
        `View order: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderShippedBodyHtml(strings, ordersUrl),
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
