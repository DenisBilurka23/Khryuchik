import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { notFound } from "next/navigation";

import { bodyFont, displayFont } from "../fonts";
import "../globals.css";
import { isLocale, locales } from "@/i18n/config";

export const dynamicParams = false;

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
