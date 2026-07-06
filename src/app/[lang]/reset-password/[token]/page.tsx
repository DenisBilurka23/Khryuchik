import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { getLocalizedPath } from "@/utils";
import { isActiveLocale } from "@/server/localization/localization.service";
import type { LocalizedResetPasswordPageProps } from "@/types/auth-pages";

const LocalizedResetPasswordPage = async ({ params }: LocalizedResetPasswordPageProps) => {
  const { lang, token } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return (
    <Container maxWidth="lg">
      <ResetPasswordPageView
        token={token}
        loginHref={getLocalizedPath(lang, "/login")}
      />
    </Container>
  );
};

export default LocalizedResetPasswordPage;