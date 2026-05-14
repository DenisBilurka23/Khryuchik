import { Container } from "@mui/material";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { defaultLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { ResetPasswordPageProps } from "@/types/auth-pages";

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const { token } = await params;
  await getGuestAuthPageContext(defaultLocale);

  return (
    <Container maxWidth="lg">
      <ResetPasswordPageView
        token={token}
        loginHref="/login"
      />
    </Container>
  );
};

export default ResetPasswordPage;
