import { Container } from "@mui/material";

import { RegisterPageView } from "@/components/register-page-view";
import { defaultLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { RegisterPageProps } from "@/types/auth-pages";

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
  const { callbackUrl } = await searchParams;
  await getGuestAuthPageContext(defaultLocale);

  return (
    <Container maxWidth="lg">
      <RegisterPageView
        callbackUrl={callbackUrl ?? "/account"}
        loginHref="/login"
      />
    </Container>
  );
};

export default RegisterPage;
