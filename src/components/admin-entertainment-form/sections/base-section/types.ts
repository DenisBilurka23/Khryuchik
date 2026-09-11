import type {
  EntertainmentCategoryKey,
  EntertainmentItemDocument,
} from "@/types/entertainment";

export type AdminEntertainmentBaseSectionProps = {
  item: EntertainmentItemDocument;
  isNew: boolean;
  selectedCategory: EntertainmentCategoryKey;
  onCategoryChangeAction: (category: EntertainmentCategoryKey) => void;
};
