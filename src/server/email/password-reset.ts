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

type PasswordResetEmailStrings = EmailShellStrings & {
  para1: string;
  para2: string;
  buttonLabel: string;
  fallbackLabel: string;
  securityNote: string;
};

const buildPasswordResetBodyHtml = (
  strings: PasswordResetEmailStrings,
  resetUrl: string,
) => html`
                    ${buildParagraphHtml(strings.para1, 14)}
                    ${buildParagraphHtml(strings.para2, 28)}
                    ${buildButtonHtml(strings.buttonLabel, resetUrl)}

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
                            href="${resetUrl}"
                            target="_blank"
                            style="font-family:'Manrope','Courier New',monospace;font-size:12px;line-height:1.5;color:#d4607a;text-decoration:none;word-break:break-all;"
                          >
                            ${resetUrl}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- divider + security note -->
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

const passwordResetEmailBuilders: Record<
  string,
  (resetUrl: string) => EmailContent
> = {
  ru: (resetUrl) => {
    const strings: PasswordResetEmailStrings = {
      lang: "ru",
      preheader:
        "Сбросьте пароль от аккаунта Хрючик — ссылка действует 30 минут. Если это были не вы, просто проигнорируйте письмо.",
      eyebrow: "Безопасность аккаунта",
      h1Line1: "Сбросим пароль",
      h1Line2: "и пойдём дальше",
      para1:
        "Вы запросили сброс пароля для аккаунта <strong>Хрючик</strong>. Ничего страшного — такое случается с каждым героем.",
      para2:
        "Нажмите на кнопку ниже, чтобы задать новый пароль. Ссылка действует <strong>30 минут</strong>.",
      buttonLabel: "Сбросить пароль",
      fallbackLabel: "Кнопка не работает? Скопируйте ссылку в браузер:",
      securityNote:
        "Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо. Ваш пароль останется прежним, а аккаунт — в безопасности.",
      quote: "«Каждый может стать главным героем своей истории.»",
      footerShop: "Магазин",
      footerStory: "О нас",
      footerHelp: "Помощь",
      footerCopyright: `&copy; ${new Date().getFullYear()} Хрючик. Все права защищены.`,
    };

    return {
      subject: "Сброс пароля — Хрючик",
      text: [
        "Вы запросили сброс пароля для аккаунта Хрючик.",
        "",
        "Перейдите по ссылке ниже, чтобы задать новый пароль (действует 30 минут):",
        resetUrl,
        "",
        "Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.",
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildPasswordResetBodyHtml(strings, resetUrl),
      ),
    };
  },

  en: (resetUrl) => {
    const strings: PasswordResetEmailStrings = {
      lang: "en",
      preheader:
        "Reset your Khryuchik account password — the link is valid for 30 minutes. If this wasn't you, just ignore this email.",
      eyebrow: "Account security",
      h1Line1: "Reset your",
      h1Line2: "password",
      para1:
        "You requested a password reset for your <strong>Khryuchik</strong> account. Nothing to worry about — it happens to every hero.",
      para2:
        "Click the button below to set a new password. The link is valid for <strong>30 minutes</strong>.",
      buttonLabel: "Reset password",
      fallbackLabel: "Button not working? Copy the link into your browser:",
      securityNote:
        "If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged and your account stays secure.",
      quote: "“Every hero has their own story worth telling.”",
      footerShop: "Shop",
      footerStory: "Our story",
      footerHelp: "Help",
      footerCopyright: `&copy; ${new Date().getFullYear()} Khryuchik. All rights reserved.`,
    };

    return {
      subject: "Reset your password — Khryuchik",
      text: [
        "You requested a password reset for your Khryuchik account.",
        "",
        "Open the link below to set a new password (valid for 30 minutes):",
        resetUrl,
        "",
        "If you did not request a password reset, you can safely ignore this email.",
      ].join("\n"),
      html: buildEmailShell(
        strings,
        buildPasswordResetBodyHtml(strings, resetUrl),
      ),
    };
  },
};

export const sendPasswordResetEmail = async (
  to: string,
  resetUrl: string,
  locale: Locale,
): Promise<void> => {
  const config = getSmtpConfig();

  if (!config) {
    console.warn(
      "[email] SMTP_HOST, SMTP_USER, or SMTP_PASS is not set — skipping password reset email",
    );
    return;
  }

  const transporter = createTransporter(config);
  const builder =
    passwordResetEmailBuilders[locale] ?? passwordResetEmailBuilders.en;
  const { subject, html: bodyHtml, text } = builder(resetUrl);

  try {
    await transporter.sendMail({
      from: config.user,
      to,
      subject,
      text,
      html: bodyHtml,
    });
  } catch (error) {
    console.error("[email] sendPasswordResetEmail failed:", error);
    throw error;
  }
};
