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