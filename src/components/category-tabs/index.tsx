"use client";

import { Box, Button, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";

import styles from "./category-tabs.module.css";
import type { CategoryTabsProps } from "./types";

export const CategoryTabs = ({
  selectedValue,
  options,
  className,
  queryParamName = "category",
  defaultValueWithoutQuery,
  preserveQueryParams = [],
  variant = "pills",
  label,
  sx,
}: CategoryTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateValue = (nextValue: string) => {
    const params = new URLSearchParams();

    for (const key of preserveQueryParams) {
      const value = searchParams.get(key);

      if (value) {
        params.set(key, value);
      }
    }

    if (nextValue !== "all" && nextValue !== defaultValueWithoutQuery) {
      params.set(queryParamName, nextValue);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  if (variant === "text") {
    return (
      <Box className={className} sx={sx}>
        {label ? (
          <Typography component="p" className={styles.textLabel}>
            {label}
          </Typography>
        ) : null}

        <Box className={styles.textTabs}>
          {options.map((option) => {
            const isActive = selectedValue === option.value;

            return (
              <Button
                key={option.value}
                variant="text"
                disableRipple
                onClick={() => updateValue(option.value)}
                className={`${styles.textTab} ${isActive ? styles.textTabActive : ""}`}
              >
                {option.label}
              </Button>
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Box className={`${styles.pills} ${className ?? ""}`} sx={sx}>
      {options.map((option) => {
        const isActive = selectedValue === option.value;

        return (
          <Button
            key={option.value}
            variant="text"
            disableElevation
            onClick={() => updateValue(option.value)}
            className={`${styles.pill} ${isActive ? styles.pillActive : ""}`}
          >
            {option.label}
          </Button>
        );
      })}
    </Box>
  );
};

export type { CategoryTabOption, CategoryTabsProps } from "./types";
