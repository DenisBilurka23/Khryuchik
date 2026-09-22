import { createTheme } from "@mui/material";
import { darken } from "@mui/material/styles";

import { colors } from "./colors";

const alertTone = (background: string, accent: string, strength: number) => {
  const ink = darken(accent, strength);

  return {
    backgroundColor: background,
    border: `1px solid ${accent}`,
    color: colors.text,
    "& .MuiAlert-icon": { color: ink },
    "& a, & .MuiLink-root": { color: ink },
  };
};

export const storefrontTheme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1024, xl: 1200 },
  },
  palette: {
    mode: "light",
    primary: {
      main: colors.action,
      dark: colors.actionHover,
      light: colors.accentSoft,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.accent,
      dark: colors.action,
      light: colors.accentPale,
      contrastText: colors.white,
    },
    background: {
      default: colors.page,
      paper: colors.card,
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
      disabled: colors.textMuted,
    },
    action: {
      disabled: colors.disabledText,
      disabledBackground: colors.disabled,
    },
    success: {
      main: colors.olive,
    },
    warning: {
      main: colors.star,
    },
    error: {
      main: colors.danger,
    },
    info: {
      main: colors.aqua,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-body, var(--font-body-fallback)), sans-serif",
    h1: {
      fontFamily: "var(--font-display, var(--font-display-fallback)), serif",
      fontWeight: 600,
      lineHeight: 1.02,
      fontSize: 64,
      "@media (max-width:1199.95px)": {
        fontSize: 50,
      },
      "@media (max-width:899.95px)": {
        fontSize: 40,
      },
      "@media (max-width:767.95px)": {
        fontSize: 38,
      },
    },
    h2: {
      fontFamily: "var(--font-display, var(--font-display-fallback)), serif",
      fontWeight: 600,
      lineHeight: 1.12,
      fontSize: 40,
      "@media (max-width:899.95px)": {
        fontSize: 30,
      },
    },
    h3: {
      fontFamily: "var(--font-display, var(--font-display-fallback)), serif",
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingInline: 16,
          [theme.breakpoints.up("sm")]: {
            paddingInline: 24,
          },
          [theme.breakpoints.up("lg")]: {
            paddingInline: 40,
          },
        }),
        maxWidthLg: {
          maxWidth: "1280px !important",
        },
        maxWidthXl: {
          maxWidth: "1600px !important",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 11,
          boxShadow: "none",
          minHeight: 48,
          paddingInline: 24,
          paddingBlock: 12,
        },
        sizeSmall: {
          minHeight: 40,
          paddingInline: 16,
          paddingBlock: 8,
        },
        outlined: {
          borderColor: colors.borderRose,
          color: colors.text,
          backgroundColor: "transparent",
          "&:hover": {
            borderColor: colors.borderRose,
            backgroundColor: colors.accentPale,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "var(--shadow-card)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: alertTone(colors.greenLight, colors.olive, 0.35),
        standardWarning: alertTone(colors.butter, colors.star, 0.35),
        standardError: alertTone(colors.dangerLight, colors.danger, 0.2),
        standardInfo: alertTone(colors.aquaLight, colors.aqua, 0.4),
      },
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
    MuiPopover: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
});
