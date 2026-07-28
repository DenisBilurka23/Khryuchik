import { Container } from "@mui/material";

import { AuthPageView } from "@/components/auth-page-view";
import { defaultLocale } from "@/i18n/config";
import { isGoogleAuthEnabled } from "@/server/auth/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LoginPageProps } from "@/types/auth-pages";

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { callbackUrl } = await searchParams;
  await getGuestAuthPageContext(defaultLocale);

  return (
    <Container maxWidth="lg">
      <AuthPageView
        callbackUrl={callbackUrl ?? "/account"}
        isGoogleEnabled={isGoogleAuthEnabled}
        locale={defaultLocale}
        registerHref="/register"
        forgotPasswordHref="/forgot-password"
      />
    </Container>
  );
};

export default LoginPage;