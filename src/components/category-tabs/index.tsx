"use client";

import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CSSObject, Theme } from "@mui/material/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";

import type { CategoryTabsProps, CategoryTabVariant } from "./types";

type TabState = { tabVariant: CategoryTabVariant; isActive: boolean };

const pillStyles = (theme: Theme, isActive: boolean): CSSObject => ({
  minHeight: 44,
  padding: "0 20px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-pill)",
  fontSize: 14,
  lineHeight: 1.2,
  ...(isActive
    ? {
        borderColor: "transparent",
        background: "var(--color-accent-tint)",
        fontWeight: 600,
        color: "var(--color-action)",
      }
    : {
        background: "transparent",
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        "&:hover": {
          borderColor: "var(--color-border-rose)",
          background: "var(--color-accent-pale)",
          color: "var(--color-action-hover)",
        },
      }),
  [theme.breakpoints.down("md")]: { flex: "0 0 auto" },
});

const textStyles = (isActive: boolean): CSSObject => ({
  minWidth: 0,
  minHeight: 0,
  padding: "4px 0",
  borderRadius: 0,
  borderBottom: "2px solid transparent",
  background: "transparent",
  fontSize: 14,
  ...(isActive
    ? {
        borderBottomColor: "var(--color-accent)",
        fontWeight: 600,
        color: "var(--color-text)",
      }
    : { fontWeight: 500, color: "var(--color-text-secondary)" }),
  "&:hover": { background: "transparent", color: "var(--color-action)" },
});

const Tab = styled(Button, {
  shouldForwardProp: (prop) => prop !== "tabVariant" && prop !== "isActive",
})<TabState>(({ theme, tabVariant, isActive }) =>
  tabVariant === "pills" ? pillStyles(theme, isActive) : textStyles(isActive),
);

const PillList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  [theme.breakpoints.down("md")]: {
    flexWrap: "nowrap",
    overflowX: "auto",
    paddingBottom: 4,
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
}));

const labelSx = {
  mb: 1,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-accent)",
} as const;

export const CategoryTabs = ({
  selectedValue,
  options,
  sx,
  queryParamName = "category",
  defaultValueWithoutQuery,
  preserveQueryParams = [],
  variant = "pills",
  label,
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

  const renderTabs = () =>
    options.map((option) => (
      <Tab
        key={option.value}
        variant="text"
        tabVariant={variant}
        isActive={selectedValue === option.value}
        disableRipple={variant === "text"}
        disableElevation={variant === "pills"}
        onClick={() => updateValue(option.value)}
      >
        {option.label}
      </Tab>
    ));

  if (variant === "text") {
    return (
      <Box sx={sx}>
        {label ? (
          <Typography component="p" sx={labelSx}>
            {label}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
          {renderTabs()}
        </Box>
      </Box>
    );
  }

  return <PillList sx={sx}>{renderTabs()}</PillList>;
};

export type {
  CategoryTabOption,
  CategoryTabsProps,
  CategoryTabVariant,
} from "./types";
