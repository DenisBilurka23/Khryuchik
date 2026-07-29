"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/utils";

import { AdminSectionCard, AdminStatusChip } from "../../../admin-page-shared";
import type {
  AdminPrintifyAction,
  AdminProductPrintifySectionProps,
} from "./types";

export const AdminProductPrintifySection = ({
  productId,
  locale,
  link,
  syncAction,
  relinkAction,
}: AdminProductPrintifySectionProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const tShared = useTranslations("adminPage.shared");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const run = (action: AdminPrintifyAction | undefined, successKey: string) => {
    if (!action) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await action(productId);

      setFeedback(
        result.ok
          ? { severity: "success", message: tForm(successKey) }
          : {
              severity: "error",
              message: `${tForm("printifyActionFailed")}: ${result.error}`,
            },
      );
    });
  };

  const formatSelections = (selections: { size?: string; color?: string }) =>
    [selections.size, selections.color].filter(Boolean).join(" / ") ||
    tShared("placeholders.emptyValue");

  const getVariantStatus = (variant: {
    isEnabled: boolean;
    isAvailable: boolean;
  }) => {
    if (!variant.isEnabled) {
      return {
        label: tForm("printifyVariantDisabled"),
        tone: "neutral" as const,
      };
    }

    if (!variant.isAvailable) {
      return {
        label: tShared("status.availability.out_of_stock"),
        tone: "warning" as const,
      };
    }

    return { label: tShared("status.active"), tone: "success" as const };
  };

  return (
    <AdminSectionCard
      title={tForm("printifySectionTitle")}
      description={tForm("printifySectionDescription")}
    >
      <Stack gap={2}>
        {feedback ? (
          <Alert severity={feedback.severity}>{feedback.message}</Alert>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={1.5}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Stack gap={0.5}>
            <Typography variant="body2" color="text.secondary">
              {tForm("printifyProductIdLabel")}: {link.printifyProductId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tForm("printifySyncedAtLabel")}:{" "}
              {new Date(link.syncedAt).toLocaleString(
                locale === "ru" ? "ru-RU" : "en-US",
              )}
            </Typography>
          </Stack>

          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              size="small"
              disabled={isPending || !syncAction}
              onClick={() => run(syncAction, "printifySynced")}
            >
              {tForm("printifySyncButton")}
            </Button>
            <Button
              variant="text"
              size="small"
              disabled={isPending || !relinkAction}
              onClick={() => run(relinkAction, "printifyRelinked")}
            >
              {tForm("printifyRelinkButton")}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{tForm("printifyColumns.variant")}</TableCell>
                <TableCell>{tForm("printifyColumns.selections")}</TableCell>
                <TableCell>{tForm("printifyColumns.sku")}</TableCell>
                <TableCell>{tForm("printifyColumns.cost")}</TableCell>
                <TableCell>{tForm("printifyColumns.retailPrice")}</TableCell>
                <TableCell>{tForm("printifyColumns.status")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {link.variants.map((variant) => (
                <TableRow key={variant.variantId} hover>
                  <TableCell>{variant.title}</TableCell>
                  <TableCell>{formatSelections(variant.selections)}</TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell>
                    {formatCurrency(variant.costCents / 100, locale, "USD", 2)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      variant.retailPriceCents / 100,
                      locale,
                      "USD",
                      2,
                    )}
                  </TableCell>
                  <TableCell>
                    <AdminStatusChip {...getVariantStatus(variant)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </AdminSectionCard>
  );
};

export type {
  AdminPrintifyAction,
  AdminPrintifyActionResult,
  AdminProductPrintifySectionProps,
} from "./types";
