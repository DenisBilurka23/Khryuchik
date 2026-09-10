import { notFound } from "next/navigation";

import { ForgotPasswordPageView } from "@/components/forgot-password-page-view";
import { getLocalizedPath } from "@/utils";
import { isActiveLocale } from "@/server/localization/localization.service";
import { getGuestAuthPageContext } from "@/server/auth/page-context";
import type { LocalizedForgotPasswordPageProps } from "@/types/auth-pages";

const LocalizedForgotPasswordPage = async ({
  params,
}: LocalizedForgotPasswordPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  await getGuestAuthPageContext(lang);

  return (
    <ForgotPasswordPageView
      locale={lang}
      loginHref={getLocalizedPath(lang, "/login")}
    />
  );
};

export default LocalizedForgotPasswordPage;
