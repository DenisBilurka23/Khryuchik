import type { Metadata } from "next";
import { Alert, Box, Checkbox, Stack, TextField } from "@mui/material";
import { getTranslations } from "next-intl/server";

import {
  AdminPromoCodeCard,
  AdminPromoCodeInput,
} from "@/components/admin-promocodes-page-view";
import {
  AdminCheckboxField,
  AdminConfirmSubmitButton,
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
} from "@/components/admin-page-shared";
import {
  deleteAdminPromoCodeAction,
  saveAdminPromoCodeAction,
} from "@/app/(admin)/admin/actions";
import {
  DEFAULT_PROMO_PERCENT,
  MAX_PROMO_PERCENT,
  MIN_PROMO_PERCENT,
} from "@/constants/promo";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import { getAdminPromoCodes } from "@/server/promo/services/promo-codes.service";
import { formatAdminDate } from "@/utils/admin";

type AdminPromoCodesPageProps = {
  searchParams: Promise<{ deleted?: string; error?: string; saved?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tPromoCodes = await getTranslations({
    locale,
    namespace: "adminPage.promocodes",
  });

  return createAdminMetadata(
    tPromoCodes("title"),
    tPromoCodes("description"),
    locale,
  );
};

const AdminPromoCodesPage = async ({
  searchParams,
}: AdminPromoCodesPageProps) => {
  const { deleted, error, saved } = await searchParams;
  const locale = await resolveLocale("admin");
  const [promoCodes, tPromoCodes] = await Promise.all([
    getAdminPromoCodes(),
    getTranslations({ locale, namespace: "adminPage.promocodes" }),
  ]);
  const existingCodes = promoCodes.map((promoCode) => promoCode.code);
  const labels = {
    eyebrow: tPromoCodes("eyebrow"),
    title: tPromoCodes("title"),
    description: tPromoCodes("description"),
    savedMessage: tPromoCodes("savedMessage"),
    deletedMessage: tPromoCodes("deletedMessage"),
    invalidCodeMessage: tPromoCodes("invalidCodeMessage"),
    invalidPercentMessage: tPromoCodes("invalidPercentMessage"),
    newPromoCodeTitle: tPromoCodes("newPromoCodeTitle"),
    newPromoCodeDescription: tPromoCodes("newPromoCodeDescription"),
    saveButton: tPromoCodes("saveButton"),
    savingButton: tPromoCodes("savingButton"),
    emptyTitle: tPromoCodes("emptyTitle"),
    emptyDescription: tPromoCodes("emptyDescription"),
    fields: {
      percentOff: tPromoCodes("fields.percentOff"),
    },
    toggles: {
      isActive: tPromoCodes("toggles.isActive"),
    },
  };

  return (
    <Stack gap={3}>
      <AdminPageHero eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />

      {saved === "1" ? <Alert severity="success">{labels.savedMessage}</Alert> : null}
      {deleted === "1" ? <Alert severity="success">{labels.deletedMessage}</Alert> : null}
      {error === "invalid-code" ? <Alert severity="error">{labels.invalidCodeMessage}</Alert> : null}
      {error === "invalid-percent" ? <Alert severity="error">{labels.invalidPercentMessage}</Alert> : null}

      <AdminSectionCard title={labels.newPromoCodeTitle} description={labels.newPromoCodeDescription}>
        <form action={saveAdminPromoCodeAction}>
          <Stack gap={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
              <AdminPromoCodeInput
                key={existingCodes.join("|")}
                existingCodes={existingCodes}
              />
              <TextField
                label={labels.fields.percentOff}
                name="percentOff"
                type="number"
                defaultValue={DEFAULT_PROMO_PERCENT}
                required
                slotProps={{
                  htmlInput: { min: MIN_PROMO_PERCENT, max: MAX_PROMO_PERCENT },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked />} label={labels.toggles.isActive} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <AdminConfirmSubmitButton
                variant="contained"
                label={labels.saveButton}
                pendingLabel={labels.savingButton}
              />
            </Box>
          </Stack>
        </form>
      </AdminSectionCard>

      {promoCodes.length === 0 ? (
        <AdminEmptyState title={labels.emptyTitle} description={labels.emptyDescription} />
      ) : (
        <Stack gap={2}>
          {promoCodes.map((promoCode) => (
            <AdminPromoCodeCard
              key={promoCode.code}
              promoCode={promoCode}
              description={tPromoCodes("cardDescription", {
                percentOff: promoCode.percentOff,
                createdAt: formatAdminDate(promoCode.createdAt, locale),
              })}
              saveAction={saveAdminPromoCodeAction}
              deleteAction={deleteAdminPromoCodeAction}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default AdminPromoCodesPage;
