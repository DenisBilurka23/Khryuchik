"use client";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateAdminLocalePreferenceClient } from "@/client-api/admin-locale";
import { locales } from "@/i18n/config";
import { localeLabels } from "@/utils";
import { HeaderSelect } from "@/components/storefront-header/header-select";

import type { AdminLocaleSwitcherProps } from "./types";

export const AdminLocaleSwitcher = ({
  locale,
  label,
}: AdminLocaleSwitcherProps) => {
  const router = useRouter();
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  const options = useMemo(
    () => locales.map((item) => ({ value: item, label: localeLabels[item] })),
    [],
  );

  const handleChange = async (nextLocale: string) => {
    if (
      (nextLocale !== "ru" && nextLocale !== "en") ||
      nextLocale === selectedLocale ||
      isPending
    ) {
      return;
    }

    const previousLocale = selectedLocale;
    setSelectedLocale(nextLocale);

    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }

    const response = await updateAdminLocalePreferenceClient(nextLocale).catch(
      () => null,
    );

    if (!response?.ok) {
      setSelectedLocale(previousLocale);
      return;
    }

    window.setTimeout(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 0);
  };

  return (
    <HeaderSelect
      value={selectedLocale}
      label={label}
      options={options}
      onChange={(value) => {
        void handleChange(value);
      }}
      disabled={isPending}
      icon={
        <LanguageOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
      }
      sx={{ minWidth: 110 }}
    />
  );
};
