import styles from "../../contact-page-view.module.css";
import type {
  ContactChannelKind,
  ContactChannelsSectionProps,
} from "./types";

const channelModifierClass: Record<ContactChannelKind, string> = {
  ig: styles.channelIg,
  fb: styles.channelFb,
  mail: styles.channelMail,
};

const ChannelIcon = ({ kind }: { kind: ContactChannelKind }) => {
  if (kind === "ig") {
    return (
      <svg
        width="26"
        height="26"
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
        width="26"
        height="26"
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
      width="26"
      height="26"
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

const ArrowIcon = () => (
  <svg
    className={styles.channelArrow}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ContactChannelsSection = ({
  title,
  sub,
  note,
  channels,
}: ContactChannelsSectionProps) => {
  return (
    <div>
      <div className={styles.channelsHead}>
        <h2 className={styles.channelsTitle}>{title}</h2>
        <p className={styles.channelsSub}>{sub}</p>
      </div>

      <div className={styles.channelsList}>
        {channels.map((channel) => (
          <a
            key={channel.kind}
            className={`${styles.channel} ${channelModifierClass[channel.kind]}`}
            href={channel.href}
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className={styles.channelIcon}>
              <ChannelIcon kind={channel.kind} />
            </span>
            <span className={styles.channelCopy}>
              <span className={styles.channelLabel}>{channel.label}</span>
              <span className={styles.channelValue}>{channel.value}</span>
            </span>
            <ArrowIcon />
          </a>
        ))}
      </div>

      <div className={styles.channelsNote}>
        <span className={styles.channelsNoteDot} />
        {note}
      </div>
    </div>
  );
};

export type { ContactChannelsSectionProps } from "./types";
