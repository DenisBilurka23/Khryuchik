import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Alert, Stack } from "@mui/material";

import { AdminCustomerForm } from "@/components/admin-customer-form";
import { deleteAdminCustomerAction, saveAdminCustomerAction } from "@/app/(admin)/admin/actions";
import { getAdminCustomerFormErrorMessage } from "@/server/admin/customer-form-state";
import { getAdminCustomerEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { requireAdminPageAccess } from "@/server/admin/auth";

type EditAdminCustomerPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export const generateMetadata = async ({
  params,
}: EditAdminCustomerPageProps): Promise<Metadata> => {
  const [{ dictionary }, { id }] = await Promise.all([
    getAdminPageContext(),
    params,
  ]);

  return createAdminMetadata(
    `${dictionary.customers.form.editTitlePrefix}: ${id}`,
    dictionary.customers.form.editDescription,
  );
};

const EditAdminCustomerPage = async ({
  params,
  searchParams,
}: EditAdminCustomerPageProps) => {
  const [{ id }, { saved, error }, { dictionary, locale }, session] = await Promise.all([
    params,
    searchParams,
    getAdminPageContext(),
    requireAdminPageAccess("/admin/customers"),
  ]);
  const customer = await getAdminCustomerEditorData(id);

  if (!customer) {
    notFound();
  }

  return (
    <Stack gap={2}>
      {saved === "1" ? <Alert severity="success">{dictionary.customers.form.savedMessage}</Alert> : null}
      <AdminCustomerForm
        customer={customer}
        locale={locale}
        dictionary={dictionary.customers.form}
        sharedDictionary={dictionary.shared}
        action={saveAdminCustomerAction}
        deleteAction={deleteAdminCustomerAction}
        errorMessage={getAdminCustomerFormErrorMessage(error, dictionary.customers.form)}
        isCurrentUser={session.user.id === customer.id}
      />
    </Stack>
  );
};

export default EditAdminCustomerPage;