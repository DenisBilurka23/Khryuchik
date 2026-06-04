import "server-only";

import { redirect } from "next/navigation";

import { requireAdminApiAccess } from "@/server/admin/auth";

export const requireAdmin = async () => {
  const session = await requireAdminApiAccess();

  if (!session) {
    redirect("/login?callbackUrl=%2Fadmin");
  }

  return session;
};
