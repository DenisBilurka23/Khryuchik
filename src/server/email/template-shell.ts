import "server-only";

export type EmailShellStrings = {
  lang: string;
  preheader: string;
  eyebrow: string;
  h1Line1: string;
  h1Line2: string;
  quote: string;
  footerShop: string;
  footerStory: string;
  footerHelp: string;
  footerCopyright: string;
};

export const html = String.raw;

export const buildEmailShell = (strings: EmailShellStrings, bodyHtml: string) =>
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
                    ${bodyHtml}
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

export const buildButtonHtml = (label: string, url: string) =>
  html` <!--[if mso]>
      <v:roundrect
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        href="${url}"
        style="height:52px;v-text-anchor:middle;width:220px;"
        arcsize="50%"
        fillcolor="#d4607a"
        strokecolor="#d4607a"
      >
        <w:anchorlock />
        <center
          style="font-family:'Manrope',Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;"
        >
          ${label} &rarr;
        </center>
      </v:roundrect>
    <![endif]-->
    <!--[if !mso]><!-->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="#d4607a" style="border-radius:999px;">
          <a
            class="btn-hover"
            href="${url}"
            target="_blank"
            style="display:inline-block;padding:15px 38px;font-family:'Manrope',Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background-color:#d4607a;white-space:nowrap;mso-hide:all;"
          >
            ${label}&nbsp;&nbsp;&rarr;
          </a>
        </td>
      </tr>
    </table>
    <!--<![endif]-->`;

export const buildParagraphHtml = (text: string, marginBottom: number) =>
  html` <p
    style="margin:0 0 ${marginBottom}px 0;font-family:'Manrope',Arial,sans-serif;font-size:15px;line-height:1.7;color:#6a6058;"
  >
    ${text}
  </p>`;
