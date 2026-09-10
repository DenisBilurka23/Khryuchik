import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { DownloadRow } from "@/components/download-row";
import { NoticePage } from "@/components/notice-page";
import { formatOrderNumber, getLocalizedPath } from "@/utils";

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
            <DownloadRow
              key={item.assetId}
              download={item}
              actionLabel={t("download")}
            />
          ))}
        </Stack>
      )}
    </NoticePage>
  );
};

export type { OrderDownloadsPageViewProps } from "./types";
