import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { AuthPageView } from "@/components/auth-page-view";
import { getLocalizedPath } from "@/components/utils";
import { isLocale } from "@/i18n/config";
import { isGoogleAuthEnabled } from "@/server/auth/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedLoginPageProps } from "@/types/auth-pages";

const LocalizedLoginPage = async ({ params, searchParams }: LocalizedLoginPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const { callbackUrl } = await searchParams;
  const { dictionary } = await getGuestAuthPageContext(lang);

  return (
    <Container maxWidth="lg">
      <AuthPageView dictionary={dictionary.authPage} callbackUrl={callbackUrl ?? `/${lang}/account`} isGoogleEnabled={isGoogleAuthEnabled} registerHref={getLocalizedPath(lang, "/register")} forgotPasswordHref={getLocalizedPath(lang, "/forgot-password")} />
    </Container>
  );
};

export default LocalizedLoginPage;