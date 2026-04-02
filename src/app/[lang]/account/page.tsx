import { notFound, redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import type { LocalizedAccountPageProps } from "@/types/auth-pages";

const LocalizedAccountPage = async ({ params }: LocalizedAccountPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const session = await getServerAuthSession();

  if (!session) {
    redirect(`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/account`)}`);
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(lang, country);
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(lang);

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={lang}
        country={country}
        dictionary={dictionary.storefront}
        homeHref={lang === "en" ? "/" : `/${lang}`}
        localizedPaths={localizedPaths}
        navigationPaths={navigationPaths}
      />
      <Container maxWidth="lg">
        <AccountPageView locale={lang} dictionary={dictionary.accountPage} homeHref={lang === "en" ? "/" : `/${lang}`} user={session.user ?? {}} />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default LocalizedAccountPage;