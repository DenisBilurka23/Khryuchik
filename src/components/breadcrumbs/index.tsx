import { Breadcrumbs as MuiBreadcrumbs, Box, Typography } from "@mui/material";
import Link from "next/link";

import type { BreadcrumbsProps } from "./types";

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <MuiBreadcrumbs
      separator="→"
      sx={{
        paddingTop: { xs: 3, md: 4.5 },
        paddingBottom: { xs: 2.5, md: 3.5 },
        fontSize: 14,
        color: "var(--color-text-muted)",
        "& .MuiBreadcrumbs-separator": {
          marginInline: 1.5,
          color: "var(--color-accent)",
        },
      }}
    >
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href}>
            <Box
              component="span"
              sx={{
                color: "var(--color-text-secondary)",
                transition: "color 0.2s ease",
                "&:hover": { color: "var(--color-action)" },
              }}
            >
              {item.label}
            </Box>
          </Link>
        ) : (
          <Typography
            key={item.label}
            component="span"
            sx={{ fontSize: 14, color: "var(--color-text-muted)" }}
          >
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
};

export type { BreadcrumbItem, BreadcrumbsProps } from "./types";
