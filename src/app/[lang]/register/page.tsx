import { notFound, redirect } from "next/navigation";
import { Container } from "@mui/material";

import { RegisterPageView } from "@/components/register-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { getLocalizedPath } from "@/components/utils";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import type { LocalizedRegisterPageProps } from "@/types/auth-pages";

const LocalizedRegisterPage = async ({ params, searchParams }: LocalizedRegisterPageProps) => {
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
        <RegisterPageView
          dictionary={dictionary.registerPage}
          callbackUrl={callbackUrl ?? `/${lang}/account`}
          loginHref={getLocalizedPath(lang, "/login")}
        />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default LocalizedRegisterPage;