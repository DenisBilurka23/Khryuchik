import type { AdminProductPayload } from "@/types/admin";

import type { AdminLanguagesFieldHub } from "../../languages-field/types";

export type AdminProductShippingSectionProps = {
  payload: AdminProductPayload;
  hubs: AdminLanguagesFieldHub[];
};
