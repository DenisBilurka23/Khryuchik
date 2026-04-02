import { redirect } from "next/navigation";
import { Container } from "@mui/material";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import type { ResetPasswordPageProps } from "@/types/auth-pages";

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/account");
  }

  const { token } = await params;
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
        <ResetPasswordPageView dictionary={dictionary.resetPasswordPage} token={token} loginHref="/login" />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default ResetPasswordPage;