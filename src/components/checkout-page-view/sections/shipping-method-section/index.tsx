import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { SHIPPING_FRACTION_DIGITS } from "@/constants/shipping";
import { formatCurrency } from "@/utils";

import { CheckoutSectionCard } from "../../section-card";
import {
  resolveSelectedOptionId,
  shippingGroupLabel,
  shippingOptionLabel,
} from "../../utils";
import type { ShippingMethodSectionProps } from "./types";

export const CheckoutShippingMethodSection = ({
  groups,
  isLoading,
  errorMessage,
  selectedOptionIds,
  onOptionChange,
  currency,
  locale,
  labels,
}: ShippingMethodSectionProps) => {
  const shippableGroups = groups.filter((group) => group.options.length > 0);

  if (!isLoading && !errorMessage && shippableGroups.length === 0) {
    return null;
  }

  return (
    <CheckoutSectionCard title={labels.shippingMethod.title}>
      {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}

      {isLoading && !errorMessage ? (
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {labels.shippingMethod.calculating}
          </Typography>
          <Skeleton variant="rounded" height={56} />
        </Stack>
      ) : null}

      {!isLoading && !errorMessage ? (
        <Stack spacing={2.5}>
          {shippableGroups.length > 1 ? (
            <Typography variant="body2" color="text.secondary">
              {labels.shippingMethod.multipleParcels}
            </Typography>
          ) : null}

          {shippableGroups.map((group) => (
            <Stack key={group.id} spacing={1}>
              {shippableGroups.length > 1 ? (
                <Typography sx={{ fontWeight: 700 }}>
                  {shippingGroupLabel(group, labels)}
                </Typography>
              ) : null}

              {group.options.length === 1 ? (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    border: "1px solid #F0DFC8",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography>
                    {shippingOptionLabel(group.options[0], labels)}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(
                      group.options[0].amount,
                      locale,
                      currency,
                      SHIPPING_FRACTION_DIGITS,
                    )}
                  </Typography>
                </Stack>
              ) : (
                <FormControl fullWidth>
                  <RadioGroup
                    value={resolveSelectedOptionId(group, selectedOptionIds)}
                    onChange={(event) =>
                      onOptionChange(group.id, event.target.value)
                    }
                  >
                    <Stack spacing={1}>
                      {group.options.map((option) => {
                        const isSelected =
                          resolveSelectedOptionId(group, selectedOptionIds) ===
                          option.id;

                        return (
                          <Box
                            key={option.id}
                            sx={{
                              border: "1px solid",
                              borderColor: isSelected
                                ? "primary.main"
                                : "#F0DFC8",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              transition: "border-color .2s ease",
                            }}
                          >
                            <FormControlLabel
                              value={option.id}
                              control={<Radio />}
                              sx={{
                                m: 0,
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                              labelPlacement="start"
                              label={
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="baseline"
                                >
                                  <Typography>
                                    {shippingOptionLabel(option, labels)}
                                  </Typography>
                                  <Typography sx={{ fontWeight: 700 }}>
                                    {formatCurrency(
                                      option.amount,
                                      locale,
                                      currency,
                                      SHIPPING_FRACTION_DIGITS,
                                    )}
                                  </Typography>
                                </Stack>
                              }
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
            </Stack>
          ))}
        </Stack>
      ) : null}
    </CheckoutSectionCard>
  );
};

export type { ShippingMethodSectionProps } from "./types";
