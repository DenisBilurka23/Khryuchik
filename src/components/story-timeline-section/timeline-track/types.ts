import type { StoryTimelineBook } from "@/types/story";

export type TimelineTrackProps = {
  books: StoryTimelineBook[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export type TimelineNodeState = "idle" | "passed" | "active";
