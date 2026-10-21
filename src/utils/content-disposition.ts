export const buildAttachmentDisposition = (fileName: string) => {
  const fallbackName = fileName.replace(/[^\x20-\x7E]|["\\]/g, "_");
  const encodedName = encodeURIComponent(fileName).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

  return `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`;
};
