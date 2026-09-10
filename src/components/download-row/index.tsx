import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Box, Button, Stack, Typography } from "@mui/material";

import { IconTile, Plate } from "@/components/primitives";
import { secondaryButtonSx } from "@/theme/sx";
import { getDownloadMeta } from "@/utils";

import type { DownloadRowProps } from "./types";

const rowSx = {
  width: "100%",
} as const;

const titleSx = {
  fontWeight: 700,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export const DownloadRow = ({ download, actionLabel }: DownloadRowProps) => {
  return (
    <Plate pad="sm">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={rowSx}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <IconTile tone="accent" sx={{ flexShrink: 0 }}>
            <MenuBookOutlinedIcon />
          </IconTile>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={titleSx}>{download.productTitle}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {getDownloadMeta(download)}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<DownloadOutlinedIcon />}
          component="a"
          href={download.downloadUrl}
          sx={{ ...secondaryButtonSx, flexShrink: 0 }}
        >
          {actionLabel}
        </Button>
      </Stack>
    </Plate>
  );
};

export type { DownloadRowProps } from "./types";
