import { Box, Typography } from "@mui/material";

import styles from "./contact-channels-section.module.css";
import type { ContactChannelKind, ContactChannelsSectionProps } from "./types";

const channelModifierClass: Record<ContactChannelKind, string> = {
  ig: styles.channelIg,
  fb: styles.channelFb,
  mail: styles.channelMail,
};

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
    <Box className={styles.root}>
      <Typography variant="h2" className={styles.title}>
        {title}
      </Typography>

      <Typography className={styles.sub}>{sub}</Typography>

      <Box className={styles.list}>
        {channels.map((channel) => (
          <Box
            key={channel.kind}
            component="a"
            className={`${styles.channel} ${channelModifierClass[channel.kind]}`}
            href={channel.href}
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <Box component="span" className={styles.channelIcon}>
              <ChannelIcon kind={channel.kind} />
            </Box>

            <Box component="span" className={styles.channelCopy}>
              <Box component="span" className={styles.channelLabel}>
                {channel.label}
              </Box>
              <Box component="span" className={styles.channelValue}>
                {channel.value}
              </Box>
            </Box>

            <svg
              className={styles.channelArrow}
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
            </svg>
          </Box>
        ))}
      </Box>

      <Box className={styles.note}>
        <Box component="span" className={styles.noteDot} />
        {note}
      </Box>
    </Box>
  );
};

export type { ContactChannelsSectionProps } from "./types";
