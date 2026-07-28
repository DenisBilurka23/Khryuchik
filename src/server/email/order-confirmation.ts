import "server-only";

import { issueOrderDownloadToken } from "@/server/downloads/order-downloads.service";
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
  type EmailContent,
  getAppOrigin,
  getSmtpConfig,
} from "./transport";

const html = String.raw;

type OrderConfirmationEmailStrings = EmailShellStrings & {
  para1: string;
  totalLabel: string;
  buttonLabel: string;
  downloadsPara: string;
  downloadsButtonLabel: string;
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

const buildDownloadsBlockHtml = (
  strings: OrderConfirmationEmailStrings,
  downloadsUrl: string | null,
) =>
  downloadsUrl
    ? html`${buildParagraphHtml(strings.downloadsPara, 20)}
        ${buildButtonHtml(strings.downloadsButtonLabel, downloadsUrl)}
        <div style="height:20px;line-height:20px;">&nbsp;</div>`
    : "";

const buildOrderConfirmationBodyHtml = (
  strings: OrderConfirmationEmailStrings,
  order: OrderDocument,
  ordersUrl: string,
  downloadsUrl: string | null,
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
                    ${buildDownloadsBlockHtml(strings, downloadsUrl)}
                    ${buildButtonHtml(strings.buttonLabel, ordersUrl)}
                  </td>
                </tr>`;

const orderConfirmationEmailBuilders: Record<
  string,
  (
    order: OrderDocument,
    ordersUrl: string,
    downloadsUrl: string | null,
  ) => EmailContent
> = {
  ru: (order, ordersUrl, downloadsUrl) => {
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
      downloadsPara:
        "Электронные книги из этого заказа можно скачать по ссылке ниже — она работает 90 дней и не требует входа в аккаунт.",
      downloadsButtonLabel: "Скачать книги",
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
        ...(downloadsUrl ? [`Скачать книги: ${downloadsUrl}`, ""] : []),
        `Посмотреть заказ: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderConfirmationBodyHtml(strings, order, ordersUrl, downloadsUrl),
      ),
    };
  },

  en: (order, ordersUrl, downloadsUrl) => {
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
      downloadsPara:
        "The e-books from this order are available at the link below. It stays active for 90 days and needs no account.",
      downloadsButtonLabel: "Download your books",
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
        ...(downloadsUrl ? [`Download your books: ${downloadsUrl}`, ""] : []),
        `View order: ${ordersUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderConfirmationBodyHtml(strings, order, ordersUrl, downloadsUrl),
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

  const ordersUrl = `${getAppOrigin()}${getLocalizedPath(order.locale, "/account?section=orders")}`;
  // The token is issued here rather than at the call sites so all three senders
  // (Stripe webhook, admin status change, manual confirmation) stay unchanged.
  // It happens before the SMTP guard so the link can still be picked up from
  // the dev log on a machine without mail configured.
  const downloadToken = await issueOrderDownloadToken(order);
  const downloadsUrl = downloadToken
    ? `${getAppOrigin()}${getLocalizedPath(order.locale, `/downloads/${downloadToken}`)}`
    : null;

  if (downloadsUrl && process.env.NODE_ENV !== "production") {
    console.info(`Download URL for order ${order.id}: ${downloadsUrl}`);
  }

  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping order confirmation email",
    );
    return;
  }

  const builder =
    orderConfirmationEmailBuilders[order.locale] ??
    orderConfirmationEmailBuilders.en;
  const {
    subject,
    html: bodyHtml,
    text,
  } = builder(order, ordersUrl, downloadsUrl);
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
