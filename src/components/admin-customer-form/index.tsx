import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { getTranslations } from "next-intl/server";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { DeleteCustomerButton } from "@/components/admin-customers-page-view";
import {
  AdminCheckboxField,
  AdminConfirmSubmitButton,
  AdminPageHero,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { AdminCustomerFormErrorCode } from "@/server/admin/customer-form-state";
import { formatAdminDate, getAdminAuthProviderLabel } from "@/utils/admin";

import { AdminCustomerAvatarUploadField } from "./avatar-upload-field";
import type { AdminCustomerFormProps } from "./types";

export const AdminCustomerForm = async ({
  customer,
  locale,
  action,
  deleteAction,
  errorCode,
  isCurrentUser = false,
}: AdminCustomerFormProps) => {
  const [tForm, tShared, tAuthProviders] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.customers.form" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
    getTranslations({ locale, namespace: "adminPage.shared.status.authProviders" }),
  ]);
  const errorMessage = (() => {
    switch (errorCode) {
      case AdminCustomerFormErrorCode.NotFound:
        return tForm("errorMessages.notFound");
      case AdminCustomerFormErrorCode.StorageUnavailable:
        return tForm("errorMessages.storageUnavailable");
      case AdminCustomerFormErrorCode.EmailTaken:
        return tForm("errorMessages.emailTaken");
      case AdminCustomerFormErrorCode.EmailManagedByGoogle:
        return tForm("errorMessages.emailManagedByGoogle");
      case AdminCustomerFormErrorCode.CannotDeleteSelf:
        return tForm("errorMessages.cannotDeleteSelf");
      case AdminCustomerFormErrorCode.CannotDemoteSelf:
        return tForm("errorMessages.cannotDemoteSelf");
      case AdminCustomerFormErrorCode.LastAdmin:
        return tForm("errorMessages.lastAdmin");
      case AdminCustomerFormErrorCode.SaveFailed:
        return tForm("errorMessages.saveFailed");
      case AdminCustomerFormErrorCode.DeleteFailed:
        return tForm("errorMessages.deleteFailed");
      case AdminCustomerFormErrorCode.Unexpected:
        return tForm("errorMessages.unexpected");
      default:
        return undefined;
    }
  })();
  const title = customer.name || customer.email;
  const authProviderLabels = {
    google: tAuthProviders("google"),
    credentials: tAuthProviders("credentials"),
  };

  return (
    <Stack gap={3}>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {isCurrentUser ? <Alert severity="info">{tForm("helpers.currentAccount")}</Alert> : null}

      <AdminPageHero
        eyebrow={tForm("editEyebrow")}
        title={`${tForm("editTitlePrefix")}: ${title}`}
        description={tForm("editDescription")}
        actions={
          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
            <Button
              href="/admin/customers"
              variant="outlined"
              color="inherit"
              sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
            >
              {tShared("actions.viewAccounts")}
            </Button>
            <DeleteCustomerButton
              userId={customer.id}
              action={deleteAction}
              source="edit"
              disabled={isCurrentUser}
              icon={<DeleteOutlineOutlinedIcon key="delete-customer-button" />}
            />
            <AdminConfirmSubmitButton
              form="admin-customer-form"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              label={tForm("saveChangesButton")}
              pendingLabel={tForm("savingChangesButton")}
            />
          </Stack>
        }
        aside={
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "24px",
              bgcolor: "#fff",
              border: "1px solid #F0DFC8",
              minWidth: { xl: 280 },
            }}
          >
            <Stack gap={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={customer.image ?? undefined} alt={title} sx={{ width: 52, height: 52 }} />
                <Stack>
                  <Typography fontWeight={700}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <AdminStatusChip
                  label={customer.isAdmin ? tShared("status.admin") : tShared("status.user")}
                  tone={customer.isAdmin ? "accent" : "neutral"}
                />
                {customer.authProviders.map((provider) => (
                  <AdminStatusChip
                    key={provider}
                    label={getAdminAuthProviderLabel(provider, authProviderLabels)}
                    tone={provider === "google" ? "info" : "warning"}
                  />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {tForm("fields.createdAt")}: {formatAdminDate(customer.createdAt, locale)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tForm("fields.updatedAt")}: {formatAdminDate(customer.updatedAt, locale)}
              </Typography>
            </Stack>
          </Paper>
        }
      />

      <Box component="form" id="admin-customer-form" action={action}>
        <input type="hidden" name="userId" value={customer.id} />
        <input type="hidden" name="source" value="edit" />

        <Stack gap={3}>
          <AdminSectionCard
            title={tForm("sections.profileTitle")}
            description={tForm("sections.profileDescription")}
          >
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: "28px",
                border: "1px solid rgba(240, 223, 200, 0.9)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,248,245,0.88) 100%)",
                boxShadow: "0 20px 45px rgba(225, 193, 167, 0.12)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} gap={{ xs: 2.5, md: 3 }} alignItems={{ xs: "stretch", md: "flex-start" }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    alignSelf: { xs: "center", md: "flex-start" },
                    pt: { md: 0.5 },
                  }}
                >
                  <AdminCustomerAvatarUploadField
                    name="avatar"
                    removeInputName="removeAvatar"
                    label={tForm("fields.avatar")}
                    helperText={tForm("helpers.avatar")}
                    buttonLabel={tForm("buttons.uploadAvatar")}
                    replaceButtonLabel={tForm("buttons.replaceAvatar")}
                    removeButtonLabel={tForm("buttons.removeAvatar")}
                    emptyLabel={tForm("helpers.emptyAvatar")}
                    currentImageSrc={customer.image ?? null}
                    currentImageAlt={title}
                  />
                </Box>

                <Stack
                  gap={2.5}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label={tForm("fields.userId")}
                        defaultValue={customer.id}
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        label={tForm("fields.email")}
                        defaultValue={customer.email}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        name="name"
                        label={tForm("fields.name")}
                        defaultValue={customer.name}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        name="phone"
                        label={tForm("fields.phone")}
                        defaultValue={customer.phone}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            </Box>
          </AdminSectionCard>

          <AdminSectionCard
            title={tForm("sections.accessTitle")}
            description={tForm("sections.accessDescription")}
          >
            <Stack gap={2}>
              <Stack gap={1}>
                <Typography fontWeight={700}>{tForm("fields.providers")}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {customer.authProviders.map((provider) => (
                    <AdminStatusChip
                      key={provider}
                      label={getAdminAuthProviderLabel(provider, authProviderLabels)}
                      tone={provider === "google" ? "info" : "warning"}
                    />
                  ))}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {tForm("helpers.providers")}
                </Typography>
              </Stack>

              <AdminCheckboxField
                label={tForm("toggles.isAdmin")}
                control={<Checkbox name="isAdmin" defaultChecked={customer.isAdmin} />}
              />

              {isCurrentUser ? (
                <Typography variant="body2" color="text.secondary">
                  {tForm("helpers.currentRoleChange")}
                </Typography>
              ) : null}
            </Stack>
          </AdminSectionCard>

          <AdminSectionCard
            title={tForm("sections.metadataTitle")}
            description={tForm("sections.metadataDescription")}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={tForm("fields.createdAt")}
                  defaultValue={formatAdminDate(customer.createdAt, locale)}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={tForm("fields.updatedAt")}
                  defaultValue={formatAdminDate(customer.updatedAt, locale)}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid>
            </Grid>
          </AdminSectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};

export type { AdminCustomerFormProps } from "./types";