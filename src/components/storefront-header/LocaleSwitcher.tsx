"use client";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { localeLabels } from "../utils";
import { HeaderSelect } from "./HeaderSelect";
import type { LocaleSwitcherProps } from "./types";

export const LocaleSwitcher = ({
  locale,
  label,
  localizedPaths,
  sx,
}: LocaleSwitcherProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <HeaderSelect
      value={locale}
      label={label}
      icon={<LanguageOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />}
      disabled={isPending}
      options={(Object.keys(localeLabels) as Array<keyof typeof localeLabels>).map(
        (targetLocale) => ({
          value: targetLocale,
          label: localeLabels[targetLocale],
        }),
      )}
      onChange={(value) => {
        if (value !== locale && (value === "ru" || value === "en")) {
          startTransition(() => {
            router.push(localizedPaths[value]);
          });
        }
      }}
      sx={sx}
    />
  );
};