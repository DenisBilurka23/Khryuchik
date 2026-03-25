"use client";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
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
