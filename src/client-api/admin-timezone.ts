import { POST } from "@/client-api";

type UpdateAdminTimeZoneResponse = {
  ok: boolean;
  timeZone: string;
};

export const updateAdminTimeZonePreferenceClient = async (timeZone: string) =>
  POST<UpdateAdminTimeZoneResponse>("/api/preferences/admin-timezone", {
    timeZone,
  });
