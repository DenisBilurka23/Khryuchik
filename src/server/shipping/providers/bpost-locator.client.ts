import "server-only";

import {
  BPOST_LOCATOR_LIMIT,
  BPOST_LOCATOR_POINT_TYPES,
  BPOST_LOCATOR_TIMEOUT_MS,
  BPOST_LOCATOR_URL,
} from "@/constants/bpost";
import type {
  ShippingDestination,
  ShippingPickupPoint,
} from "@/types/shipping";

export type BpostLocatorConfig = {
  partner: string;
  appId: string;
};

export const getBpostLocatorConfig = (): BpostLocatorConfig | null => {
  const partner = process.env.BPOST_LOCATOR_PARTNER;
  const appId = process.env.BPOST_LOCATOR_APP_ID;

  if (!partner || !appId) {
    return null;
  }

  return { partner, appId };
};

const XML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

const decodeXml = (value: string) =>
  value.replace(
    /&(?:amp|lt|gt|quot|apos);/g,
    (entity) => XML_ENTITIES[entity] ?? entity,
  );

const readTag = (xml: string, tag: string): string | undefined => {
  const match = new RegExp(`<${tag}>([^<]*)</${tag}>`).exec(xml);

  return match ? decodeXml(match[1]).trim() || undefined : undefined;
};

const parsePoints = (xml: string, country: string): ShippingPickupPoint[] => {
  const points: ShippingPickupPoint[] = [];

  for (const block of xml.match(/<Record>[\s\S]*?<\/Record>/g) ?? []) {
    const id = readTag(block, "Id");
    const name = readTag(block, "Name");

    if (!id || !name) {
      continue;
    }

    points.push({
      id,
      type: Number(readTag(block, "Type") ?? 0),
      name,
      street: readTag(block, "Street"),
      number: readTag(block, "Number"),
      postalCode: readTag(block, "Zip"),
      city: readTag(block, "City"),
      country: readTag(block, "Country") ?? country,
    });
  }

  return points;
};

export const searchBpostPickupPoints = async (
  config: BpostLocatorConfig,
  destination: ShippingDestination,
): Promise<ShippingPickupPoint[]> => {
  const country = destination.country.toUpperCase();
  const params = new URLSearchParams({
    Function: "search",
    Partner: config.partner,
    AppId: config.appId,
    Country: country,
    Zone: destination.postalCode ?? "",
    Street: destination.line1 ?? "",
    Language: "en",
    Type: String(BPOST_LOCATOR_POINT_TYPES),
    Limit: String(BPOST_LOCATOR_LIMIT),
  });

  const response = await fetch(`${BPOST_LOCATOR_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(BPOST_LOCATOR_TIMEOUT_MS),
    headers: { Accept: "application/xml" },
    cache: "no-store",
  });

  const xml = await response.text();

  if (!response.ok) {
    console.error(
      `bpost locator failed with ${response.status} for ${country}`,
    );

    return [];
  }

  const error = readTag(xml, "txt");

  if (error) {
    console.error(`bpost locator refused ${country}: ${error}`);

    return [];
  }

  return parsePoints(xml, country);
};
