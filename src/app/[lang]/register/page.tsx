import { notFound } from "next/navigation";

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
    <RegisterPageView
      callbackUrl={callbackUrl ?? `/${lang}/account`}
      loginHref={getLocalizedPath(lang, "/login")}
      locale={lang}
    />
  );
};

export default LocalizedRegisterPage;
