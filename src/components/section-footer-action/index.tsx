import { Box, Button } from "@mui/material";
import Link from "next/link";

import { secondaryButtonSx } from "@/theme/sx";

import type { SectionFooterActionProps } from "./types";

const buttonSx = {
  ...secondaryButtonSx,
  gap: 1,
  minHeight: 52,
  fontSize: 15,
  fontWeight: 600,
  boxShadow: "var(--shadow-card-soft)",
  "&:hover": {
    borderColor: "var(--color-border-rose)",
    background: "var(--color-accent-pale)",
  },
} as const;

export const SectionFooterAction = ({
  label,
  href,
}: SectionFooterActionProps) => {
  return (
    <Box sx={{ display: { xs: "block", md: "none" }, mt: 3 }}>
      <Link href={href} style={{ display: "block" }}>
        <Button component="span" variant="outlined" fullWidth sx={buttonSx}>
          {label}
          <Box component="span" aria-hidden>
            →
          </Box>
        </Button>
      </Link>
    </Box>
  );
};

export type { SectionFooterActionProps } from "./types";
