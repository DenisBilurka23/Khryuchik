import "server-only";

import { defaultLocale, type Locale } from "@/i18n/config";
import type {
  ProductDocument,
  ProductTranslation,
  ProductType,
} from "@/types/catalog";
import type { NewsletterSubscriberDocument } from "@/types/newsletter";
import { getLocalizedPath, getLocalizedProductPath } from "@/utils";

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

type NewProductTypeCopy = {
  eyebrow: string;
  h1Line1: string;
  h1Line2: string;
  subject: (title: string) => string;
  preheader: (title: string) => string;
  intro: (title: string) => string;
  buttonLabel: string;
};

type NewProductLocaleCopy = {
  quote: string;
  footerShop: string;
  footerStory: string;
  footerHelp: string;
  footerCopyright: string;
  unsubscribeText: string;
  unsubscribeLabel: string;
  book: NewProductTypeCopy;
  merch: NewProductTypeCopy;
};

const newProductCopy: Record<Locale, NewProductLocaleCopy> = {
  ru: {
    quote: "«Каждый может стать главным героем своей истории.»",
    footerShop: "Магазин",
    footerStory: "О нас",
    footerHelp: "Помощь",
    footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    unsubscribeText: "Не хотите получать такие письма?",
    unsubscribeLabel: "Отписаться",
    book: {
      eyebrow: "Новая книга",
      h1Line1: "Новая книга",
      h1Line2: "уже в Хрючике",
      subject: (title) => `Новая книга: ${title}`,
      preheader: (title) => `«${title}» уже в магазине Хрючика.`,
      intro: (title) =>
        `Встречайте новую книгу «${title}» — она уже доступна в магазине.`,
      buttonLabel: "Смотреть книгу",
    },
    merch: {
      eyebrow: "Новинка",
      h1Line1: "Новинка мерча",
      h1Line2: "уже в Хрючике",
      subject: (title) => `Новинка: ${title}`,
      preheader: (title) => `«${title}» уже в магазине Хрючика.`,
      intro: (title) =>
        `Встречайте новинку «${title}» — она уже доступна в магазине.`,
      buttonLabel: "Смотреть товар",
    },
  },
  en: {
    quote: "“Every hero has their own story worth telling.”",
    footerShop: "Shop",
    footerStory: "Our story",
    footerHelp: "Help",
    footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    unsubscribeText: "Don't want to receive these emails?",
    unsubscribeLabel: "Unsubscribe",
    book: {
      eyebrow: "New book",
      h1Line1: "A new book",
      h1Line2: "is here",
      subject: (title) => `New book: ${title}`,
      preheader: (title) => `“${title}” has just arrived at Khryuchik.`,
      intro: (title) =>
        `Meet our new book “${title}” — it's now available in the shop.`,
      buttonLabel: "View the book",
    },
    merch: {
      eyebrow: "New arrival",
      h1Line1: "New merch",
      h1Line2: "is here",
      subject: (title) => `New arrival: ${title}`,
      preheader: (title) => `“${title}” has just arrived at Khryuchik.`,
      intro: (title) =>
        `Meet our new arrival “${title}” — it's now available in the shop.`,
      buttonLabel: "View the product",
    },
  },
};

const getProductTranslation = (
  product: ProductDocument,
  locale: Locale,
): ProductTranslation | undefined =>
  product.translations[locale] ??
  product.translations[defaultLocale] ??
  Object.values(product.translations)[0];

const buildUnsubscribeHtml = (
  text: string,
  label: string,
  unsubscribeUrl: string,
) =>
  html` <p
    style="margin:0;font-family:'Manrope',Arial,sans-serif;font-size:12px;line-height:1.7;color:#a89d92;"
  >
    ${text}
    <a href="${unsubscribeUrl}" style="color:#a89d92;text-decoration:underline;"
      >${label}</a
    >
  </p>`;

const buildNewProductBodyHtml = (
  intro: string,
  description: string,
  buttonLabel: string,
  productUrl: string,
  unsubscribeHtml: string,
) => html`
                    ${buildParagraphHtml(intro, 14)}
                    ${description ? buildParagraphHtml(description, 28) : ""}
                    ${buildButtonHtml(buttonLabel, productUrl)}
                    <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
                    ${unsubscribeHtml}
                    <div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
                  </td>
                </tr>`;

const buildNewProductContent = (
  product: ProductDocument,
  type: ProductType,
  locale: Locale,
  unsubscribeUrl: string,
): EmailContent => {
  const localeCopy = newProductCopy[locale] ?? newProductCopy[defaultLocale];
  const typeCopy = localeCopy[type];
  const translation = getProductTranslation(product, locale);
  const title = translation?.title?.trim() || product.slug;
  const description = translation?.shortDescription?.trim() ?? "";
  const productUrl = `${getAppOrigin()}${getLocalizedProductPath(locale, product.slug)}`;

  const strings: EmailShellStrings = {
    lang: locale,
    preheader: typeCopy.preheader(title),
    eyebrow: typeCopy.eyebrow,
    h1Line1: typeCopy.h1Line1,
    h1Line2: typeCopy.h1Line2,
    quote: localeCopy.quote,
    footerShop: localeCopy.footerShop,
    footerStory: localeCopy.footerStory,
    footerHelp: localeCopy.footerHelp,
    footerCopyright: localeCopy.footerCopyright,
  };

  const unsubscribeHtml = buildUnsubscribeHtml(
    localeCopy.unsubscribeText,
    localeCopy.unsubscribeLabel,
    unsubscribeUrl,
  );

  return {
    subject: typeCopy.subject(title),
    text: [
      typeCopy.intro(title),
      description,
      "",
      productUrl,
      "",
      `${localeCopy.unsubscribeText} ${unsubscribeUrl}`,
    ]
      .filter((line) => line !== undefined)
      .join("\n"),
    html: buildEmailShell(
      strings,
      buildNewProductBodyHtml(
        typeCopy.intro(title),
        description,
        typeCopy.buttonLabel,
        productUrl,
        unsubscribeHtml,
      ),
    ),
  };
};

const buildUnsubscribeUrl = (locale: Locale, token: string) =>
  `${getAppOrigin()}${getLocalizedPath(locale, `/unsubscribe/${encodeURIComponent(token)}`)}`;

export const sendNewProductAnnouncement = async (
  product: ProductDocument,
  subscribers: NewsletterSubscriberDocument[],
): Promise<void> => {
  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping new-product announcement",
    );
    return;
  }

  if (subscribers.length === 0) {
    return;
  }

  const type = product.classification.type;
  const transporter = createTransporter(config);

  for (const subscriber of subscribers) {
    const locale = newProductCopy[subscriber.locale]
      ? subscriber.locale
      : defaultLocale;
    const unsubscribeUrl = buildUnsubscribeUrl(
      locale,
      subscriber.unsubscribeToken,
    );
    const {
      subject,
      html: bodyHtml,
      text,
    } = buildNewProductContent(product, type, locale, unsubscribeUrl);

    try {
      await transporter.sendMail({
        from: config.user,
        to: subscriber.email,
        subject,
        text,
        html: bodyHtml,
      });
    } catch (error) {
      console.error(
        `[email] sendNewProductAnnouncement failed for ${subscriber.email}:`,
        error,
      );
    }
  }
};
