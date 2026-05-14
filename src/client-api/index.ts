export type ClientApiResponse<TResponse> = {
  ok: boolean;
  status: number;
  data: TResponse | null;
};

type RequestOptions = Omit<RequestInit, "method" | "body">;

const serializeRequestBody = (body?: unknown) => {
  if (body === undefined) {
    return {
      serializedBody: undefined,
      shouldSetJsonContentType: false,
    };
  }

  if (body instanceof FormData) {
    return {
      serializedBody: body,
      shouldSetJsonContentType: false,
    };
  }

  return {
    serializedBody: JSON.stringify(body),
    shouldSetJsonContentType: true,
  };
};

const request = async <TResponse>(
  method: string,
  url: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ClientApiResponse<TResponse>> => {
  const headers = new Headers(options?.headers);
  const { serializedBody, shouldSetJsonContentType } = serializeRequestBody(body);

  if (shouldSetJsonContentType && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    body: serializedBody,
  });

  const data = (await response.json().catch(() => null)) as TResponse | null;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

export const GET = async <TResponse>(url: string, options?: RequestOptions) =>
  request<TResponse>("GET", url, undefined, options);

export const POST = async <TResponse>(
  url: string,
  body: unknown,
  options?: RequestOptions,
) => request<TResponse>("POST", url, body, options);

export const PATCH = async <TResponse>(
  url: string,
  body: unknown,
  options?: RequestOptions,
) => request<TResponse>("PATCH", url, body, options);

export const DELETE = async <TResponse>(
  url: string,
  options?: RequestOptions,
) => request<TResponse>("DELETE", url, undefined, options);