"use client";

import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminJetprintFilesField } from "../files-field";
import { useJetprintFileUploads } from "../hooks/useJetprintFileUploads";
import { useJetprintPrintDesign } from "../hooks/useJetprintPrintDesign";
import { AdminJetprintPrintEditor } from "../print-editor";
import { AdminJetprintVariantsField } from "../variants-field";
import type { AdminJetprintSectionFieldsProps } from "./types";

export const AdminJetprintSectionFields = ({
  locale,
  productId,
  link,
  sizes,
  colors,
}: AdminJetprintSectionFieldsProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { hiddenInputRef: printInputRef, ...printUploads } =
    useJetprintFileUploads({
      locale,
      productId,
      existingFiles: link?.printFiles ?? [],
    });
  const {
    design,
    setDesign,
    hiddenInputRef: designInputRef,
    value: designValue,
  } = useJetprintPrintDesign({
    locale,
    productId,
    initialDesign: link?.printDesign,
  });
  const { replaceFiles: replacePrintFiles } = printUploads;

  return (
    <>
      <AdminJetprintVariantsField
        name="jetprint.variantsJson"
        initialVariants={link?.variants ?? []}
        sizes={sizes}
        colors={colors}
      />

      <input
        ref={designInputRef}
        type="hidden"
        name="jetprint.printDesignJson"
        defaultValue={designValue}
      />

      <AdminJetprintFilesField
        name="jetprint.printFilesJson"
        title={tJetprint("printFilesTitle")}
        helperText={tJetprint("printFilesHelper")}
        inputRef={printInputRef}
        uploads={printUploads}
        actions={
          <Button variant="contained" onClick={() => setIsEditorOpen(true)}>
            {design ? tJetprint("editor.edit") : tJetprint("editor.open")}
          </Button>
        }
      />

      <Typography variant="body2" color="text.secondary">
        {tJetprint("previewNote")}
      </Typography>

      {isEditorOpen ? (
        <AdminJetprintPrintEditor
          initialDesign={design}
          onCloseAction={() => setIsEditorOpen(false)}
          onApplyAction={(nextDesign, printFile) => {
            setDesign(nextDesign);
            replacePrintFiles([printFile]);
            setIsEditorOpen(false);
          }}
        />
      ) : null}
    </>
  );
};

export type { AdminJetprintSectionFieldsProps } from "./types";
