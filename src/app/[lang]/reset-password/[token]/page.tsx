import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { getLocalizedPath } from "@/components/utils";
import { isLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedResetPasswordPageProps } from "@/types/auth-pages";

const LocalizedResetPasswordPage = async ({ params }: LocalizedResetPasswordPageProps) => {
  const { lang, token } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const { dictionary } = await getGuestAuthPageContext(lang);

  return (
    <Container maxWidth="lg">
      <ResetPasswordPageView
        dictionary={dictionary.resetPasswordPage}
        token={token}
        loginHref={getLocalizedPath(lang, "/login")}
      />
    </Container>
  );
};

export default LocalizedResetPasswordPage;