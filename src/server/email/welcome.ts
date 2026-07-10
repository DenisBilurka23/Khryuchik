import "server-only";

import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/utils";

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

type WelcomeEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
};

const buildWelcomeBodyHtml = (
  strings: WelcomeEmailStrings,
  shopUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, shopUrl)}
                  </td>
                </tr>`;

const welcomeEmailBuilders: Record<
  string,
  (name: string, shopUrl: string) => EmailContent
> = {
  ru: (name, shopUrl) => {
    const strings: WelcomeEmailStrings = {
      lang: "ru",
      preheader: `Добро пожаловать в Хрючик, ${name}! Аккаунт готов.`,
      eyebrow: "Аккаунт создан",
      h1Line1: "Добро пожаловать",
      h1Line2: "в Хрючик",
      para1: `Привет, ${name}! Ваш аккаунт готов — теперь вам доступны избранное, история заказов и быстрое оформление покупок.`,
      para2: "Загляните в магазин — там уже ждут новые истории.",
      buttonLabel: "В магазин",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: "Добро пожаловать в Хрючик!",
      text: [
        `Привет, ${name}!`,
        "",
        "Ваш аккаунт на Хрючике готов.",
        "",
        `Загляните в магазин: ${shopUrl}`,
      ].join("\n"),
      html: buildEmailShell(strings, buildWelcomeBodyHtml(strings, shopUrl)),
    };
  },

  en: (name, shopUrl) => {
    const strings: WelcomeEmailStrings = {
      lang: "en",
      preheader: `Welcome to Khryuchik, ${name}! Your account is ready.`,
      eyebrow: "Account created",
      h1Line1: "Welcome to",
      h1Line2: "Khryuchik",
      para1: `Hi ${name}! Your account is ready — you now have access to your wishlist, order history, and faster checkout.`,
      para2: "Take a look at the shop — new stories are waiting.",
      buttonLabel: "Go to shop",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: "Welcome to Khryuchik!",
      text: [
        `Hi ${name}!`,
        "",
        "Your Khryuchik account is ready.",
        "",
        `Visit the shop: ${shopUrl}`,
      ].join("\n"),
      html: buildEmailShell(strings, buildWelcomeBodyHtml(strings, shopUrl)),
    };
  },
};

export const sendWelcomeEmail = async (
  to: string,
  name: string,
  locale: Locale,
): Promise<void> => {
  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping welcome email",
    );
    return;
  }

  const shopUrl = `${getAppOrigin()}${getLocalizedPath(locale, "/shop")}`;
  const builder = welcomeEmailBuilders[locale] ?? welcomeEmailBuilders.en;
  const { subject, html: bodyHtml, text } = builder(name, shopUrl);
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
    console.error("[email] sendWelcomeEmail failed:", error);
  }
};
