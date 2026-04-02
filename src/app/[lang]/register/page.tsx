import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { RegisterPageView } from "@/components/register-page-view";
import { getLocalizedPath } from "@/utils";
import { isLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedRegisterPageProps } from "@/types/auth-pages";

const LocalizedRegisterPage = async ({
  params,
  searchParams,
}: LocalizedRegisterPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const { callbackUrl } = await searchParams;
  const { dictionary } = await getGuestAuthPageContext(lang);

  return (
    <Container maxWidth="lg">
      <RegisterPageView
        dictionary={dictionary.registerPage}
        callbackUrl={callbackUrl ?? `/${lang}/account`}
        loginHref={getLocalizedPath(lang, "/login")}
      />
    </Container>
  );
};

export default LocalizedRegisterPage;
