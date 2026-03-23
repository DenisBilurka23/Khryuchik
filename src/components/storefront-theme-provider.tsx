"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import type { ReactNode } from "react";

import { storefrontTheme } from "./theme";

export const StorefrontThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <ThemeProvider theme={storefrontTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
