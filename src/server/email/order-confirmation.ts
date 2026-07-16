import "server-only";

import type { OrderDocument } from "@/types/order";
import { formatCurrency, formatOrderNumber, getLocalizedPath } from "@/utils";

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

type OrderConfirmationEmailStrings = EmailShellStrings & {
  para1: string;
  totalLabel: string;
  buttonLabel: string;
};

const buildOrderItemsRowsHtml = (order: OrderDocument) =>
  order.items
    .map(
      (item) =>
        html` <tr>
          <td
            style="padding:10px 0;font-family:'Manrope',Arial,sans-serif;font-size:14px;color:#2a2522;border-bottom:1px solid rgba(42,37,34,0.08);"
          >
            ${item.title}${item.variant ? ` — ${item.variant}` : ""}
            <span style="color:#9a8f86;">&times;${item.quantity}</span>
          </td>
          <td
            align="right"
            style="padding:10px 0;font-family:'Manrope',Arial,sans-serif;font-size:14px;color:#2a2522;border-bottom:1px solid rgba(42,37,34,0.08);white-space:nowrap;"
          >
            ${formatCurrency(item.lineTotal, order.locale, order.currency)}
          </td>
        </tr>`,
    )
    .join("");

const buildOrderConfirmationBodyHtml = (
  strings: OrderConfirmationEmailStrings,
  order: OrderDocument,
  ordersUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 20)}
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin-bottom:20px;"
                    >
                      ${buildOrderItemsRowsHtml(order)}
                      <tr>
                        <td
                          style="padding:14px 0 0 0;font-family:'Manrope',Arial,sans-serif;font-size:15px;font-weight:700;color:#2a2522;"
                        >
                          ${strings.totalLabel}
                        </td>
                        <td
                          align="right"
                          style="padding:14px 0 0 0;font-family:'Manrope',Arial,sans-serif;font-size:15px;font-weight:700;color:#2a2522;white-space:nowrap;"
                        >
                          ${formatCurrency(order.total, order.locale, order.currency)}
                        </td>
                      </tr>
                    </table>
                    ${buildButtonHtml(strings.buttonLabel, ordersUrl)}
                  </td>
                </tr>`;

const orderConfirmationEmailBuilders: Record<
  string,
  (order: OrderDocument, ordersUrl: string) => EmailContent
> = {
  ru: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderConfirmationEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} подтверждён — спасибо за покупку в Хрючике!`,
      eyebrow: "Оплата получена",
      h1Line1: "Спасибо за",
      h1Line2: "заказ!",
      para1: `Заказ ${orderNumber} оплачен и передан в обработку. Ниже — детали покупки.`,
      totalLabel: "Итого",
      buttonLabel: "Посмотреть заказ",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: `Заказ ${orderNumber} подтверждён — Хрючик`,
      text: [
        `Заказ ${orderNumber} оплачен и передан в обработку.`,
        "",
        ...order.items.map(
          (item) =>
            `${item.title} x${item.quantity} — ${formatCurrency(item.lineTotal, order.locale, order.currency)}`,
        ),
        "",
        `Итого: ${formatCurrency(order.total, order.locale, order.currency)}`,
        "",
        `Посмотреть заказ: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderConfirmationBodyHtml(strings, order, ordersUrl),
      ),
    };
  },

  en: (order, ordersUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderConfirmationEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} confirmed — thank you for shopping at Khryuchik!`,
      eyebrow: "Payment received",
      h1Line1: "Thank you for",
      h1Line2: "your order!",
      para1: `Order ${orderNumber} has been paid and is now being processed. Here are the details.`,
      totalLabel: "Total",
      buttonLabel: "View order",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: `Order ${orderNumber} confirmed — Khryuchik`,
      text: [
        `Order ${orderNumber} has been paid and is now being processed.`,
        "",
        ...order.items.map(
          (item) =>
            `${item.title} x${item.quantity} — ${formatCurrency(item.lineTotal, order.locale, order.currency)}`,
        ),
        "",
        `Total: ${formatCurrency(order.total, order.locale, order.currency)}`,
        "",
        `View order: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderConfirmationBodyHtml(strings, order, ordersUrl),
      ),
    };
  },
};

export const sendOrderConfirmationEmail = async (
  order: OrderDocument,
): Promise<void> => {
  const to = order.customer.email;
  if (!to) {
    return;
  }

  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping order confirmation email",
    );
    return;
  }

  const ordersUrl = `${getAppOrigin()}${getLocalizedPath(order.locale, "/account?section=orders")}`;
  const builder =
    orderConfirmationEmailBuilders[order.locale] ??
    orderConfirmationEmailBuilders.en;
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
    console.error("[email] sendOrderConfirmationEmail failed:", error);
  }
};
