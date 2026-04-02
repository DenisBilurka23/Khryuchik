import { redirect } from "next/navigation";
import { Container } from "@mui/material";

import { RegisterPageView } from "@/components/register-page-view";
import { StorefrontHeader } from "@/components/storefront-header";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";
import { StorefrontThemeProvider } from "@/components/storefront-theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import type { RegisterPageProps } from "@/types/auth-pages";

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
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
        <RegisterPageView dictionary={dictionary.registerPage} callbackUrl={callbackUrl ?? "/account"} loginHref="/login" />
      </Container>
    </StorefrontThemeProvider>
  );
};

export default RegisterPage;