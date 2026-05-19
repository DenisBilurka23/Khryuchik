import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Alert, Stack } from "@mui/material";

import { AdminCustomerForm } from "@/components/admin-customer-form";
import { deleteAdminCustomerAction, saveAdminCustomerAction } from "@/app/(admin)/admin/actions";
import { getAdminCustomerEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { resolveLocale } from "@/server/i18n/request-locale";

type EditAdminCustomerPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export const generateMetadata = async ({
  params,
}: EditAdminCustomerPageProps): Promise<Metadata> => {
  const [locale, { id }] = await Promise.all([
    resolveLocale("admin"),
    params,
  ]);
  const tCustomerForm = await getTranslations({
    locale,
    namespace: "adminPage.customers.form",
  });

  return createAdminMetadata(
    `${tCustomerForm("editTitlePrefix")}: ${id}`,
    tCustomerForm("editDescription"),
    locale,
  );
};

const EditAdminCustomerPage = async ({
  params,
  searchParams,
}: EditAdminCustomerPageProps) => {
  const [{ id }, { saved, error }, locale, session] = await Promise.all([
    params,
    searchParams,
    resolveLocale("admin"),
    requireAdminPageAccess("/admin/customers"),
  ]);
  const tCustomerForm = await getTranslations({
    locale,
    namespace: "adminPage.customers.form",
  });
  const customer = await getAdminCustomerEditorData(id);

  if (!customer) {
    notFound();
  }

  return (
    <Stack gap={2}>
      {saved === "1" ? <Alert severity="success">{tCustomerForm("savedMessage")}</Alert> : null}
      <AdminCustomerForm
        customer={customer}
        locale={locale}
        action={saveAdminCustomerAction}
        deleteAction={deleteAdminCustomerAction}
        errorCode={error}
        isCurrentUser={session.user.id === customer.id}
      />
    </Stack>
  );
};

export default EditAdminCustomerPage;