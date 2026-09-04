import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Typography } from "@mui/material";

import styles from "./by-receipt-card.module.css";
import type { ByReceiptCardProps } from "./types";

export const ByReceiptCard = ({
  type,
  num,
  rows,
  totalLabel,
  totalValue,
  stamp,
}: ByReceiptCardProps) => {
  return (
    <Box className={styles.root}>
      <Box className={styles.receipt}>
        <Box className={styles.head}>
          <Typography component="span" className={styles.type}>
            {type}
          </Typography>
          <Typography component="span" className={styles.num}>
            {num}
          </Typography>
        </Box>

        {rows.map((row) => (
          <Box key={row.label} className={styles.row}>
            <Typography component="span" className={styles.rowLabel}>
              {row.label}
            </Typography>
            <Typography component="span" className={styles.rowValue}>
              {row.value}
            </Typography>
          </Box>
        ))}

        <Box className={styles.total}>
          <Typography component="span" className={styles.totalLabel}>
            {totalLabel}
          </Typography>
          <Typography component="span" className={styles.totalValue}>
            {totalValue}
          </Typography>
        </Box>
      </Box>

      <Box className={styles.stamp}>
        <CheckCircleOutlineIcon className={styles.stampIcon} />
        <Typography component="span" className={styles.stampText}>
          {stamp.line1}
          <br />
          {stamp.line2}
        </Typography>
      </Box>
    </Box>
  );
};

export type { ByReceiptCardProps } from "./types";
