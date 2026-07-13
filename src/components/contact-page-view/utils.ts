export const getInstagramHandle = (url: string): string => {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const segment = path.split("/").filter(Boolean).pop();

    return segment ? `@${segment}` : url;
  } catch {
    return url;
  }
};
