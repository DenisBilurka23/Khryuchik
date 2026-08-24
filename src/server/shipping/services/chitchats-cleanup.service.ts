import "server-only";

import {
  CHITCHATS_DELETABLE_STATUSES,
  CHITCHATS_QUOTE_CLEANUP_AFTER_DAYS,
  CHITCHATS_QUOTE_ORDER_ID,
} from "@/constants/chitchats";

import {
  chitchatsRequest,
  getChitChatsConfig,
  unwrapShipments,
} from "../providers/chitchats.client";
import type { ChitChatsShipment } from "../providers/chitchats.types";

const LIST_PAGE_SIZE = 100;

export type ChitChatsCleanupSummary = {
  status: "ok" | "not-configured";
  scanned: number;
  deleted: number;
  failed: number;
};

const cutoffDate = () => {
  const cutoff = new Date();

  cutoff.setUTCDate(cutoff.getUTCDate() - CHITCHATS_QUOTE_CLEANUP_AFTER_DAYS);

  return cutoff.toISOString().slice(0, 10);
};

const isAbandonedQuote = (shipment: ChitChatsShipment) =>
  shipment.order_id === CHITCHATS_QUOTE_ORDER_ID &&
  CHITCHATS_DELETABLE_STATUSES.includes(shipment.status ?? "");

export const cleanupChitChatsQuoteShipments =
  async (): Promise<ChitChatsCleanupSummary> => {
    const config = getChitChatsConfig();

    if (!config) {
      return { status: "not-configured", scanned: 0, deleted: 0, failed: 0 };
    }

    const params = new URLSearchParams({
      status: "incomplete",
      to_date: cutoffDate(),
      limit: String(LIST_PAGE_SIZE),
    });

    const response = await chitchatsRequest(
      config,
      `/shipments?${params.toString()}`,
    );
    const shipments = unwrapShipments(response);
    const abandoned = shipments.filter(isAbandonedQuote);

    let deleted = 0;
    let failed = 0;

    for (const shipment of abandoned) {
      try {
        await chitchatsRequest(config, `/shipments/${shipment.id}`, {
          method: "DELETE",
        });
        deleted += 1;
      } catch (error) {
        console.error(
          `Failed to delete Chit Chats shipment ${shipment.id}`,
          error,
        );
        failed += 1;
      }
    }

    return {
      status: "ok",
      scanned: shipments.length,
      deleted,
      failed,
    };
  };
