import { REGION_MAP_SHAPES } from "./shapes";
import type { RegionMapProps } from "./types";

const labelFont = {
  fontFamily: "var(--font-body, var(--font-body-fallback)), sans-serif",
};

const svgProps = {
  viewBox: "0 0 320 260",
  width: "100%",
  height: "100%",
  preserveAspectRatio: "xMidYMid slice",
  style: { display: "block" },
  "aria-hidden": true,
};

export const RegionMap = ({ region, city }: RegionMapProps) => {
  const shape = REGION_MAP_SHAPES[region];
  const { pin, label } = shape;
  const routePath = shape.route
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");
  const stops = shape.route.filter(({ x, y }) => x !== pin.x || y !== pin.y);

  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <rect width="320" height="260" fill="var(--color-accent-soft)" />

      <path
        d={shape.land}
        fill="var(--color-hero-rose)"
        stroke="var(--color-white)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d={shape.region}
        fill="var(--color-cream)"
        stroke="var(--color-action)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <path
        d={routePath}
        stroke="var(--color-accent)"
        strokeWidth="1.6"
        strokeDasharray="4 4"
        strokeLinecap="round"
        opacity="0.7"
      />
      {stops.map(({ x, y }) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="4.2"
          fill="var(--color-accent)"
        />
      ))}

      <circle
        cx={pin.x}
        cy={pin.y}
        r="12"
        fill="var(--color-white)"
        opacity="0.95"
      />
      <circle
        cx={pin.x}
        cy={pin.y}
        r="11"
        stroke="var(--color-accent)"
        strokeWidth="2.4"
        opacity="0.42"
      />
      <circle cx={pin.x} cy={pin.y} r="6.4" fill="var(--color-accent)" />

      <text
        x={label.x}
        y={label.y}
        fontSize="13"
        fontWeight="700"
        fill="var(--color-text)"
        stroke="var(--color-cream)"
        strokeWidth="3"
        strokeLinejoin="round"
        paintOrder="stroke"
        textAnchor={label.anchor}
        style={labelFont}
      >
        {city}
      </text>

      <g transform="translate(252 16) scale(0.86)">
        <rect
          x="0"
          y="0"
          width="56"
          height="38"
          rx="5"
          fill="var(--color-white)"
          stroke="var(--color-text)"
          strokeWidth="1.8"
        />
        <rect x="0" y="9" width="56" height="8" fill="var(--color-text)" />
        <rect
          x="8"
          y="25"
          width="20"
          height="6"
          rx="1"
          fill="var(--color-accent)"
        />
      </g>
    </svg>
  );
};

export type { RegionMapProps } from "./types";
