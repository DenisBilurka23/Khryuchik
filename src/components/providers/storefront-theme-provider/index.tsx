"use client";

import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { storefrontTheme } from "@/theme";
import { colorCustomProperties, colors } from "@/theme/colors";

import type { StorefrontThemeProviderProps } from "./types";

export const StorefrontThemeProvider = ({
  children,
}: StorefrontThemeProviderProps) => {
  return (
    <ThemeProvider theme={storefrontTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": colorCustomProperties,
          "*::selection": { background: colors.selection },
        }}
      />
      {children}
    </ThemeProvider>
  );
};

export type { StorefrontThemeProviderProps } from "./types";
