import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { customerOrderStatusColors } from "@/constants/order";
import { formatFileSize } from "@/utils";
import {
  getUserShippingAddressLines,
  getUserShippingAddressTitle,
} from "@/utils/account-page";

import { PersonalDetailsSection, SectionCard } from "../../shared";

import type { OverviewSectionProps } from "./types";

export const OverviewSection = ({
  locale,
  orders,
  downloads,
  addresses,
  selectedShippingAddressId,
  profileEditor,
}: OverviewSectionProps) => {
  const t = useTranslations("accountPage");
  const tStatus = useTranslations("accountPage.orderStatuses");

  return (
    <Stack spacing={3}>
      <PersonalDetailsSection {...profileEditor} />

      <SectionCard
        title={t("recentOrders")}
        action={<Button variant="text">{t("allOrders")}</Button>}
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
                  <Typography sx={{ fontWeight: 800 }}>{order.number}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </Typography>
                  <Typography sx={{ mt: 1.25 }}>{order.itemsSummary}</Typography>
                </Box>
                <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1}>
                  <Chip
                    label={tStatus(order.status)}
                    sx={{
                      bgcolor: customerOrderStatusColors[order.status],
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
          <SectionCard title={t("downloadedBooks")}>
            <Stack spacing={2}>
              {downloads.length === 0 ? (
                <Typography color="text.secondary">{t("noBooks")}</Typography>
              ) : (
                downloads.map((item) => (
                  <Paper
                    key={item.assetId}
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
                      alignItems="center"
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.productTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.format}
                          {item.sizeBytes
                            ? ` • ${formatFileSize(item.sizeBytes)}`
                            : ""}
                          {` • ${new Intl.DisplayNames([item.locale], { type: "language" }).of(item.locale) ?? item.locale.toUpperCase()}`}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<DownloadOutlinedIcon />}
                        component="a"
                        href={item.downloadUrl}
                        sx={{ borderColor: "#E8D6BF", bgcolor: "#fff", flexShrink: 0 }}
                      >
                        {t("download")}
                      </Button>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title={t("shippingAddresses")}>
            <Stack spacing={2}>
              {addresses.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography color="text.secondary">{t("noAddressesYet")}</Typography>
                </Paper>
              ) : null}

              {addresses.map((address) => {
                const isCurrent = address.id === selectedShippingAddressId;
                const lines = getUserShippingAddressLines(address, locale);

                return (
                  <Paper
                    key={address.id}
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: "22px",
                      border: isCurrent ? "1px solid #D9876C" : "1px solid #F0DFC8",
                      bgcolor: "#fff",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <LocationOnOutlinedIcon />
                      <Box sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            {getUserShippingAddressTitle(address)}
                          </Typography>
                          {isCurrent ? (
                            <Chip label={t("currentAddress")} color="primary" size="small" />
                          ) : null}
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, lineHeight: 1.8 }}
                        >
                          {lines.map((line) => (
                            <Box key={line} component="span" display="block">
                              {line}
                            </Box>
                          ))}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export type { OverviewSectionProps } from "./types";