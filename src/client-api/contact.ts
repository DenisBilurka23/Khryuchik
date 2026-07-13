import { POST } from "@/client-api";
import type { ContactErrorCode, ContactMessageInput } from "@/types/contact";

type ErrorResponse = {
  error?: ContactErrorCode;
};

export const sendContactMessageClient = async (input: ContactMessageInput) =>
  POST<ErrorResponse>("/api/contact", input);
