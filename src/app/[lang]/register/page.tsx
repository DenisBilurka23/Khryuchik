import type { Metadata } from "next";
import { RegisterPageView } from "@/components/register-page-view";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { LocalizedRegisterPageProps } from "@/types/auth-pages";
import { getLocalizedPath } from "@/utils";
import { NOINDEX_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = { robots: NOINDEX_ROBOTS };

const LocalizedRegisterPage = async ({
  params,
  searchParams,
}: LocalizedRegisterPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const { callbackUrl } = await searchParams;
  await getGuestAuthPageContext(lang);

  return (
    <RegisterPageView
      callbackUrl={callbackUrl ?? getLocalizedPath(lang, "/account")}
      loginHref={getLocalizedPath(lang, "/login")}
      locale={lang}
    />
  );
};

export default LocalizedRegisterPage;
