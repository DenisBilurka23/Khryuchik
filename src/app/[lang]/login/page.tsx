import { notFound, redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AuthPageView } from "@/components/auth-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { getLocalizedPath } from "@/components/utils";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession, isGoogleAuthEnabled } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import type { LocalizedLoginPageProps } from "@/types/auth-pages";

const LocalizedLoginPage = async ({ params, searchParams }: LocalizedLoginPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const session = await getServerAuthSession();

  if (session) {
    redirect(`/${lang}/account`);
  }

  const { callbackUrl } = await searchParams;
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
        <AuthPageView dictionary={dictionary.authPage} callbackUrl={callbackUrl ?? `/${lang}/account`} isGoogleEnabled={isGoogleAuthEnabled} registerHref={getLocalizedPath(lang, "/register")} forgotPasswordHref={getLocalizedPath(lang, "/forgot-password")} />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default LocalizedLoginPage;