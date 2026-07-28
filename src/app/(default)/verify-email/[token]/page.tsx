import { Container } from "@mui/material";

import { VerifyEmailPageView } from "@/components/verify-email-page-view";
import { defaultLocale } from "@/i18n/config";
import type { VerifyEmailPageProps } from "@/types/auth-pages";

const VerifyEmailPage = async ({ params }: VerifyEmailPageProps) => {
  const { token } = await params;

  return (
    <Container maxWidth="lg">
      <VerifyEmailPageView
        token={token}
        locale={defaultLocale}
        loginHref="/login"
      />
    </Container>
  );
};

export default VerifyEmailPage;
