import { Chip } from "@mui/material";

import type {
  AdminStatusChipProps,
  AdminStatusChipTone,
} from "./types";

const toneStyles: Record<AdminStatusChipTone, { bg: string }> = {
  success: { bg: "#E6F6EC" },
  warning: { bg: "#FFF3D6" },
  info: { bg: "#E8EEFF" },
  neutral: { bg: "#F1F1F4" },
  accent: { bg: "#FCE5EA" },
};

export const AdminStatusChip = ({ label, tone = "neutral" }: AdminStatusChipProps) => {
  const currentTone =
    label.toLowerCase() === "admin"
      ? { bg: "#FCE5EA" }
      : label.toLowerCase() === "user"
        ? { bg: "#F1F1F4" }
        : toneStyles[tone];

  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: currentTone.bg, fontWeight: 700 }}
    />
  );
};