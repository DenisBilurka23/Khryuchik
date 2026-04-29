import "server-only";

import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth/config";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";

const hasDatabaseAdminAccess = async (input: {
  userId?: string;
  email?: string | null;
}) => {
  const accountUser = input.userId
    ? await getAccountUserById(input.userId)
    : input.email
      ? await getAccountUserByEmail(input.email)
      : null;

  return Boolean(accountUser?.isAdmin);
};

export const requireAdminPageAccess = async (callbackUrl = "/admin") => {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const hasAccess = await hasDatabaseAdminAccess({
    userId: session.user.id,
    email: session.user.email,
  });

  if (!hasAccess) {
    redirect("/");
  }

  return session;
};

export const requireAdminApiAccess = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    return null;
  }

  const hasAccess = await hasDatabaseAdminAccess({
    userId: session.user.id,
    email: session.user.email,
  });

  if (!hasAccess) {
    return null;
  }

  return session;
};