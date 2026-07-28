import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import storefrontStyles from "@/components/storefront/storefront.module.css";
import { formatFileSize, formatOrderNumber, getLocalizedPath } from "@/utils";

import type { OrderDownloadsPageViewProps } from "./types";

export const OrderDownloadsPageView = ({
  locale,
  orderId,
  downloads,
}: OrderDownloadsPageViewProps) => {
  const t = useTranslations("downloadsPage");
  const shopHref = getLocalizedPath(locale, "/shop");
  const orderNumber = formatOrderNumber(orderId);
  const isExpired = !downloads || downloads.length === 0;

  return (
    <Box className={storefrontStyles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={storefrontStyles.pageContent}>
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="sm">
            <Card sx={{ border: "1px solid #F0DFC8" }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={3} alignItems="flex-start">
                  <Typography
                    variant="h1"
                    sx={{ fontSize: { xs: 32, md: 44 } }}
                  >
                    {isExpired ? t("expiredTitle") : t("title")}
                  </Typography>
                  {!isExpired && orderNumber ? (
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      {`${t("orderLabel")} ${orderNumber}`}
                    </Typography>
                  ) : null}
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {isExpired ? t("expiredText") : t("lead")}
                  </Typography>

                  {isExpired ? (
                    <Link href={shopHref} style={{ textDecoration: "none" }}>
                      <Button component="span" variant="contained" size="large">
                        {t("backToShop")}
                      </Button>
                    </Link>
                  ) : (
                    <Stack spacing={2} sx={{ width: "100%" }}>
                      {downloads.map((item) => (
                        <Paper
                          key={item.assetId}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: "22px",
                            border: "1px solid #F0DFC8",
                            bgcolor: "#fff",
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={2}
                            sx={{ width: "100%" }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                              sx={{ minWidth: 0, flex: 1 }}
                            >
                              <Box
                                sx={{
                                  width: 56,
                                  height: 56,
                                  flexShrink: 0,
                                  borderRadius: "18px",
                                  bgcolor: "#FCE5EA",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <MenuBookOutlinedIcon />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.format}
                                  {item.sizeBytes
                                    ? ` • ${formatFileSize(item.sizeBytes)}`
                                    : ""}
                                </Typography>
                              </Box>
                            </Stack>
                            <Button
                              variant="contained"
                              startIcon={<DownloadOutlinedIcon />}
                              component="a"
                              href={item.downloadUrl}
                              sx={{ flexShrink: 0 }}
                            >
                              {t("download")}
                            </Button>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export type { OrderDownloadsPageViewProps } from "./types";
