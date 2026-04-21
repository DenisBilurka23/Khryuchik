import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLayoutShell } from "@/components/admin-layout-shell";
import { createAdminRootMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { createAdminNavItems } from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => createAdminRootMetadata();

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const [{ dictionary, locale }, session] = await Promise.all([
    getAdminPageContext(),
    requireAdminPageAccess("/admin"),
  ]);

  return (
    <AdminLayoutShell
      email={session.user.email ?? "admin@khryuchik"}
      locale={locale}
      dictionary={dictionary}
      navItems={createAdminNavItems(dictionary.nav)}
    >
      {children}
    </AdminLayoutShell>
  );
};

export default AdminLayout;