import { AuthPageView } from "@/components/auth-page-view";
import { isGoogleAuthEnabled } from "@/server/auth/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { LocalizedLoginPageProps } from "@/types/auth-pages";
import { getLocalizedPath } from "@/utils";

const LocalizedLoginPage = async ({
  params,
  searchParams,
}: LocalizedLoginPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const { callbackUrl } = await searchParams;
  await getGuestAuthPageContext(lang);

  return (
    <AuthPageView
      callbackUrl={callbackUrl ?? getLocalizedPath(lang, "/account")}
      isGoogleEnabled={isGoogleAuthEnabled}
      locale={lang}
      registerHref={getLocalizedPath(lang, "/register")}
      forgotPasswordHref={getLocalizedPath(lang, "/forgot-password")}
    />
  );
};

export default LocalizedLoginPage;
