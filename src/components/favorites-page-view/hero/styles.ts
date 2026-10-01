export const favoritesHeroSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(380px, 1fr)",
  },
  alignItems: "center",
  gap: { xs: 3, md: 2 },
  minHeight: { xs: 0, md: 285 },
  p: { xs: "28px 20px", md: 4.5 },
  boxShadow: "var(--shadow-panel)",
} as const;

export const favoritesHeroContentSx = {
  position: "relative",
  zIndex: 2,
  maxWidth: { xs: "none", md: 560 },
} as const;

export const favoritesHeroArtSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: { xs: "center", md: "flex-end" },
  minWidth: 0,
  width: { xs: "min(90%, 500px)", md: "auto" },
  marginInline: { xs: "auto", md: 0 },
  mt: { xs: 0, md: "-1.5rem" },
  mb: "-1.5rem",
} as const;

export const favoritesHeroArtImageStyle = {
  width: "100%",
  maxWidth: 530,
  height: "auto",
} as const;
