"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";

import type { CategoryTabsProps } from "./types";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--color-accent)",
} as const;

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
      <Box sx={sx}>
        {label ? (
          <Typography sx={{ ...eyebrowSx, mb: 1 }}>{label}</Typography>
        ) : null}
        <Stack
          direction="row"
          spacing={2.5}
          useFlexGap
          flexWrap="wrap"
          sx={{ rowGap: 0.5 }}
        >
          {options.map((option) => {
            const isActive = selectedValue === option.value;

            return (
              <Button
                key={option.value}
                variant="text"
                disableRipple
                onClick={() => updateValue(option.value)}
                className={className}
                sx={{
                  px: 0,
                  minWidth: 0,
                  borderRadius: 0,
                  textTransform: "none",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "primary.main" : "text.secondary",
                  borderBottom: "2px solid",
                  borderColor: isActive ? "primary.main" : "transparent",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "primary.main",
                  },
                }}
              >
                {option.label}
              </Button>
            );
          })}
        </Stack>
      </Box>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      flexWrap="wrap"
      sx={sx}
    >
      {options.map((option) => {
        const isActive = selectedValue === option.value;

        return (
          <Button
            key={option.value}
            variant="text"
            disableElevation
            onClick={() => updateValue(option.value)}
            className={className}
            sx={{
              minHeight: 40,
              px: 2.5,
              py: 1,
              borderRadius: "var(--radius-pill)",
              border: "1px solid",
              fontWeight: isActive ? 600 : 500,
              fontSize: 14,
              borderColor: isActive
                ? "var(--color-accent-soft)"
                : "var(--color-border)",
              bgcolor: isActive
                ? "var(--color-accent-soft)"
                : "var(--color-card)",
              color: isActive
                ? "var(--color-text)"
                : "var(--color-text-secondary)",
              "&:hover": {
                bgcolor: isActive
                  ? "var(--color-accent-soft)"
                  : "var(--color-accent-pale)",
                borderColor: "var(--color-border-rose)",
              },
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </Stack>
  );
};
