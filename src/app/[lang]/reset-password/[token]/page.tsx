import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import type { LocalizedResetPasswordPageProps } from "@/types/auth-pages";
import { getLocalizedPath } from "@/utils";

const LocalizedResetPasswordPage = async ({
  params,
}: LocalizedResetPasswordPageProps) => {
  const { lang, token } = await params;

  await requireActiveLocale(lang);

  return (
    <ResetPasswordPageView
      token={token}
      loginHref={getLocalizedPath(lang, "/login")}
    />
  );
};

export default LocalizedResetPasswordPage;
