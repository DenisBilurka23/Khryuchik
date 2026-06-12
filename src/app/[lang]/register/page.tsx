import { notFound } from "next/navigation";
import { Container } from "@mui/material";

import { RegisterPageView } from "@/components/register-page-view";
import { getLocalizedPath } from "@/utils";
import { isActiveLocale } from "@/server/localization/localization.service";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedRegisterPageProps } from "@/types/auth-pages";

const LocalizedRegisterPage = async ({
  params,
  searchParams,
}: LocalizedRegisterPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const { callbackUrl } = await searchParams;
  await getGuestAuthPageContext(lang);

  return (
    <Container maxWidth="lg">
      <RegisterPageView
        callbackUrl={callbackUrl ?? `/${lang}/account`}
        loginHref={getLocalizedPath(lang, "/login")}
      />
    </Container>
  );
};

export default LocalizedRegisterPage;
