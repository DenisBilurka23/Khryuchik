import "server-only";

import nodemailer from "nodemailer";

import type { Locale } from "@/i18n/config";

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass };
};

const createTransporter = (
  config: NonNullable<ReturnType<typeof getSmtpConfig>>,
) =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });

type EmailContent = { subject: string; text: string; html: string };

type PasswordResetEmailBuilder = (resetUrl: string) => EmailContent;

type PasswordResetEmailStrings = {
  lang: string;
  preheader: string;
  eyebrow: string;
  h1Line1: string;
  h1Line2: string;
  para1: string;
  para2: string;
  buttonLabel: string;
  fallbackLabel: string;
  securityNote: string;
  quote: string;
  footerShop: string;
  footerStory: string;
  footerHelp: string;
  footerCopyright: string;
};

const html = String.raw;

const buildPasswordResetHtml = (
  strings: PasswordResetEmailStrings,
  resetUrl: string,
) =>
  html`<!DOCTYPE html>
    <html
      lang="${strings.lang}"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <!--[if mso
          ]><noscript
            ><xml
              ><o:OfficeDocumentSettings
                ><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings
              ></xml
            ></noscript
          ><!
        [endif]-->
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <style>
          body,
          table,
          td,
          a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            outline: none;
            text-decoration: none;
          }
          body {
            margin: 0;
            padding: 0;
            width: 100% !important;
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
          }
          .btn-hover:hover {
            background-color: #b94e64 !important;
          }
          .link-hover:hover {
            color: #b94e64 !important;
          }
          @media only screen and (max-width: 620px) {
            .wrap {
              width: 100% !important;
            }
            .px {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .h1 {
              font-size: 34px !important;
            }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#f2e6da;">
        <div
          style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f2e6da;"
        >
          ${strings.preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color:#f2e6da;"
        >
          <tr>
            <td align="center" style="padding:40px 16px;">
              <!-- brand -->
              <table
                role="presentation"
                class="wrap"
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="width:600px;max-width:600px;"
              >
                <tr>
                  <td align="center" style="padding:0 0 24px 0;">
                    <table
                      role="presentation"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td
                          style="font-family:'Manrope',Arial,sans-serif;font-size:17px;font-weight:700;color:#2a2522;letter-spacing:0.01em;"
                        >
                          Khryuchik
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- card -->
              <table
                role="presentation"
                class="wrap"
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="width:600px;max-width:600px;background-color:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 50px rgba(42,37,34,0.10);"
              >
                <!-- top ribbon -->
                <tr>
                  <td
                    style="height:6px;line-height:6px;font-size:6px;background-color:#d4607a;"
                  >
                    &nbsp;
                  </td>
                </tr>

                <!-- hero band -->
                <tr>
                  <td
                    align="center"
                    style="background-color:#fce8ec;padding:36px 40px 30px 40px;"
                  >
                    <div
                      style="width:100px;height:100px;background-color:#ffffff;border-radius:50%;text-align:center;line-height:100px;font-size:46px;margin:0 auto;box-shadow:0 8px 22px rgba(212,96,122,0.22);"
                    >
                      &#x1F437;
                    </div>
                    <div
                      style="font-family:'Manrope',Arial,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#b94e64;padding-top:20px;"
                    >
                      ${strings.eyebrow}
                    </div>
                  </td>
                </tr>

                <!-- body -->
                <tr>
                  <td class="px" style="padding:38px 48px 6px 48px;">
                    <h1
                      class="h1"
                      style="margin:0 0 16px 0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:40px;line-height:1.1;color:#2a2522;letter-spacing:-0.01em;"
                    >
                      ${strings.h1Line1}<br />${strings.h1Line2}
                    </h1>
                    <p
                      style="margin:0 0 14px 0;font-family:'Manrope',Arial,sans-serif;font-size:15px;line-height:1.7;color:#6a6058;"
                    >
                      ${strings.para1}
                    </p>
                    <p
                      style="margin:0 0 28px 0;font-family:'Manrope',Arial,sans-serif;font-size:15px;line-height:1.7;color:#6a6058;"
                    >
                      ${strings.para2}
                    </p>

                    <!-- CTA button — VML for Outlook, anchor for modern clients -->
                    <!--[if mso]>
                      <v:roundrect
                        xmlns:v="urn:schemas-microsoft-com:vml"
                        xmlns:w="urn:schemas-microsoft-com:office:word"
                        href="${resetUrl}"
                        style="height:52px;v-text-anchor:middle;width:220px;"
                        arcsize="50%"
                        fillcolor="#d4607a"
                        strokecolor="#d4607a"
                      >
                        <w:anchorlock />
                        <center
                          style="font-family:'Manrope',Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;"
                        >
                          ${strings.buttonLabel} &rarr;
                        </center>
                      </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <table
                      role="presentation"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td
                          align="center"
                          bgcolor="#d4607a"
                          style="border-radius:999px;"
                        >
                          <a
                            class="btn-hover"
                            href="${resetUrl}"
                            target="_blank"
                            style="display:inline-block;padding:15px 38px;font-family:'Manrope',Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background-color:#d4607a;white-space:nowrap;mso-hide:all;"
                          >
                            ${strings.buttonLabel}&nbsp;&nbsp;&rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!--<![endif]-->

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
                </tr>
              </table>

              <!-- footer -->
              <table
                role="presentation"
                class="wrap"
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="width:600px;max-width:600px;"
              >
                <tr>
                  <td align="center" style="padding:26px 24px 8px 24px;">
                    <p
                      style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:17px;color:#6a6058;"
                    >
                      ${strings.quote}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:14px 24px 0 24px;">
                    <table
                      role="presentation"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td style="padding:0 8px;">
                          <a
                            class="link-hover"
                            href="#"
                            style="font-family:'Manrope',Arial,sans-serif;font-size:12px;font-weight:600;color:#6a6058;text-decoration:none;"
                            >${strings.footerShop}</a
                          >
                        </td>
                        <td style="color:#c9bdb0;font-size:12px;">&middot;</td>
                        <td style="padding:0 8px;">
                          <a
                            class="link-hover"
                            href="#"
                            style="font-family:'Manrope',Arial,sans-serif;font-size:12px;font-weight:600;color:#6a6058;text-decoration:none;"
                            >${strings.footerStory}</a
                          >
                        </td>
                        <td style="color:#c9bdb0;font-size:12px;">&middot;</td>
                        <td style="padding:0 8px;">
                          <a
                            class="link-hover"
                            href="#"
                            style="font-family:'Manrope',Arial,sans-serif;font-size:12px;font-weight:600;color:#6a6058;text-decoration:none;"
                            >${strings.footerHelp}</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="center"
                    style="padding:16px 24px 0 24px;font-family:'Manrope',Arial,sans-serif;font-size:11px;line-height:1.7;color:#a89d92;"
                  >
                    ${strings.footerCopyright}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

const passwordResetEmailBuilders: Record<string, PasswordResetEmailBuilder> = {
  ru: (resetUrl) => ({
    subject: "Сброс пароля — Хрючик",
    text: [
      "Вы запросили сброс пароля для аккаунта Хрючик.",
      "",
      "Перейдите по ссылке ниже, чтобы задать новый пароль (действует 30 минут):",
      resetUrl,
      "",
      "Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.",
    ].join("\n"),
    html: buildPasswordResetHtml(
      {
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
      },
      resetUrl,
    ),
  }),

  en: (resetUrl) => ({
    subject: "Reset your password — Khryuchik",
    text: [
      "You requested a password reset for your Khryuchik account.",
      "",
      "Open the link below to set a new password (valid for 30 minutes):",
      resetUrl,
      "",
      "If you did not request a password reset, you can safely ignore this email.",
    ].join("\n"),
    html: buildPasswordResetHtml(
      {
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
      },
      resetUrl,
    ),
  }),
};

const buildPasswordResetEmail = (
  resetUrl: string,
  locale: Locale,
): EmailContent => {
  const builder =
    passwordResetEmailBuilders[locale] ?? passwordResetEmailBuilders.en;
  return builder(resetUrl);
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
  const { subject, html, text } = buildPasswordResetEmail(resetUrl, locale);

  try {
    await transporter.sendMail({
      from: config.user,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[email] sendPasswordResetEmail failed:", error);
    throw error;
  }
};
