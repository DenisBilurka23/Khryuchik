import { notFound, redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";
import type { LocalizedAccountPageProps } from "@/types/auth-pages";

const LocalizedAccountPage = async ({ params }: LocalizedAccountPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const session = await getServerAuthSession();

  if (!session) {
    redirect(`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/account`)}`);
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(lang, country);
  const user = session.user.id
    ? await getAccountUserById(session.user.id)
    : session.user.email
      ? await getAccountUserByEmail(session.user.email)
      : null;

  return (
    <Container maxWidth="lg">
      <AccountPageView locale={lang} dictionary={dictionary.accountPage} homeHref={lang === "en" ? "/" : `/${lang}`} user={user ?? session.user ?? {}} />
    </Container>
  );
};

export default LocalizedAccountPage;