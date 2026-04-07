import { POST } from "@/client-api";
import type { CountryCode } from "@/utils";

type UpdateCountryResponse = {
  ok: boolean;
  country: CountryCode;
};

export const updateCountryPreferenceClient = async (country: CountryCode) =>
  POST<UpdateCountryResponse>("/api/preferences/country", { country });