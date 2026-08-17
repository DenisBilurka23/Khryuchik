export const formatPersonName = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
) =>
  [firstName, lastName]
    .map((part) => part?.trim() ?? "")
    .filter(Boolean)
    .join(" ");
