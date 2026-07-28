import "server-only";

import type { Locale } from "@/i18n/config";

import {
  buildButtonHtml,
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

type EmailVerificationEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
  fallbackLabel: string;
  securityNote: string;
};

const buildEmailVerificationBodyHtml = (
  strings: EmailVerificationEmailStrings,
  verifyUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, verifyUrl)}

                     <p
                      style="margin:26px 0 8px 0;font-family:'Manrope',Arial,sans-serif;font-size:13px;line-height:1.5;color:#9a8f86;"
                    >
                      ${strings.fallbackLabel}
                    </p>
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td
                          style="background-color:#fbf3ec;border:1px solid rgba(42,37,34,0.10);border-radius:12px;padding:13px 16px;"
                        >
                          <a
                            class="link-hover"
                            href="${verifyUrl}"
                            target="_blank"
                            style="font-family:'Manrope','Courier New',monospace;font-size:12px;line-height:1.5;color:#d4607a;text-decoration:none;word-break:break-all;"
                          >
                            ${verifyUrl}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="px" style="padding:26px 48px 38px 48px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td
                          style="border-top:1px solid rgba(42,37,34,0.08);font-size:0;line-height:0;"
                        >
                          &nbsp;
                        </td>
                      </tr>
                    </table>
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="padding-top:20px;"
                    >
                      <tr>
                        <td
                          style="vertical-align:top;width:24px;font-size:17px;line-height:22px;"
                        >
                          &#x1F512;
                        </td>
                        <td
                          style="padding-left:10px;font-family:'Manrope',Arial,sans-serif;font-size:13px;line-height:1.65;color:#9a8f86;"
                        >
                          ${strings.securityNote}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`;

const emailVerificationEmailBuilders: Record<
  string,
  (verifyUrl: string) => EmailContent
> = {
  ru: (verifyUrl) => {
    const strings: EmailVerificationEmailStrings = {
      lang: "ru",
      preheader:
        "Подтвердите email, чтобы войти в аккаунт Хрючик — ссылка действует 24 часа.",
      eyebrow: "Подтверждение почты",
      h1Line1: "Остался один",
      h1Line2: "шаг",
      para1:
        "Спасибо за регистрацию в <strong>Хрючике</strong>! Осталось подтвердить, что этот адрес действительно ваш.",
      para2:
        "Нажмите на кнопку ниже, чтобы завершить регистрацию и войти в аккаунт. Ссылка действует <strong>24 часа</strong>.",
      buttonLabel: "Подтвердить email",
      fallbackLabel: "Кнопка не работает? Скопируйте ссылку в браузер:",
      securityNote:
        "Если вы не регистрировались в Хрючике — просто проигнорируйте это письмо, аккаунт не будет активирован.",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: "Подтвердите email — Хрючик",
      text: [
        "Спасибо за регистрацию в Хрючике!",
        "",
        "Перейдите по ссылке ниже, чтобы подтвердить email (действует 24 часа):",
        verifyUrl,
        "",
        "Если вы не регистрировались — просто проигнорируйте это письмо.",
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildEmailVerificationBodyHtml(strings, verifyUrl),
      ),
    };
  },

  en: (verifyUrl) => {
    const strings: EmailVerificationEmailStrings = {
      lang: "en",
      preheader:
        "Confirm your email to sign in to Khryuchik — the link is valid for 24 hours.",
      eyebrow: "Email confirmation",
      h1Line1: "One last",
      h1Line2: "step",
      para1:
        "Thanks for signing up to <strong>Khryuchik</strong>! All that is left is confirming this address belongs to you.",
      para2:
        "Click the button below to finish your registration and sign in. The link is valid for <strong>24 hours</strong>.",
      buttonLabel: "Confirm email",
      fallbackLabel: "Button not working? Copy the link into your browser:",
      securityNote:
        "If you did not sign up for Khryuchik, you can safely ignore this email — the account will not be activated.",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: "Confirm your email — Khryuchik",
      text: [
        "Thanks for signing up to Khryuchik!",
        "",
        "Open the link below to confirm your email (valid for 24 hours):",
        verifyUrl,
        "",
        "If you did not sign up, you can safely ignore this email.",
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildEmailVerificationBodyHtml(strings, verifyUrl),
      ),
    };
  },
};

export const sendEmailVerificationEmail = async (
  to: string,
  verifyUrl: string,
  locale: Locale,
): Promise<void> => {
  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping email verification email",
    );
    return;
  }

  const transporter = createTransporter(config);
  const builder =
    emailVerificationEmailBuilders[locale] ?? emailVerificationEmailBuilders.en;
  const { subject, html: bodyHtml, text } = builder(verifyUrl);

  try {
    await transporter.sendMail({
      from: config.user,
      to,
      subject,
      text,
      html: bodyHtml,
    });
  } catch (error) {
    console.error("[email] sendEmailVerificationEmail failed:", error);
  }
};
