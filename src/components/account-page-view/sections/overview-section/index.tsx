import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { SectionCard } from "../../shared";

import type { OverviewSectionProps } from "./types";

export const OverviewSection = ({
  locale,
  dictionary,
  orders,
  downloads,
  addresses,
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
  onSave,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
}: OverviewSectionProps) => {
  return (
    <Stack spacing={3}>
      <SectionCard
        title={dictionary.personalData}
        action={
          <Button
            variant={isEditingProfile ? "contained" : "outlined"}
            color="inherit"
            startIcon={isEditingProfile ? <SaveOutlinedIcon /> : <EditOutlinedIcon />}
            sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
            onClick={isEditingProfile ? () => void onSave() : onBeginEdit}
            loading={isSavingProfile}
          >
            {isEditingProfile ? dictionary.save : dictionary.editProfile}
          </Button>
        }
      >
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

      <SectionCard
        title={dictionary.recentOrders}
        action={<Button variant="text">{dictionary.allOrders}</Button>}
      >
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper
              key={order.id}
              elevation={0}
              sx={{
                p: 2.25,
                borderRadius: "22px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{order.id}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {order.date}
                  </Typography>
                  <Typography sx={{ mt: 1.25 }}>{order.items}</Typography>
                </Box>
                <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1}>
                  <Chip
                    label={order.status}
                    sx={{
                      bgcolor: order.status === dictionary.delivered ? "#E6F6EC" : "#FFF3D6",
                      fontWeight: 700,
                    }}
                  />
                  <Typography sx={{ fontWeight: 800 }}>{order.total}</Typography>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </SectionCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title={dictionary.downloadedBooks}>
            <Stack spacing={2}>
              {downloads.map((item) => (
                <Paper
                  key={item.title}
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.format} • {item.size}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<DownloadOutlinedIcon />}
                      sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
                    >
                      {locale === "ru" ? "Скачать" : "Download"}
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title={dictionary.shippingAddresses}>
            <Stack spacing={2}>
              {addresses.map((address) => (
                <Paper
                  key={address.title}
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <LocationOnOutlinedIcon />
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{address.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.8 }}>
                        {address.line1}
                        <br />
                        {address.line2}
                        <br />
                        {address.line3}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export type { OverviewSectionProps } from "./types";