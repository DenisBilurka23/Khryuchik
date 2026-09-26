import { describe, expect, it } from "vitest";

import {
  chooseHubs,
  dropDominatedOptions,
  resolvePickupGroupIds,
  serviceableHubs,
  toOrderFulfillments,
} from "@/server/shipping/utils";
import type {
  ShippingFulfillmentGroup,
  ShippingOption,
} from "@/types/shipping";

const option = (
  id: string,
  overrides: Partial<ShippingOption> = {},
): ShippingOption => ({
  id,
  provider: "bpost",
  service: id,
  amount: 10,
  currency: "EUR",
  hasTracking: false,
  deliveryType: "pickup-point",
  ...overrides,
});

const group = (
  id: string,
  overrides: Partial<ShippingFulfillmentGroup> = {},
): ShippingFulfillmentGroup => ({
  id,
  source: "manual",
  options: [option(`${id}:address`, { deliveryType: "address" })],
  selectedOptionId: `${id}:address`,
  amount: 10,
  itemIds: ["item-1"],
  ...overrides,
});

describe("dropDominatedOptions", () => {
  it("drops a more expensive otherwise identical option", () => {
    const cheaper = option("cheaper");
    const expensive = option("expensive", { amount: 11 });

    expect(dropDominatedOptions([expensive, cheaper])).toEqual([cheaper]);
  });

  it("prefers address delivery when all other attributes are equal", () => {
    const pickup = option("pickup");
    const address = option("address", { deliveryType: "address" });

    expect(dropDominatedOptions([pickup, address])).toEqual([address]);
  });

  it("keeps price and tracking trade-offs", () => {
    const cheapUntracked = option("cheap", { amount: 8 });
    const tracked = option("tracked", { hasTracking: true });

    expect(dropDominatedOptions([cheapUntracked, tracked])).toEqual([
      cheapUntracked,
      tracked,
    ]);
  });

  it("does not let identical options dominate each other", () => {
    const first = option("first");
    const second = option("second");

    expect(dropDominatedOptions([first, second])).toEqual([first, second]);
  });
});

describe("serviceableHubs", () => {
  it("routes North America to its regional hub", () => {
    expect(serviceableHubs("CA")).toEqual(["northAmerica"]);
  });

  it("routes Europe to its regional hub", () => {
    expect(serviceableHubs("BE")).toEqual(["europe"]);
  });

  it("allows both hubs for other destinations", () => {
    expect(serviceableHubs("AU")).toEqual(["europe", "northAmerica"]);
  });
});

describe("chooseHubs", () => {
  it("uses all serviceable hubs when stock is not tracked by hub", () => {
    expect(chooseHubs("US", [])).toEqual(["northAmerica"]);
  });

  it("keeps only stocked hubs that serve the destination", () => {
    expect(chooseHubs("AU", ["northAmerica"])).toEqual(["northAmerica"]);
  });

  it("falls back to the stocked hub when the regional hub has no stock", () => {
    expect(chooseHubs("US", ["europe"])).toEqual(["europe"]);
  });
});

describe("resolvePickupGroupIds", () => {
  it("returns only groups whose selected option uses a pickup point", () => {
    expect(
      resolvePickupGroupIds([
        group("address"),
        group("pickup", {
          options: [
            option("pickup:selected", { deliveryType: "pickup-point" }),
          ],
          selectedOptionId: "pickup:selected",
        }),
        group("unselected", { selectedOptionId: null }),
      ]),
    ).toEqual(["pickup"]);
  });
});

describe("toOrderFulfillments", () => {
  it("maps a selected physical option and attaches its pickup point", () => {
    const pickupPoint = {
      id: "point-1",
      type: 1,
      name: "Central Post Office",
      country: "BE",
    };
    const selected = option("pickup:selected", {
      service: "pickupPoint",
      deliveryType: "pickup-point",
      externalId: "external-1",
    });

    expect(
      toOrderFulfillments(
        [
          group("pickup", {
            options: [selected],
            selectedOptionId: selected.id,
          }),
        ],
        { pickup: pickupPoint },
      ),
    ).toEqual([
      {
        id: "pickup",
        source: "manual",
        provider: "bpost",
        service: "pickupPoint",
        amount: 10,
        currency: "EUR",
        parcel: undefined,
        externalId: "external-1",
        pickupPoint,
      },
    ]);
  });

  it("skips digital groups and groups without a selected option", () => {
    expect(
      toOrderFulfillments([
        group("digital", { source: "digital" }),
        group("missing", { selectedOptionId: "unknown" }),
      ]),
    ).toEqual([]);
  });
});
