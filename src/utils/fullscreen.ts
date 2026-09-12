type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
};

export const isDocumentFullscreen = () => {
  if (typeof document === "undefined") {
    return false;
  }

  const fullscreenDocument = document as FullscreenDocument;

  return Boolean(
    fullscreenDocument.fullscreenElement ??
    fullscreenDocument.webkitFullscreenElement,
  );
};
