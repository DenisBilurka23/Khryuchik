export const splitName = (value: string | null | undefined) => {
  const normalizedName = value?.trim() ?? "";

  if (!normalizedName) {
    return { firstName: "", lastName: "" };
  }

  const [firstName = "", ...lastNameParts] = normalizedName.split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};