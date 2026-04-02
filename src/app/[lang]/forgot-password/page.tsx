import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { getLocalizedPath } from "@/components/utils";
import { isLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedForgotPasswordPageProps } from "@/types/auth-pages";

const LocalizedForgotPasswordPage = async ({ params }: LocalizedForgotPasswordPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const { country, dictionary, localizedPaths, navigationPaths, homeHref } =
    await getGuestAuthPageContext(lang);

  return (
    <StorefrontThemeProvider>
      <StorefrontHeader
        locale={lang}
        country={country}
        dictionary={dictionary.storefront}
        homeHref={homeHref}
        localizedPaths={localizedPaths}
        navigationPaths={navigationPaths}
      />
      <Container maxWidth="lg">
        <ForgotPasswordPageView
          dictionary={dictionary.forgotPasswordPage}
          locale={lang}
          loginHref={getLocalizedPath(lang, "/login")}
        />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default LocalizedForgotPasswordPage;