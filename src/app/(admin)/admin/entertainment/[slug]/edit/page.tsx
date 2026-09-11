import type { Metadata } from "next";
import { Alert, Button, Stack } from "@mui/material";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AdminEntertainmentForm } from "@/components/admin-entertainment-form";
import { DeleteEntertainmentItemButton } from "@/components/admin-entertainment-page-view/delete-item-button";
import { AdminPageHero } from "@/components/admin-page-shared";
import { defaultLocale } from "@/i18n/config";
import { getAdminEntertainmentEditorData } from "@/server/admin/entertainment.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";

import {
  deleteAdminEntertainmentItemAction,
  saveAdminEntertainmentItemAction,
} from "../../../actions";

type EditAdminEntertainmentPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export const generateMetadata = async ({
  params,
}: EditAdminEntertainmentPageProps): Promise<Metadata> => {
  const [locale, { slug }] = await Promise.all([
    resolveLocale("admin"),
    params,
  ]);
  const tForm = await getTranslations({
    locale,
    namespace: "adminPage.entertainmentForm",
  });

  return createAdminMetadata(
    `${tForm("editTitlePrefix")}: ${slug}`,
    tForm("editDescription"),
    locale,
  );
};

const EditAdminEntertainmentPage = async ({
  params,
  searchParams,
}: EditAdminEntertainmentPageProps) => {
  const { slug } = await params;
  const { saved, error } = await searchParams;
  const locale = await resolveLocale("admin");
  const [editorData, tForm, tEntertainment] = await Promise.all([
    getAdminEntertainmentEditorData(slug),
    getTranslations({ locale, namespace: "adminPage.entertainmentForm" }),
    getTranslations({ locale, namespace: "adminPage.entertainment" }),
  ]);

  if (!editorData) {
    notFound();
  }

  const title =
    editorData.item.translations[locale]?.title ??
    editorData.item.translations[defaultLocale]?.title ??
    editorData.item.slug;

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tForm("editEyebrow")}
        title={title}
        description={tForm("editDescription")}
        actions={
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button href="/admin/entertainment" variant="outlined">
              {tEntertainment("backToList")}
            </Button>
            <DeleteEntertainmentItemButton
              slug={editorData.item.slug}
              action={deleteAdminEntertainmentItemAction}
            />
          </Stack>
        }
      />

      {saved === "1" ? (
        <Alert severity="success">{tForm("savedMessage")}</Alert>
      ) : null}

      <AdminEntertainmentForm
        key={`${editorData.item.slug}:${saved ?? "0"}:${error ?? "ok"}`}
        locale={locale}
        item={editorData.item}
        activeLocales={editorData.activeLocales}
        action={saveAdminEntertainmentItemAction}
        isNew={false}
        errorCode={error}
      />
    </Stack>
  );
};

export default EditAdminEntertainmentPage;
