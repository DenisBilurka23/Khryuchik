import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { EntertainmentDownloadLink } from "@/components/entertainment-download-link";
import { Pill, Plate } from "@/components/primitives";
import { ENTERTAINMENT_PLACEHOLDER_EMOJI } from "@/constants/entertainment";
import { leadSx } from "@/theme/sx";
import { getEntertainmentDownloadMeta } from "@/utils";

import { itemMetaSx, itemTitleSx } from "../styles";
import type { EntertainmentDownloadDetailsProps } from "./types";

const layoutSx = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  alignItems: "start",
  gap: 3,
  "@media (min-width: 768px)": {
    gridTemplateColumns: "minmax(0, min(35%, 400px)) minmax(0, 1fr)",
  },
} as const;

const coverSx = {
  width: "100%",
  maxWidth: 400,
  mx: "auto",
  position: "relative",
  display: "grid",
  placeItems: "center",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  fontSize: 80,
  "@media (min-width: 768px)": { mx: 0 },
} as const;

const descriptionSx = { ...leadSx, mt: 2.5, whiteSpace: "pre-line" } as const;

export const EntertainmentDownloadDetails = ({
  item,
  categoryLabel,
  downloadLabel,
  openPdfLabel,
  children,
}: EntertainmentDownloadDetailsProps) => {
  if (item.media.type !== "download") {
    return null;
  }

  return (
    <Box sx={layoutSx}>
      <Plate pad="none" sx={coverSx}>
        {item.poster?.src ? (
          <Image
            src={item.poster.src}
            alt={item.title}
            fill
            loading="eager"
            sizes="(max-width: 431px) calc(100vw - 32px), (max-width: 767px) 400px, (max-width: 1199px) 35vw, 400px"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <Box component="span" aria-hidden>
            {item.poster?.emoji ??
              ENTERTAINMENT_PLACEHOLDER_EMOJI[item.category]}
          </Box>
        )}
      </Plate>

      <Box sx={{ minWidth: 0 }}>
        <Pill tone="cream">{categoryLabel}</Pill>
        <Typography variant="h1" sx={{ ...itemTitleSx, mt: 2 }}>
          {item.title}
        </Typography>
        <Typography component="p" sx={{ ...itemMetaSx, mt: 1.5 }}>
          {getEntertainmentDownloadMeta(item.media)}
        </Typography>

        {item.description ? (
          <Typography component="p" sx={descriptionSx}>
            {item.description}
          </Typography>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={1.5}
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          sx={{ mt: 3, flexWrap: "wrap" }}
        >
          <EntertainmentDownloadLink
            slug={item.slug}
            label={downloadLabel}
            variant="contained"
          />
          {item.media.contentType === "application/pdf" ? (
            <Button
              component="a"
              href={item.media.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="large"
              endIcon={<OpenInNewRoundedIcon />}
            >
              {openPdfLabel}
            </Button>
          ) : null}
        </Stack>

        {children ? <Box sx={{ mt: 2 }}>{children}</Box> : null}
      </Box>
    </Box>
  );
};
