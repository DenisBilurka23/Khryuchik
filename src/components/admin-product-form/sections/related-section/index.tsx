import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Button, TextField } from "@mui/material";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductRelatedSectionProps } from "./types";

export const AdminProductRelatedSection = ({
  dictionary,
  submitLabel,
  payload,
}: AdminProductRelatedSectionProps) => {
  return (
    <AdminSectionCard
      title={dictionary.relatedSectionTitle}
      description={dictionary.relatedSectionDescription}
      action={
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SaveOutlinedIcon />}
        >
          {submitLabel}
        </Button>
      }
    >
      <TextField
        label={dictionary.fields.relatedProductIds}
        name="relatedProductIds"
        defaultValue={payload.details.relatedProductIds.join(", ")}
        helperText={dictionary.helpers.relatedProductIds}
        fullWidth
      />
    </AdminSectionCard>
  );
};

export type { AdminProductRelatedSectionProps } from "./types";