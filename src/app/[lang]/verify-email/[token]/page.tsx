import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { VerifyEmailPageView } from "@/components/verify-email-page-view";
import { isActiveLocale } from "@/server/localization/localization.service";
import type { LocalizedVerifyEmailPageProps } from "@/types/auth-pages";
import { getLocalizedPath } from "@/utils";

const LocalizedVerifyEmailPage = async ({
  params,
}: LocalizedVerifyEmailPageProps) => {
  const { lang, token } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return (
    <Container maxWidth="lg">
      <VerifyEmailPageView
        token={token}
        locale={lang}
        loginHref={getLocalizedPath(lang, "/login")}
      />
    </Container>
  );
};

export default LocalizedVerifyEmailPage;
