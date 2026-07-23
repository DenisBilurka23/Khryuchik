import { useLocale, useTranslations } from "next-intl";

import { StatusScreen } from "@/components/status-screen";
import { CONTACT_EMAIL } from "@/constants/contact";
import { getLocalizedPath } from "@/utils";

import type { ErrorViewProps } from "./types";

export const ErrorView = ({ error, onRetry }: ErrorViewProps) => {
  console.error("Storefront route error boundary", error);

  const t = useTranslations("storefront.errorPage");
  const locale = useLocale();

  return (
    <StatusScreen
      emoji="🙈"
      blobTone="warm"
      title={t("title")}
      titleTone="danger"
      text={t("text")}
      actions={[
        {
          kind: "button",
          label: t("retryCta"),
          onClick: () => onRetry(),
          variant: "primary",
        },
        {
          kind: "link",
          label: t("homeCta"),
          href: getLocalizedPath(locale, "/"),
          variant: "ghost",
        },
      ]}
      footer={
        <>
          {t("helpPrefix")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </>
      }
    />
  );
};

export type { ErrorViewProps } from "./types";
