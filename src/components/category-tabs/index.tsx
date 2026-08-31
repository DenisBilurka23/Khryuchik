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
  color: "primary.main",
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
    <Stack direction="row" spacing={1.5} sx={sx}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selectedValue === option.value ? "contained" : "outlined"}
          color={selectedValue === option.value ? "primary" : "inherit"}
          onClick={() => updateValue(option.value)}
          className={className}
          sx={
            selectedValue === option.value
              ? {
                  color: "#fff",
                  borderColor: "primary.main",
                  bgcolor: "primary.main",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.main",
                  },
                }
              : {
                  borderColor: "#E8D6BF",
                  color: "text.primary",
                  bgcolor: "transparent",
                  "&:hover": {
                    borderColor: "#D4B894",
                    bgcolor: "rgba(255, 255, 255, 0.5)",
                  },
                }
          }
        >
          {option.label}
        </Button>
      ))}
    </Stack>
  );
};