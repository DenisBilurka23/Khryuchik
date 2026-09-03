import { createTheme } from "@mui/material";

export const storefrontTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8F5263",
      dark: "#754252",
      light: "#E8D5DC",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A96375",
      light: "#F5ECEF",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFCF8",
      paper: "#FFFDFC",
    },
    text: {
      primary: "#34272D",
      secondary: "#756A70",
      disabled: "#9B8F94",
    },
    divider: "#DED4CE",
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
          borderColor: "#CDA7B2",
          color: "#34272D",
          backgroundColor: "transparent",
          "&:hover": {
            borderColor: "#CDA7B2",
            backgroundColor: "#F5ECEF",
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
  },
});
