import { DEFAULT_BOOK_SHIPPING } from "@/constants/shipping";
import {
  buildQuoteShipmentPayload,
  chitchatsRequest,
  getChitChatsConfig,
  toShippingOption,
  unwrapShipment,
} from "@/server/shipping/providers/chitchats.client";
import { buildParcel } from "@/server/shipping/packing";
import type { CountryCode, CurrencyCode } from "@/utils";

const readArg = (name: string) =>
  process.argv
    .find((arg) => arg.startsWith(`--${name}=`))
    ?.slice(name.length + 3);

const config = getChitChatsConfig();

if (!config) {
  throw new Error("CHITCHATS_ACCESS_TOKEN or CHITCHATS_CLIENT_ID is not set");
}

const country = (readArg("country") ?? "CA").toUpperCase() as CountryCode;
const books = Number(readArg("books") ?? 1);
const valueCurrency = (readArg("currency") ?? "CAD") as CurrencyCode;
const valueAmount = Number(readArg("value") ?? 25 * books);

const parcel = buildParcel({
  units: books,
  contentWeightGrams: DEFAULT_BOOK_SHIPPING.weightGrams * books,
  value: { amount: valueAmount, currency: valueCurrency },
  contents: [
    {
      quantity: books,
      valueAmount,
      originCountry: DEFAULT_BOOK_SHIPPING.originCountry,
      hsCode: DEFAULT_BOOK_SHIPPING.hsCode,
    },
  ],
});

const destination = {
  country,
  region: readArg("region"),
  city: readArg("city"),
  postalCode: readArg("postal"),
  line1: readArg("line1") ?? "1 Main Street",
};

const run = async () => {
  const payload = buildQuoteShipmentPayload({
    parcel,
    destination,
    declaredValue: {
      currency: valueCurrency.toLowerCase() as "cad" | "usd",
      rate: 1,
    },
  });

  console.log("request", JSON.stringify(payload, null, 2));

  const response = await chitchatsRequest(config, "/shipments", {
    method: "POST",
    body: payload,
  });

  console.log("\nraw response", JSON.stringify(response, null, 2));

  const shipment = unwrapShipment(response);

  if (!shipment) {
    throw new Error("Could not read a shipment out of the response");
  }

  const rates = shipment.rates ?? [];

  console.log(
    `\nshipment ${shipment.id} (${shipment.status}) — ${rates.length} rates`,
  );

  for (const rate of rates) {
    const option = toShippingOption(rate, shipment.id);

    console.log(
      option
        ? `  ${option.amount} ${option.currency}  tracking=${option.hasTracking}  ${option.service}  ${option.transitDays ?? ""}`
        : `  (unusable) ${rate.postage_type} payment_amount=${rate.payment_amount}`,
    );
  }

  if (process.argv.includes("--keep")) {
    console.log(`\nkept shipment ${shipment.id}`);
    return;
  }

  await chitchatsRequest(config, `/shipments/${shipment.id}`, {
    method: "DELETE",
  });

  console.log(`\ndeleted shipment ${shipment.id}`);
};

run();
