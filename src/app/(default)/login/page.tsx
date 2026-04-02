import { redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AuthPageView } from "@/components/auth-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession, isGoogleAuthEnabled } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import type { LoginPageProps } from "@/types/auth-pages";

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/account");
  }

  const { callbackUrl } = await searchParams;
  const country = await getRequestCountry();
  const dictionary = await getDictionary(defaultLocale, country);
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(defaultLocale);

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={defaultLocale}
        country={country}
        dictionary={dictionary.storefront}
        homeHref="/"
        localizedPaths={localizedPaths}
        navigationPaths={navigationPaths}
      />
      <Container maxWidth="lg">
        <AuthPageView dictionary={dictionary.authPage} callbackUrl={callbackUrl ?? "/account"} isGoogleEnabled={isGoogleAuthEnabled} registerHref="/register" forgotPasswordHref="/forgot-password" />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default LoginPage;