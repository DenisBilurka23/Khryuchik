import { redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";

const AccountPage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login?callbackUrl=%2Faccount");
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(defaultLocale, country);
  const user = session.user.id
    ? await getAccountUserById(session.user.id)
    : session.user.email
      ? await getAccountUserByEmail(session.user.email)
      : null;

  return (
    <Container maxWidth="lg">
      <AccountPageView locale={defaultLocale} dictionary={dictionary.accountPage} homeHref="/" user={user ?? session.user ?? {}} />
    </Container>
  );
};

export default AccountPage;