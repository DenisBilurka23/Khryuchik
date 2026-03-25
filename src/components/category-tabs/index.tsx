"use client";

import { Button, Stack } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";

import type { CategoryTabsProps } from "./types";

export const CategoryTabs = ({
  selectedValue,
  options,
  className,
  queryParamName = "category",
  defaultValueWithoutQuery,
  preserveQueryParams = [],
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

  return (
    <Stack direction="row" spacing={1.5} sx={sx}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant="outlined"
          color="inherit"
          onClick={() => updateValue(option.value)}
          className={className}
          sx={{
            borderColor: selectedValue === option.value ? "primary.main" : undefined,
            color: selectedValue === option.value ? "primary.main" : "inherit",
          }}
        >
          {option.label}
        </Button>
      ))}
    </Stack>
  );
};