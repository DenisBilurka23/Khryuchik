"use client";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { storefrontTheme } from "@/theme";

import type { StorefrontThemeProviderProps } from "./types";

export const StorefrontThemeProvider = ({
  children,
}: StorefrontThemeProviderProps) => {
  return (
    <ThemeProvider theme={storefrontTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export type { StorefrontThemeProviderProps } from "./types";