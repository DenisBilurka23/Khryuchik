import { notFound } from "next/navigation";

import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import { getLocalizedPath } from "@/utils";
import { isActiveLocale } from "@/server/localization/localization.service";
import type { LocalizedResetPasswordPageProps } from "@/types/auth-pages";

const LocalizedResetPasswordPage = async ({
  params,
}: LocalizedResetPasswordPageProps) => {
  const { lang, token } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return (
    <ResetPasswordPageView
      token={token}
      loginHref={getLocalizedPath(lang, "/login")}
    />
  );
};

export default LocalizedResetPasswordPage;
