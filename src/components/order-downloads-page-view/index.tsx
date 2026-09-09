import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { NoticePage } from "@/components/notice-page";
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
    <NoticePage
      title={isExpired ? t("expiredTitle") : t("title")}
      label={
        !isExpired && orderNumber
          ? `${t("orderLabel")} ${orderNumber}`
          : undefined
      }
      text={isExpired ? t("expiredText") : t("lead")}
    >
      {isExpired ? (
        <Link href={shopHref}>
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
                border: "1px solid var(--color-border)",
                bgcolor: "var(--color-white)",
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
                      borderRadius: "var(--radius-plate)",
                      bgcolor: "var(--color-accent-tint)",
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
                    <Typography variant="body2" color="text.secondary">
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
    </NoticePage>
  );
};

export type { OrderDownloadsPageViewProps } from "./types";
