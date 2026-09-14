import { POST } from "@/client-api";

export type RegisterEntertainmentViewResponse = {
  ok?: boolean;
};

export const registerEntertainmentView = async (slug: string) =>
  POST<RegisterEntertainmentViewResponse>(
    `/api/entertainment/${encodeURIComponent(slug)}/view`,
    undefined,
  );
