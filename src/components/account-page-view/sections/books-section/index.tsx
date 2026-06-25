import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { formatFileSize } from "@/utils";
import { SectionCard } from "../../shared";
import type { BooksSectionProps } from "./types";

export const BooksSection = ({ downloads }: BooksSectionProps) => {
  const t = useTranslations("accountPage");

  return (
    <SectionCard title={t("downloadedBooks")}>
      {downloads.length === 0 ? (
        <Typography color="text.secondary">{t("noBooks")}</Typography>
      ) : (
        <Stack spacing={2}>
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
                    <Typography variant="body2" color="text.secondary">
                      {item.format}
                      {item.sizeBytes
                        ? ` • ${formatFileSize(item.sizeBytes)}`
                        : ""}
                      {` • ${new Intl.DisplayNames([item.locale], { type: "language" }).of(item.locale) ?? item.locale.toUpperCase()}`}
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
    </SectionCard>
  );
};

export type { BooksSectionProps } from "./types";
