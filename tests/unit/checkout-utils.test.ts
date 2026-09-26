import { describe, expect, it } from "vitest";

import {
  isPaymentMethod,
  isValidEmail,
  parseCustomer,
  parseSelectedShippingOptionIds,
  parseShippingAddress,
} from "@/app/api/checkout/utils";
import { isPostalCodeValid } from "@/utils/postal-code";
import { isRegionRequired } from "@/utils/country";

describe("parseCustomer", () => {
  it("normalizes a valid customer", () => {
    expect(
      parseCustomer({
        firstName: "  Ada ",
        lastName: " Lovelace  ",
        email: " ADA@EXAMPLE.COM ",
        phone: " +1 555 0100 ",
        telegram: " @ada ",
      }),
    ).toEqual({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "+1 555 0100",
      telegram: "@ada",
    });
  });

  it("omits blank optional contact fields", () => {
    expect(
      parseCustomer({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: " ",
      }),
    ).toMatchObject({ phone: undefined, telegram: undefined });
  });

  it.each([
    null,
    "customer",
    {},
    { firstName: "", lastName: "Lovelace", email: "ada@example.com" },
    { firstName: "Ada", lastName: "", email: "ada@example.com" },
    { firstName: "Ada", lastName: "Lovelace", email: "" },
    { firstName: "Ada", lastName: "Lovelace", email: 42 },
  ])("rejects an invalid customer", (value) => {
    expect(parseCustomer(value)).toBeNull();
  });
});

describe("parseShippingAddress", () => {
  it("normalizes a valid address", () => {
    expect(
      parseShippingAddress({
        line1: "  123 Main Street ",
        line2: " Apartment 4 ",
        city: " New York ",
        region: " NY ",
        postalCode: "10001",
        country: "US",
      }),
    ).toEqual({
      line1: "123 Main Street",
      line2: "Apartment 4",
      city: "New York",
      region: "NY",
      postalCode: "10001",
      country: "US",
    });
  });

  it.each([
    null,
    "address",
    {},
    { line1: "", city: "New York", postalCode: "10001", country: "US" },
    { line1: "123 Main", city: "", postalCode: "10001", country: "US" },
    {
      line1: "123 Main",
      city: "New York",
      postalCode: "10001",
      country: "us",
    },
    {
      line1: "123 Main",
      city: "New York",
      postalCode: "!",
      country: "US",
    },
  ])("rejects an invalid address", (value) => {
    expect(parseShippingAddress(value)).toBeNull();
  });
});

describe("checkout scalar validation", () => {
  it.each(["stripe", "cod", "telegram_transfer"])(
    "accepts the %s payment method",
    (method) => {
      expect(isPaymentMethod(method)).toBe(true);
    },
  );

  it.each(["cash", "", null, 42])(
    "rejects an invalid payment method",
    (value) => {
      expect(isPaymentMethod(value)).toBe(false);
    },
  );

  it.each(["ada@example.com", "a+b@example.co.uk"])(
    "accepts the email %s",
    (email) => {
      expect(isValidEmail(email)).toBe(true);
    },
  );

  it.each(["ada", "ada@", "@example.com", "ada @example.com"])(
    "rejects the email %s",
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe("parseSelectedShippingOptionIds", () => {
  it("keeps string option identifiers", () => {
    expect(
      parseSelectedShippingOptionIds({
        manual: "bpost:standard",
        printify: "printify:standard",
      }),
    ).toEqual({
      manual: "bpost:standard",
      printify: "printify:standard",
    });
  });

  it("drops non-string values", () => {
    expect(
      parseSelectedShippingOptionIds({ manual: "bpost:standard", invalid: 42 }),
    ).toEqual({ manual: "bpost:standard" });
  });

  it.each([null, [], "option", {}, { invalid: 42 }])(
    "returns undefined for an unusable selection",
    (value) => {
      expect(parseSelectedShippingOptionIds(value)).toBeUndefined();
    },
  );
});

describe("address rules", () => {
  it.each(["10001", "H2X 1Y4", "SW1A 1AA", "123456789012", " 10001 "])(
    "accepts the postal code %s",
    (postalCode) => {
      expect(isPostalCodeValid(postalCode)).toBe(true);
    },
  );

  it.each(["A", "1234567890123", "!0001", "10001!"])(
    "rejects the postal code %s",
    (postalCode) => {
      expect(isPostalCodeValid(postalCode)).toBe(false);
    },
  );

  it.each(["US", "CA", "MX", "AU"])("requires a region for %s", (country) => {
    expect(isRegionRequired(country)).toBe(true);
  });

  it("does not require a region for Belgium", () => {
    expect(isRegionRequired("BE")).toBe(false);
  });
});
