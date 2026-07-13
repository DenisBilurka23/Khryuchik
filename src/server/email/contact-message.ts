import "server-only";

import { CONTACT_EMAIL } from "@/constants/contact";
import type { Locale } from "@/i18n/config";
import type { ContactMessageInput } from "@/types/contact";

import {
  buildEmailShell,
  buildParagraphHtml,
  type EmailShellStrings,
} from "./template-shell";
import {
  createTransporter,
  type EmailContent,
  getSmtpConfig,
} from "./transport";

const html = String.raw;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

type ContactEmailStrings = EmailShellStrings & {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
};

const buildContactBodyHtml = (
  strings: ContactEmailStrings,
  input: ContactMessageInput,
) => html` 
                    ${buildParagraphHtml(
                      `${strings.nameLabel}: ${escapeHtml(input.name)}`,
                      14,
                    )}
                    ${buildParagraphHtml(
                      `${strings.emailLabel}: ${escapeHtml(input.email)}`,
                      14,
                    )}
                    ${buildParagraphHtml(`${strings.messageLabel}:`, 6)}
                    ${buildParagraphHtml(
                      escapeHtml(input.message).replace(/\n/g, "<br />"),
                      28,
                    )}
                  </td>
                </tr>`;

const contactEmailBuilders: Record<
  string,
  (input: ContactMessageInput) => EmailContent
> = {
  ru: (input) => {
    const strings: ContactEmailStrings = {
      lang: "ru",
      preheader: `Новое сообщение с сайта от ${input.name}`,
      eyebrow: "Новое сообщение",
      h1Line1: "Сообщение",
      h1Line2: "с сайта",
      nameLabel: "Имя",
      emailLabel: "Email",
      messageLabel: "Сообщение",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: `Хрючик · Сообщение с сайта — от ${input.name}`,
      text: [
        `Имя: ${input.name}`,
        `Email: ${input.email}`,
        "",
        "Сообщение:",
        input.message,
      ].join("\n"),
      html: buildEmailShell(strings, buildContactBodyHtml(strings, input)),
    };
  },

  en: (input) => {
    const strings: ContactEmailStrings = {
      lang: "en",
      preheader: `New message from ${input.name}`,
      eyebrow: "New message",
      h1Line1: "Message",
      h1Line2: "from the site",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: `Khryuchik · Message from the site — ${input.name}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        "",
        "Message:",
        input.message,
      ].join("\n"),
      html: buildEmailShell(strings, buildContactBodyHtml(strings, input)),
    };
  },
};

const resolveBuilder = (locale: Locale) =>
  contactEmailBuilders[locale] ?? contactEmailBuilders.en;

export const sendContactMessage = async (
  input: ContactMessageInput,
): Promise<boolean> => {
  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping contact message",
    );
    return false;
  }

  const { subject, html: bodyHtml, text } = resolveBuilder(input.locale)(input);
  const transporter = createTransporter(config);

  try {
    await transporter.sendMail({
      from: config.user,
      to: CONTACT_EMAIL,
      replyTo: input.email,
      subject,
      text,
      html: bodyHtml,
    });

    return true;
  } catch (error) {
    console.error("[email] sendContactMessage failed:", error);
    return false;
  }
};
