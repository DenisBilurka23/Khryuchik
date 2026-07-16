import type { Metadata } from "next";
import { Alert, Stack } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { saveAdminHeroContentAction } from "@/app/(admin)/admin/actions";
import { AdminHeroEditor } from "@/components/admin-home-page-view";
import { AdminPageHero } from "@/components/admin-page-shared";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminHeroContent } from "@/server/home-content/home-content.service";
import { resolveLocale } from "@/server/i18n/request-locale";

type AdminHomePageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tHome = await getTranslations({ locale, namespace: "adminPage.home" });

  return createAdminMetadata(tHome("title"), tHome("description"), locale);
};

const AdminHomePage = async ({ searchParams }: AdminHomePageProps) => {
  const { error, saved } = await searchParams;
  const locale = await resolveLocale("admin");
  const [tHome, data] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.home" }),
    getAdminHeroContent(locale),
  ]);

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tHome("eyebrow")}
        title={tHome("title")}
        description={tHome("description")}
      />

      {saved ? (
        <Alert severity="success" sx={{ borderRadius: "18px" }}>
          {tHome("savedMessage")}
        </Alert>
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ borderRadius: "18px" }}>
          {tHome("errorMessage")}
        </Alert>
      ) : null}

      <AdminHeroEditor
        locale={locale}
        data={data}
        saveAction={saveAdminHeroContentAction}
      />
    </Stack>
  );
};

export default AdminHomePage;
