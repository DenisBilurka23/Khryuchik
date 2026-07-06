import { redirect } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";

import { getServerAuthSession } from "./config";

const resolveFreshAccountUser = async (
  session: NonNullable<Awaited<ReturnType<typeof getServerAuthSession>>>,
) => {
  const userId = session.user.id || undefined;
  const email = session.user.email ?? undefined;

  return userId
    ? getAccountUserById(userId)
    : email
      ? getAccountUserByEmail(email)
      : null;
};

// Must agree with requireAccountPageContext on what "logged in" means —
// otherwise a session whose DB user was deleted bounces forever between
// this guest guard (sees a valid JWT) and the account guard (sees no user).
export const getGuestAuthPageContext = async (locale: Locale) => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return;
  }

  const user = await resolveFreshAccountUser(session);

  if (user) {
    redirect(locale === "en" ? "/account" : `/${locale}/account`);
  }
};

// Re-verifies against MongoDB on every request, so a JWT session issued
// before an admin deletes the account no longer grants access — mirrors
// requireAdminPageAccess in @/server/admin/auth.
export const requireAccountPageContext = async (loginHref: string) => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect(loginHref);
  }

  const user = await resolveFreshAccountUser(session);

  if (!user) {
    redirect(loginHref);
  }

  return { session, user };
};

export const requireAccountApiAccess = async () => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return null;
  }

  const user = await resolveFreshAccountUser(session);

  if (!user) {
    return null;
  }

  return { session, user };
};