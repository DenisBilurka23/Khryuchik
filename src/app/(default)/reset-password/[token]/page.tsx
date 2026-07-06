import { Container } from "@mui/material";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import type { ResetPasswordPageProps } from "@/types/auth-pages";

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const { token } = await params;

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
