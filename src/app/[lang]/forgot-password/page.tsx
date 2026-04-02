import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { getLocalizedPath } from "@/utils";
import { isLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedForgotPasswordPageProps } from "@/types/auth-pages";

const LocalizedForgotPasswordPage = async ({ params }: LocalizedForgotPasswordPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const { dictionary } = await getGuestAuthPageContext(lang);

  return (
    <Container maxWidth="lg">
      <ForgotPasswordPageView
        dictionary={dictionary.forgotPasswordPage}
        locale={lang}
        loginHref={getLocalizedPath(lang, "/login")}
      />
    </Container>
  );
};

export default LocalizedForgotPasswordPage;