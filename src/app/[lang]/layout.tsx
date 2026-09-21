import type { ReactNode } from "react";

import { CartToast } from "@/components/cart";
import { StorefrontLayoutShell } from "@/components/storefront-layout-shell";
import { WebAnalytics } from "@/components/web-analytics";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

const LocaleLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  return (
    <StorefrontLayoutShell locale={lang}>
      {children}
      <CartToast />
      <WebAnalytics />
    </StorefrontLayoutShell>
  );
};

export default LocaleLayout;
