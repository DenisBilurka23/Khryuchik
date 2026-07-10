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
  type EmailContent,
  getAppOrigin,
  getSmtpConfig,
} from "./transport";

const html = String.raw;

type OrderCancelledEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
};

const buildOrderCancelledBodyHtml = (
  strings: OrderCancelledEmailStrings,
  shopUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, shopUrl)}
                  </td>
                </tr>`;

const orderCancelledEmailBuilders: Record<
  string,
  (order: OrderDocument, shopUrl: string) => EmailContent
> = {
  ru: (order, shopUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderCancelledEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} отменён.`,
      eyebrow: "Заказ отменён",
      h1Line1: "Ваш заказ",
      h1Line2: "отменён",
      para1: `Заказ ${orderNumber} был отменён. Если оплата уже прошла, средства будут возвращены.`,
      para2:
        "Если это ошибка или у вас есть вопросы — свяжитесь с нами, мы поможем.",
      buttonLabel: "Вернуться в магазин",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: `Заказ ${orderNumber} отменён — Хрючик`,
      text: [
        `Заказ ${orderNumber} был отменён. Если оплата уже прошла, средства будут возвращены.`,
        "",
        "Если это ошибка или у вас есть вопросы — свяжитесь с нами.",
        "",
        `Вернуться в магазин: ${shopUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderCancelledBodyHtml(strings, shopUrl),
      ),
    };
  },

  en: (order, shopUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderCancelledEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} has been cancelled.`,
      eyebrow: "Order cancelled",
      h1Line1: "Your order",
      h1Line2: "was cancelled",
      para1: `Order ${orderNumber} has been cancelled. If a payment was already made, it will be refunded.`,
      para2:
        "If this was a mistake or you have any questions, get in touch — we're happy to help.",
      buttonLabel: "Back to shop",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: `Order ${orderNumber} cancelled — Khryuchik`,
      text: [
        `Order ${orderNumber} has been cancelled. If a payment was already made, it will be refunded.`,
        "",
        "If this was a mistake or you have any questions, get in touch.",
        "",
        `Back to shop: ${shopUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderCancelledBodyHtml(strings, shopUrl),
      ),
    };
  },
};

export const sendOrderCancelledEmail = async (
  order: OrderDocument,
): Promise<void> => {
  const to = order.customer.email;
  if (!to) {
    return;
  }

  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping order cancelled email",
    );
    return;
  }

  const shopUrl = `${getAppOrigin()}${getLocalizedPath(order.locale, "/shop")}`;
  const builder =
    orderCancelledEmailBuilders[order.locale] ?? orderCancelledEmailBuilders.en;
  const { subject, html: bodyHtml, text } = builder(order, shopUrl);
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
    console.error("[email] sendOrderCancelledEmail failed:", error);
  }
};
