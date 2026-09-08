import { Box, Typography } from "@mui/material";

import type { IconTileTone } from "@/components/primitives";
import { IconTile, Note } from "@/components/primitives";

import type { ContactChannelKind, ContactChannelsSectionProps } from "./types";

const channelIconTone: Record<ContactChannelKind, IconTileTone> = {
  ig: "accent",
  fb: "aqua",
  mail: "olive",
};

const channelSx = {
  display: "grid",
  gridTemplateColumns: "52px minmax(0, 1fr) 18px",
  alignItems: "center",
  gap: { xs: 1.75, md: 2 },
  minHeight: 104,
  p: { xs: 2, md: "18px 20px" },
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  background: "var(--color-card)",
  transition: "border-color 0.2s ease, background 0.2s ease",
  "&:hover": {
    borderColor: "var(--color-border-rose)",
    background: "var(--color-white)",
  },
  "&:hover .channel-arrow": {
    transform: "translate(2px, -2px)",
    color: "var(--color-action)",
  },
} as const;

const channelLabelSx = {
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--color-text-secondary)",
} as const;

const channelValueSx = {
  mt: 1,
  fontSize: 17,
  fontWeight: 500,
  lineHeight: 1.25,
  color: "var(--color-text)",
  overflowWrap: "anywhere",
} as const;

const arrowSx = {
  color: "var(--color-text-muted)",
  transition: "transform 0.2s ease, color 0.2s ease",
} as const;

const noteDotSx = {
  flex: "0 0 8px",
  width: 8,
  height: 8,
  mt: 0.75,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-action)",
} as const;

const ChannelIcon = ({ kind }: { kind: ContactChannelKind }) => {
  if (kind === "ig") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (kind === "fb") {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path
          d="M14 8.5V7c0-1 .5-1.5 1.6-1.5H17V2.6h-2.4C11.9 2.6 10.4 4.2 10.4 7v1.5H8v3h2.4V21H14v-9.5h2.3l.5-3H14z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
};

export const ContactChannelsSection = ({
  title,
  sub,
  note,
  channels,
}: ContactChannelsSectionProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: 30, md: 36 }, lineHeight: 1.05 }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 1.75,
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--color-text-secondary)",
        }}
      >
        {sub}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3.5 }}>
        {channels.map((channel) => (
          <Box
            key={channel.kind}
            component="a"
            href={channel.href}
            sx={channelSx}
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <IconTile tone={channelIconTone[channel.kind]}>
              <ChannelIcon kind={channel.kind} />
            </IconTile>

            <Box
              component="span"
              sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
            >
              <Box component="span" sx={channelLabelSx}>
                {channel.label}
              </Box>
              <Box component="span" sx={channelValueSx}>
                {channel.value}
              </Box>
            </Box>

            <Box
              component="svg"
              className="channel-arrow"
              sx={arrowSx}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M7 17L17 7M9 7h8v8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Note sx={{ mt: 2.25 }}>
        <Box component="span" sx={noteDotSx} />
        {note}
      </Note>
    </Box>
  );
};

export type { ContactChannelsSectionProps } from "./types";
