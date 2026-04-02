import { Container } from "@mui/material";

import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { ForgotPasswordPageProps } from "@/types/auth-pages";

const ForgotPasswordPage = async ({}: ForgotPasswordPageProps) => {
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
        <ForgotPasswordPageView
          dictionary={dictionary.forgotPasswordPage}
          locale={defaultLocale}
          loginHref="/login"
        />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default ForgotPasswordPage;
