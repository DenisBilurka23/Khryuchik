import { createTheme } from "@mui/material";

export const storefrontTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D96C82",
    },
    secondary: {
      main: "#F7C9D1",
    },
    background: {
      default: "#FFF8F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#27272A",
      secondary: "#71717A",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    h1: {
      fontFamily: "var(--font-display), serif",
      fontWeight: 800,
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: "var(--font-display), serif",
      fontWeight: 800,
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: "var(--font-display), serif",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: "none",
          paddingInline: 20,
          paddingBlock: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        },
      },
    },
  },
});
