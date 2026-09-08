import { Box } from "@mui/material";

import type { PageShellProps } from "./types";

export const PageShell = ({ children }: PageShellProps) => {
  return (
    <Box
      sx={{
        flex: "1 0 auto",
        color: "var(--color-text)",
        background: "var(--color-page)",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};

export type { PageShellProps } from "./types";
