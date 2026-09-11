import type { Metadata } from "next";
import { Button, Stack } from "@mui/material";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AdminEntertainmentForm } from "@/components/admin-entertainment-form";
import { AdminPageHero } from "@/components/admin-page-shared";
import { getAdminEntertainmentEditorData } from "@/server/admin/entertainment.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";

import { saveAdminEntertainmentItemAction } from "../../actions";

type NewAdminEntertainmentPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tForm = await getTranslations({
    locale,
    namespace: "adminPage.entertainmentForm",
  });

  return createAdminMetadata(
    tForm("newTitle"),
    tForm("newDescription"),
    locale,
  );
};

const NewAdminEntertainmentPage = async ({
  searchParams,
}: NewAdminEntertainmentPageProps) => {
  const { error } = await searchParams;
  const locale = await resolveLocale("admin");
  const [editorData, tForm, tEntertainment] = await Promise.all([
    getAdminEntertainmentEditorData(),
    getTranslations({ locale, namespace: "adminPage.entertainmentForm" }),
    getTranslations({ locale, namespace: "adminPage.entertainment" }),
  ]);

  if (!editorData) {
    notFound();
  }

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tForm("newEyebrow")}
        title={tForm("newTitle")}
        description={tForm("newDescription")}
        actions={
          <Button href="/admin/entertainment" variant="outlined">
            {tEntertainment("backToList")}
          </Button>
        }
      />

      <AdminEntertainmentForm
        key={`new:${error ?? "ok"}`}
        locale={locale}
        item={editorData.item}
        activeLocales={editorData.activeLocales}
        action={saveAdminEntertainmentItemAction}
        isNew
        errorCode={error}
      />
    </Stack>
  );
};

export default NewAdminEntertainmentPage;
