import "server-only";

import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth/config";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";

const isUnsafeDevAdminAccessEnabled = () =>
  process.env.NODE_ENV !== "production" &&
  process.env.ADMIN_ALLOW_UNSAFE_DEV_ACCESS === "true";

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) {
    return false;
  }

  const adminEmails = getAdminEmails();

  if (adminEmails.length === 0) {
    return isUnsafeDevAdminAccessEnabled();
  }

  return adminEmails.includes(email.toLowerCase());
};

const hasDatabaseAdminAccess = async (input: {
  userId?: string;
  email?: string | null;
}) => {
  const accountUser = input.userId
    ? await getAccountUserById(input.userId)
    : input.email
      ? await getAccountUserByEmail(input.email)
      : null;

  if (accountUser?.isAdmin) {
    return true;
  }

  return isAdminEmail(accountUser?.email ?? input.email);
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