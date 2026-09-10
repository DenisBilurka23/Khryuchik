import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DownloadRow } from "@/components/download-row";
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
            <DownloadRow
              key={item.assetId}
              download={item}
              actionLabel={t("download")}
            />
          ))}
        </Stack>
      )}
    </SectionCard>
  );
};

export type { BooksSectionProps } from "./types";
