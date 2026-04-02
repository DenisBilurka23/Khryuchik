import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { getLocalizedPath } from "@/components/utils";
import { isLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedResetPasswordPageProps } from "@/types/auth-pages";

const LocalizedResetPasswordPage = async ({ params }: LocalizedResetPasswordPageProps) => {
  const { lang, token } = await params;

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
        <ResetPasswordPageView
          dictionary={dictionary.resetPasswordPage}
          token={token}
          loginHref={getLocalizedPath(lang, "/login")}
        />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default LocalizedResetPasswordPage;