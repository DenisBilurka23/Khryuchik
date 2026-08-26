import {
  DEFAULT_BOOK_SHIPPING,
  DEFAULT_SHIPPING_ORIGIN_COUNTRY,
} from "@/constants/shipping";
import { buildParcel } from "@/server/shipping/packing";
import {
  buildRatesPayload,
  easyshipRequest,
  getEasyshipConfig,
  toShippingOption,
  unwrapRates,
} from "@/server/shipping/providers/easyship.client";
import type { EasyshipRatesResponse } from "@/server/shipping/providers/easyship.types";
import type { CountryCode, CurrencyCode } from "@/utils";

const readArg = (name: string) =>
  process.argv
    .find((arg) => arg.startsWith(`--${name}=`))
    ?.slice(name.length + 3);

const config = getEasyshipConfig();

if (!config) {
  throw new Error(
    "EASYSHIP_API_TOKEN or the EASYSHIP_ORIGIN_* address is not set",
  );
}

const country = (readArg("country") ?? "DE").toUpperCase() as CountryCode;
const city = readArg("city") ?? "Berlin";
const postalCode = readArg("postal") ?? "10117";
const line1 = readArg("line1") ?? "Unter den Linden 1";
const books = Number(readArg("books") ?? 1);
const valueCurrency = (readArg("currency") ?? "EUR") as CurrencyCode;
const valueAmount = Number(readArg("value") ?? 25 * books);

const parcel = buildParcel({
  units: books,
  contentWeightGrams: DEFAULT_BOOK_SHIPPING.weightGrams * books,
  value: { amount: valueAmount, currency: valueCurrency },
  contents: [
    {
      quantity: books,
      valueAmount,
      originCountry: DEFAULT_SHIPPING_ORIGIN_COUNTRY,
      hsCode: DEFAULT_BOOK_SHIPPING.hsCode,
    },
  ],
});

const destination = { country, city, postalCode, line1 };

const run = async () => {
  console.log(
    `token ${config.token.slice(0, 6)}… · origin ${config.origin.city} ${config.origin.country}`,
  );
  console.log(
    `${books} book(s), ${parcel.weightGrams} g → ${country} ${postalCode} ${city}\n`,
  );

  const response = await easyshipRequest<EasyshipRatesResponse>(
    config,
    "/rates",
    buildRatesPayload(config, parcel, destination),
  );

  const rates = unwrapRates(response);

  if (rates.length === 0) {
    console.log("no rates returned");
    return;
  }

  for (const rate of rates) {
    const option = toShippingOption(rate);

    if (!option) {
      console.log(`skipped ${JSON.stringify(rate).slice(0, 120)}`);
      continue;
    }

    console.log(
      `${String(option.amount).padStart(8)} ${option.currency}  ` +
        `${option.transitDays ?? "?"} d  ${option.service}`,
    );
  }
};

run();
