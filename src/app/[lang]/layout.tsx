import type { ReactNode } from "react";
import { notFound } from "next/navigation";

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

  return children;
};

export default LocaleLayout;
