// Every admin action can fail on auth or on an unexpected error; anything more
// specific an action reports is added through the type parameter.
export type AdminActionResult<TError extends string = never> =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "failed" | TError };
