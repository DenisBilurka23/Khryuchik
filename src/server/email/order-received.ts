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
  type EmailContent,
  getAppOrigin,
  getSmtpConfig,
} from "./transport";

const html = String.raw;

type OrderReceivedEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
};

const buildOrderReceivedBodyHtml = (
  strings: OrderReceivedEmailStrings,
  accountUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, accountUrl)}
                  </td>
                </tr>`;

// Payment-specific line explaining what the customer should expect next while
// the order sits unpaid. Stripe orders never receive this email (they pay
// immediately and get the confirmation email instead), so it is not covered.
const paymentInstructionByMethod: Record<string, { ru: string; en: string }> = {
  cod: {
    ru: "Оплата производится при получении. Мы свяжемся с вами для подтверждения деталей.",
    en: "You'll pay on delivery. We'll contact you to confirm the details.",
  },
  telegram_transfer: {
    ru: "Мы свяжемся с вами, чтобы согласовать перевод и подтвердить заказ.",
    en: "We'll reach out to arrange the transfer and confirm your order.",
  },
};

const paymentInstruction = (order: OrderDocument, lang: "ru" | "en") =>
  paymentInstructionByMethod[order.payment.method]?.[lang] ??
  (lang === "ru"
    ? "Мы свяжемся с вами для подтверждения оплаты и деталей заказа."
    : "We'll contact you to confirm payment and the order details.");

const orderReceivedEmailBuilders: Record<
  string,
  (order: OrderDocument, accountUrl: string) => EmailContent
> = {
  ru: (order, accountUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderReceivedEmailStrings = {
      lang: "ru",
      preheader: `Заказ ${orderNumber} принят — ждём подтверждения оплаты.`,
      eyebrow: "Заказ принят",
      h1Line1: "Мы получили",
      h1Line2: "ваш заказ",
      para1: `Заказ ${orderNumber} на сумму ${formatCurrency(order.total, order.locale, order.currency)} принят и ожидает оплаты.`,
      para2: paymentInstruction(order, "ru"),
      buttonLabel: "Посмотреть заказ",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: `Заказ ${orderNumber} принят — Хрючик`,
      text: [
        `Заказ ${orderNumber} на сумму ${formatCurrency(order.total, order.locale, order.currency)} принят и ожидает оплаты.`,
        "",
        paymentInstruction(order, "ru"),
        "",
        `Посмотреть заказ: ${accountUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderReceivedBodyHtml(strings, accountUrl),
      ),
    };
  },

  en: (order, accountUrl) => {
    const orderNumber = formatOrderNumber(order.id) ?? "";
    const strings: OrderReceivedEmailStrings = {
      lang: "en",
      preheader: `Order ${orderNumber} received — awaiting payment confirmation.`,
      eyebrow: "Order received",
      h1Line1: "We received",
      h1Line2: "your order",
      para1: `Order ${orderNumber} for ${formatCurrency(order.total, order.locale, order.currency)} has been received and is awaiting payment.`,
      para2: paymentInstruction(order, "en"),
      buttonLabel: "View order",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: `Order ${orderNumber} received — Khryuchik`,
      text: [
        `Order ${orderNumber} for ${formatCurrency(order.total, order.locale, order.currency)} has been received and is awaiting payment.`,
        "",
        paymentInstruction(order, "en"),
        "",
        `View order: ${accountUrl}`,
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildOrderReceivedBodyHtml(strings, accountUrl),
      ),
    };
  },
};

export const sendOrderReceivedEmail = async (
  order: OrderDocument,
): Promise<void> => {
  const to = order.customer.email;
  if (!to) {
    return;
  }

  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping order received email",
    );
    return;
  }

  const accountUrl = `${getAppOrigin()}${getLocalizedPath(order.locale, "/account")}`;
  const builder =
    orderReceivedEmailBuilders[order.locale] ?? orderReceivedEmailBuilders.en;
  const { subject, html: bodyHtml, text } = builder(order, accountUrl);
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
    console.error("[email] sendOrderReceivedEmail failed:", error);
  }
};
