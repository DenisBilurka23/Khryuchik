import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";

import { SectionCard } from "../section-card";

import type { PersonalDetailsSectionProps } from "./types";

export const PersonalDetailsSection = ({
  dictionary,
  firstName,
  lastName,
  email,
  phone,
  isEditingProfile,
  isSavingProfile,
  isEmailEditable,
  profileError,
  profileSuccess,
  onBeginEdit,
  onCancel,
  onSave,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
}: PersonalDetailsSectionProps) => {
  const action = isEditingProfile ? (
    <Stack direction="row" spacing={1.5}>
      {onCancel ? (
        <Button
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
          onClick={onCancel}
        >
          {dictionary.cancel}
        </Button>
      ) : null}
      <Button
        variant="contained"
        startIcon={<SaveOutlinedIcon />}
        onClick={() => void onSave()}
        loading={isSavingProfile}
      >
        {dictionary.save}
      </Button>
    </Stack>
  ) : (
    <Button
      variant="outlined"
      color="inherit"
      startIcon={<EditOutlinedIcon />}
      sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
      onClick={onBeginEdit}
    >
      {dictionary.editProfile}
    </Button>
  );

  return (
    <SectionCard title={dictionary.personalData} action={action}>
      <Box component="form" onSubmit={onSave}>
        <Stack spacing={2} sx={{ mb: 2.5 }}>
          {profileError ? <Chip color="error" label={profileError} /> : null}
          {profileSuccess ? <Chip color="success" label={profileSuccess} /> : null}
          {!isEmailEditable ? (
            <Typography color="text.secondary">{dictionary.emailManagedByGoogle}</Typography>
          ) : null}
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={dictionary.firstNameLabel}
              value={firstName}
              onChange={(event) => onFirstNameChange(event.target.value)}
              disabled={!isEditingProfile}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={dictionary.lastNameLabel}
              value={lastName}
              onChange={(event) => onLastNameChange(event.target.value)}
              disabled={!isEditingProfile}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={dictionary.emailLabel}
              value={email}
              onChange={(event) => onEmailChange(event.target.value.toLowerCase())}
              disabled={!isEditingProfile || !isEmailEditable}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={dictionary.phoneLabel}
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              disabled={!isEditingProfile}
            />
          </Grid>
        </Grid>
      </Box>
    </SectionCard>
  );
};

export type { PersonalDetailsSectionProps } from "./types";