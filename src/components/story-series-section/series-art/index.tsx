import type { SeriesArtProps } from "./types";

export const SeriesArt = ({ tone }: SeriesArtProps) => {
  if (tone === "amber") {
    return (
      <svg
        viewBox="0 0 320 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="storySeriesArtAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5e3cf" />
            <stop offset="100%" stopColor="#e4b58a" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#storySeriesArtAmber)" />
        <path
          d="M0 150 L80 130 L140 145 L210 120 L320 140 L320 200 L0 200 Z"
          fill="#c08148"
          opacity=".55"
        />
        <path
          d="M0 170 L70 160 L150 168 L240 155 L320 165 L320 200 L0 200 Z"
          fill="#9c623a"
          opacity=".55"
        />
        <circle cx="250" cy="50" r="22" fill="#fff4dc" opacity=".9" />
        <g transform="translate(80 110)">
          <rect x="0" y="0" width="70" height="22" rx="4" fill="#3a2630" />
          <rect x="6" y="4" width="16" height="10" rx="1" fill="#fde6ea" />
          <rect x="28" y="4" width="16" height="10" rx="1" fill="#fde6ea" />
          <rect x="50" y="4" width="14" height="10" rx="1" fill="#fde6ea" />
          <circle cx="14" cy="26" r="4" fill="#3a2630" />
          <circle cx="56" cy="26" r="4" fill="#3a2630" />
        </g>
        <g transform="translate(180 130)">
          <rect x="0" y="0" width="32" height="22" rx="3" fill="#f4a5b6" />
          <rect
            x="10"
            y="-5"
            width="12"
            height="6"
            rx="2"
            fill="none"
            stroke="#3a2630"
            strokeWidth="2"
          />
          <line x1="0" y1="10" x2="32" y2="10" stroke="#3a2630" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 200"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="storySeriesArtPink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde8ed" />
          <stop offset="100%" stopColor="#f6c6d2" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#storySeriesArtPink)" />
      <rect x="50" y="120" width="220" height="22" rx="3" fill="#f4a5b6" />
      <rect x="60" y="98" width="200" height="22" rx="3" fill="#eb8aa0" />
      <rect x="70" y="76" width="180" height="22" rx="3" fill="#f4a5b6" />
      <g transform="translate(155 38)">
        <ellipse cx="0" cy="20" rx="22" ry="18" fill="#f4a5b6" />
        <ellipse cx="0" cy="26" rx="9" ry="7" fill="#eb8aa0" />
        <circle cx="-4" cy="26" r="1.4" fill="#3a2630" />
        <circle cx="4" cy="26" r="1.4" fill="#3a2630" />
        <circle cx="-8" cy="16" r="1.6" fill="#3a2630" />
        <circle cx="8" cy="16" r="1.6" fill="#3a2630" />
        <path d="M-12 4 L-18 -2 L-6 0 Z" fill="#f4a5b6" />
        <path d="M12 4 L18 -2 L6 0 Z" fill="#f4a5b6" />
      </g>
    </svg>
  );
};
