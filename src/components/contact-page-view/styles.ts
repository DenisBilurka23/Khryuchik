export const contactPanelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "minmax(0, 0.86fr) minmax(0, 1.14fr)",
  },
  alignItems: "stretch",
  gap: { xs: 2, md: 3 },
  mt: { xs: 3, md: 4 },
  p: { xs: 2, md: 3 },
  borderRadius: "var(--radius-panel)",
  background: "var(--color-accent-pale)",
} as const;
