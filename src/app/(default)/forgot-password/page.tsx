import { Container } from "@mui/material";

import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { defaultLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { ForgotPasswordPageProps } from "@/types/auth-pages";

const ForgotPasswordPage = async ({}: ForgotPasswordPageProps) => {
  const { dictionary } = await getGuestAuthPageContext(defaultLocale);

  return (
    <Container maxWidth="lg">
      <ForgotPasswordPageView
        dictionary={dictionary.forgotPasswordPage}
        locale={defaultLocale}
        loginHref="/login"
      />
    </Container>
  );
};

export default ForgotPasswordPage;
