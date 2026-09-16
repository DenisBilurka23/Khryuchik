
import { VerifyEmailPageView } from "@/components/verify-email-page-view";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { LocalizedVerifyEmailPageProps } from "@/types/auth-pages";
import { getLocalizedPath } from "@/utils";

const LocalizedVerifyEmailPage = async ({
  params,
}: LocalizedVerifyEmailPageProps) => {
  const { lang, token } = await params;

  await requireActiveLocale(lang);

  return (
    <VerifyEmailPageView
      token={token}
      locale={lang}
      loginHref={getLocalizedPath(lang, "/login")}
    />
  );
};

export default LocalizedVerifyEmailPage;
