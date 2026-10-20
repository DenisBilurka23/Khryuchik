import { Alert, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { artCoversBox, getEffectiveDpi, getPrintDpiQuality } from "@/utils";

import type { AdminPrintEditorQualityStatusProps } from "./types";

export const AdminPrintEditorQualityStatus = ({
  template,
  art,
  layout,
}: AdminPrintEditorQualityStatusProps) => {
  const tEditor = useTranslations("adminPage.productForm.jetprint.editor");
  const effectiveDpi = getEffectiveDpi(template.dpi, layout.scale);
  const dpiQuality = getPrintDpiQuality(effectiveDpi);

  return (
    <>
      {!artCoversBox(layout, art, template.bleedBox) ? (
        <Alert severity="warning">{tEditor("notCovered")}</Alert>
      ) : null}

      {dpiQuality === "good" ? (
        <Typography variant="body2" color="success.main">
          {tEditor("dpiGood", { dpi: effectiveDpi })}
        </Typography>
      ) : null}

      {dpiQuality === "normal" ? (
        <Alert severity="info">
          {tEditor("dpiNormal", { dpi: effectiveDpi })}
        </Alert>
      ) : null}

      {dpiQuality === "bad" ? (
        <Alert severity="error">
          {tEditor("dpiBad", { dpi: effectiveDpi })}
        </Alert>
      ) : null}
    </>
  );
};

export type { AdminPrintEditorQualityStatusProps } from "./types";
