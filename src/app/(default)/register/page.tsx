import { Container } from "@mui/material";

import { RegisterPageView } from "@/components/register-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { RegisterPageProps } from "@/types/auth-pages";

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
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
        <RegisterPageView
          dictionary={dictionary.registerPage}
          callbackUrl={callbackUrl ?? "/account"}
          loginHref="/login"
        />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default RegisterPage;
