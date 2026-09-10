import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { defaultLocale } from "@/i18n/config";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { ForgotPasswordPageProps } from "@/types/auth-pages";

const ForgotPasswordPage = async ({}: ForgotPasswordPageProps) => {
  await getGuestAuthPageContext(defaultLocale);

  return <ForgotPasswordPageView locale={defaultLocale} loginHref="/login" />;
};

export default ForgotPasswordPage;
