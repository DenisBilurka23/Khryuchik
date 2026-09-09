"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { formatPickupPointAddress } from "@/utils";
import type { PickupPointSelectProps } from "./types";

export const PickupPointSelect = ({
  points,
  status,
  selectedPointId,
  onChange,
  errorMessage,
  labels,
}: PickupPointSelectProps) => {
  const copy = labels.shippingMethod.pickupPointSelect;

  if (status === "loading") {
    return (
      <Stack spacing={1} sx={{ pl: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {copy.loading}
        </Typography>
        <Skeleton variant="rounded" height={72} />
      </Stack>
    );
  }

  if (status === "empty") {
    return (
      <Typography variant="body2" color="error" sx={{ pl: 2 }}>
        {copy.empty}
      </Typography>
    );
  }

  if (status !== "ok") {
    return null;
  }

  return (
    <Stack spacing={1} sx={{ pl: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {copy.title}
      </Typography>

      <FormControl fullWidth error={Boolean(errorMessage)}>
        <RadioGroup
          value={selectedPointId ?? ""}
          onChange={(event) => {
            const point = points.find(
              (candidate) => candidate.id === event.target.value,
            );

            if (point) {
              onChange(point);
            }
          }}
        >
          <Stack spacing={0.5}>
            {points.map((point) => (
              <Box
                key={point.id}
                sx={{
                  border: "1px solid",
                  borderColor:
                    selectedPointId === point.id
                      ? "primary.main"
                      : "var(--color-border)",
                  borderRadius: "var(--radius-field)",
                  px: 2,
                  py: 0.5,
                  transition: "border-color .2s ease",
                }}
              >
                <FormControlLabel
                  value={point.id}
                  control={<Radio size="small" />}
                  sx={{ m: 0, width: "100%" }}
                  label={
                    <Stack sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {point.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatPickupPointAddress(point)}
                      </Typography>
                    </Stack>
                  }
                />
              </Box>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>

      {errorMessage ? (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      ) : null}
    </Stack>
  );
};

export type { PickupPointSelectProps } from "./types";
