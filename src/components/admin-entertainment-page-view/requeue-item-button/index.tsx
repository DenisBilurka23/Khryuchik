"use client";

import { useFormStatus } from "react-dom";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import type { RequeueEntertainmentItemButtonProps } from "./types";

const RequeueSubmitButton = ({
  label,
  size,
}: {
  label: string;
  size: "small" | "medium" | "large";
}) => {
  const { pending } = useFormStatus();

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          type="submit"
          aria-label={label}
          color="primary"
          size={size}
          disabled={pending}
        >
          {pending ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <RefreshOutlinedIcon />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export const RequeueEntertainmentItemButton = ({
  slug,
  action,
  size = "medium",
}: RequeueEntertainmentItemButtonProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");

  return (
    <form action={action}>
      <input type="hidden" name="slug" value={slug} />
      <RequeueSubmitButton label={tForm("requeueButton")} size={size} />
    </form>
  );
};

export type { RequeueEntertainmentItemButtonProps } from "./types";
