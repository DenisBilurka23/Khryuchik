"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

import type { TimelineNodeState, TimelineTrackProps } from "./types";

const reached: CSSObject = {
  borderColor: "var(--color-action)",
  background: "var(--color-action)",
};

const stateStyles: Record<TimelineNodeState, CSSObject> = {
  idle: {},
  passed: reached,
  active: {
    ...reached,
    width: 20,
    height: 20,
    boxShadow: "0 0 0 7px var(--color-accent-pale)",
  },
};

const Rail = styled("div")({
  position: "relative",
  height: 2,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-border)",
});

const Progress = styled("div")({
  position: "absolute",
  top: "50%",
  left: 0,
  height: 3,
  transform: "translateY(-50%)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-action)",
  transition: "width 0.35s ease",
});

const Node = styled("button")({
  position: "absolute",
  top: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  transform: "translate(-50%, -50%)",
});

const Dot = styled("span", {
  shouldForwardProp: (prop) => prop !== "state",
})<{ state: TimelineNodeState }>(({ state }) => ({
  width: 16,
  height: 16,
  borderRadius: "var(--radius-pill)",
  border: "2px solid var(--color-border)",
  background: "var(--color-card)",
  transition:
    "width 0.25s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  ...stateStyles[state],
}));

const NodeLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ isActive }) => ({
  position: "absolute",
  top: 26,
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
  color: isActive ? "var(--color-action)" : "var(--color-text-secondary)",
}));

const nodeState = (index: number, activeIndex: number): TimelineNodeState => {
  if (index === activeIndex) {
    return "active";
  }

  return index < activeIndex ? "passed" : "idle";
};

export const TimelineTrack = ({
  books,
  activeIndex,
  onSelect,
}: TimelineTrackProps) => {
  const lastIndex = Math.max(books.length - 1, 1);

  return (
    <Box sx={{ margin: { xs: "32px 8px 0", md: "40px 12px 0" }, pb: "34px" }}>
      <Rail>
        <Progress style={{ width: `${(activeIndex / lastIndex) * 100}%` }} />

        {books.map((book, index) => {
          const state = nodeState(index, activeIndex);

          return (
            <Node
              key={book.slug}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={book.title}
              aria-pressed={state === "active"}
              style={{ left: `${(index / lastIndex) * 100}%` }}
            >
              <Dot state={state} />
              {book.ageRating ? (
                <NodeLabel isActive={state === "active"}>
                  {book.ageRating}
                </NodeLabel>
              ) : null}
            </Node>
          );
        })}
      </Rail>
    </Box>
  );
};

export type { TimelineTrackProps } from "./types";
