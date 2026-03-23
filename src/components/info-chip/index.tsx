import { Paper, Typography } from "@mui/material";

import styles from "./info-chip.module.css";
import type { InfoChipProps } from "./types";

export const InfoChip = ({ text }: InfoChipProps) => {
  return (
    <Paper elevation={0} className={styles.chip}>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
};
