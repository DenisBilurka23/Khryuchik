type ErrorResponse = {
  error?: string;
};

type UpdateAccountProfileResponse = ErrorResponse & {
  ok?: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    authProviders: Array<"google" | "credentials">;
    image?: string | null;
  };
};

export const updateAccountProfileClient = async (payload: {
  name: string;
  email: string;
  phone: string;
}) => {
  const response = await fetch("/api/account/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as UpdateAccountProfileResponse | null;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};