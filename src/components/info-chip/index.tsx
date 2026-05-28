import { Paper, Typography } from "@mui/material";

import styles from "./info-chip.module.css";
import type { InfoChipProps } from "./types";

export const InfoChip = ({ text, variant = "default" }: InfoChipProps) => {
  const isTag = variant === "tag";

  return (
    <Paper
      elevation={0}
      className={[styles.chip, isTag ? styles.tag : ""].filter(Boolean).join(" ")}
    >
      <Typography variant={isTag ? "caption" : "body2"} color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
};
