import type {
  EntertainmentItemDocument,
  EntertainmentMedia,
} from "@/types/entertainment";

import type { AdminEntertainmentPendingChangeHandler } from "../../types";

export type AdminEntertainmentMediaSectionProps = {
  item: EntertainmentItemDocument;
  mediaType: EntertainmentMedia["type"];
  onPendingChangeAction: AdminEntertainmentPendingChangeHandler;
};
