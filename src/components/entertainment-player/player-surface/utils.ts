import { MediaRenditionMenu } from "media-chrome/menu";
import { addTranslation } from "media-chrome/utils/i18n";

import { mediaChromeLabelsByLocale } from "@/i18n/media-chrome-labels";
import type { HlsLevel } from "@/types/media-player";

const AUTO_SIZE_PATTERN = /\((\d+p)\)/;

let activeQualityLabel: string | null = null;

export const rememberQualityLevel = (level?: HlsLevel) => {
  activeQualityLabel = level ? `${Math.min(level.width, level.height)}p` : null;
};

const baseFormatMenuItemText = MediaRenditionMenu.formatMenuItemText;

MediaRenditionMenu.formatMenuItemText = function formatMenuItemText(
  ...args: Parameters<typeof baseFormatMenuItemText>
) {
  const [text, ...rest] = args;
  const corrected = activeQualityLabel
    ? text.replace(AUTO_SIZE_PATTERN, `(${activeQualityLabel})`)
    : text.replace(AUTO_SIZE_PATTERN, "").trimEnd();

  return baseFormatMenuItemText.call(this, corrected, ...rest);
};

for (const [locale, labels] of Object.entries(mediaChromeLabelsByLocale)) {
  if (labels) {
    addTranslation(locale, labels);
  }
}
