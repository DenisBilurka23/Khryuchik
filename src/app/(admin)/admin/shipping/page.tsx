import type { Metadata } from "next";
import { Alert, Stack } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { saveAdminShippingSettingsAction } from "@/app/(admin)/admin/actions";
import { AdminPageHero } from "@/components/admin-page-shared";
import { AdminManufacturerForm } from "@/components/admin-shipping-page-view";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import { getShippingSettings } from "@/server/shipping/services/shipping-settings.service";

type AdminShippingPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tShipping = await getTranslations({
    locale,
    namespace: "adminPage.shipping",
  });

  return createAdminMetadata(
    tShipping("title"),
    tShipping("description"),
    locale,
  );
};

const AdminShippingPage = async ({ searchParams }: AdminShippingPageProps) => {
  const { error, saved } = await searchParams;
  const locale = await resolveLocale("admin");
  const [tShipping, settings] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.shipping" }),
    getShippingSettings(),
  ]);

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tShipping("eyebrow")}
        title={tShipping("title")}
        description={tShipping("description")}
      />

      {saved ? (
        <Alert severity="success" sx={{ borderRadius: "18px" }}>
          {tShipping("savedMessage")}
        </Alert>
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ borderRadius: "18px" }}>
          {tShipping("errorMessage")}
        </Alert>
      ) : null}

      <AdminManufacturerForm
        locale={locale}
        manufacturer={settings?.manufacturer}
        saveAction={saveAdminShippingSettingsAction}
      />
    </Stack>
  );
};

export default AdminShippingPage;
