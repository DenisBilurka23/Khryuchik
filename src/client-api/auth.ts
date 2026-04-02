import type { Locale } from "@/i18n/config";

type ErrorResponse = {
  error?: string;
};

const postJson = async <TResponse>(url: string, body: object) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as TResponse | null;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

export const requestPasswordResetClient = async (
  email: string,
  locale: Locale,
) =>
  postJson<ErrorResponse>(
    "/api/auth/password-reset/request",
    {
      email,
      locale,
      origin: window.location.origin,
    },
  );

export const registerUserClient = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => postJson<ErrorResponse>("/api/auth/register", payload);

export const confirmPasswordResetClient = async (
  token: string,
  password: string,
) =>
  postJson<ErrorResponse>(
    "/api/auth/password-reset/confirm",
    { token, password },
  );