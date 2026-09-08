export const colors = {
  page: "#fffcf8",
  cream: "#fbf7f2",
  hero: "#fbf7f5",
  heroRose: "#f9eaef",
  products: "#f4ece6",
  entertainment: "#f3e8ed",
  newsletter: "#faeaef",
  card: "#fffdfc",
  white: "#ffffff",

  text: "#34272d",
  textSecondary: "#756a70",
  textMuted: "#9b8f94",

  accent: "#a96375",
  action: "#8f5263",
  actionHover: "#754252",
  accentSoft: "#e8d5dc",
  accentPale: "#f5ecef",
  accentTint: "#f3e4e8",

  border: "#ded4ce",
  borderRose: "#cda7b2",

  aqua: "#86bdb8",
  aquaLight: "#e7f1ef",

  olive: "#9b985a",
  green: "#b9d66b",
  greenLight: "#eef4d0",

  lilac: "#d9aec2",

  selection: "rgba(169, 99, 117, 0.2)",
} as const;

const toCustomProperty = (key: string) =>
  `--color-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;

export const colorCustomProperties: Record<string, string> = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => [toCustomProperty(key), value]),
);
