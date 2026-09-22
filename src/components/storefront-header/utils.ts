export const headerIconButtonSx = (active: boolean) =>
  ({
    flex: "0 0 auto",
    color: active ? "var(--color-action)" : "var(--color-text)",
    "&:hover": {
      color: "var(--color-action)",
      bgcolor: "transparent",
    },
  }) as const;
