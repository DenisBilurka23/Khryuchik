import { Container } from "@mui/material";

import { AuthPageView } from "@/components/auth-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { isGoogleAuthEnabled } from "@/server/auth/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LoginPageProps } from "@/types/auth-pages";

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { callbackUrl } = await searchParams;
  const { country, dictionary, localizedPaths, navigationPaths, homeHref } =
    await getGuestAuthPageContext(defaultLocale);

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={defaultLocale}
        country={country}
        dictionary={dictionary.storefront}
        homeHref={homeHref}
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