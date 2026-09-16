
import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { LocalizedForgotPasswordPageProps } from "@/types/auth-pages";
import { getLocalizedPath } from "@/utils";

const LocalizedForgotPasswordPage = async ({
  params,
}: LocalizedForgotPasswordPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  await getGuestAuthPageContext(lang);

  return (
    <ForgotPasswordPageView
      locale={lang}
      loginHref={getLocalizedPath(lang, "/login")}
    />
  );
};

export default LocalizedForgotPasswordPage;
