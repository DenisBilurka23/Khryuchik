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

type OrderDeliveredEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
};

const buildOrderDeliveredBodyHtml = (
  strings: OrderDeliveredEmailStrings,
  ordersUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, ordersUrl)}
                  </td>
                </tr>`;

const orderDeliveredEmailBuilders: Record<
  string,
  (order: OrderDocument, ordersUrl: string) => EmailContent
> = {
  ru: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderDeliveredEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} доставлен — приятного чтения!`,
      eyebrow: "Заказ доставлен",
      h1Line1: "Ваш заказ",
      h1Line2: "доставлен",
      para1: `Заказ ${orderNumber} доставлен. Надеемся, он вам понравится!`,
      para2:
        "Будем рады вашему отзыву — он помогает другим читателям найти свою историю.",
      buttonLabel: "Посмотреть заказ",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: `Заказ ${orderNumber} доставлен — Хрючик`,
      text: [
        `Заказ ${orderNumber} доставлен. Надеемся, он вам понравится!`,
        "",
        "Будем рады вашему отзыву.",
        "",
        `Посмотреть заказ: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderDeliveredBodyHtml(strings, ordersUrl),
      ),
    };
  },

  en: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderDeliveredEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} delivered — enjoy the read!`,
      eyebrow: "Order delivered",
      h1Line1: "Your order",
      h1Line2: "has been delivered",
      para1: `Order ${orderNumber} has been delivered. We hope you love it!`,
      para2:
        "We'd love to hear your feedback — it helps other readers find their story.",
      buttonLabel: "View order",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: `Order ${orderNumber} delivered — Khryuchik`,
      text: [
        `Order ${orderNumber} has been delivered. We hope you love it!`,
        "",
        "We'd love to hear your feedback.",
        "",
        `View order: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderDeliveredBodyHtml(strings, ordersUrl),
      ),
    };
  },
};

export const sendOrderDeliveredEmail = async (
  order: OrderDocument,
): Promise<void> => {
  const to = order.customer.email;
  if (!to) {
    return;
  }

  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping order delivered email",
    );
    return;
  }

  const ordersUrl = `${getAppOrigin()}${getLocalizedPath(order.locale, "/account?section=orders")}`;
  const builder =
    orderDeliveredEmailBuilders[order.locale] ?? orderDeliveredEmailBuilders.en;
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
    console.error("[email] sendOrderDeliveredEmail failed:", error);
  }
};
