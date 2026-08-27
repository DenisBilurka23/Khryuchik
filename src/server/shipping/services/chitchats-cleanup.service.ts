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
const MAX_LIST_PAGES = 100;

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

    let scanned = 0;
    let deleted = 0;
    let failed = 0;

    // Measured 2026-08-26: the list endpoint ignores `status` entirely — asking
    // for `incomplete` returns `unpaid` and everything else too. So the sweep
    // reads every page and `isAbandonedQuote` is the only thing standing
    // between the cleanup and a real order.
    for (let page = 1; page <= MAX_LIST_PAGES; page += 1) {
      const params = new URLSearchParams({
        to_date: cutoffDate(),
        limit: String(LIST_PAGE_SIZE),
        page: String(page),
      });

      const response = await chitchatsRequest(
        config,
        `/shipments?${params.toString()}`,
      );
      const shipments = unwrapShipments(response);

      if (shipments.length === 0) {
        break;
      }

      scanned += shipments.length;

      for (const shipment of shipments.filter(isAbandonedQuote)) {
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
    }

    return {
      status: "ok",
      scanned,
      deleted,
      failed,
    };
  };
