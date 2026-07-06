import "server-only";

import nodemailer from "nodemailer";

export const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass };
};

export const createTransporter = (
  config: NonNullable<ReturnType<typeof getSmtpConfig>>,
) =>
  nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });

export const getAppOrigin = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export type EmailContent = { subject: string; text: string; html: string };
