import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import type { PaymentMethod } from "@/utils";

import { CheckoutSectionCard } from "../../section-card";
import type { PaymentSectionProps } from "./types";

export const CheckoutPaymentSection = ({
  availableMethods,
  selectedMethod,
  onMethodChange,
  labels,
}: PaymentSectionProps) => (
  <CheckoutSectionCard title={labels.paymentTitle}>
    <FormControl fullWidth>
      <RadioGroup
        value={selectedMethod}
        onChange={(event) =>
          onMethodChange(event.target.value as PaymentMethod)
        }
      >
        <Stack spacing={1.5}>
          {availableMethods.map((method) => {
            const methodLabel = labels.paymentMethods[method];

            return (
              <Box
                key={method}
                sx={{
                  border: "1px solid",
                  borderColor:
                    selectedMethod === method ? "primary.main" : "#F0DFC8",
                  borderRadius: 2,
                  p: 2,
                  transition: "border-color .2s ease",
                }}
              >
                <FormControlLabel
                  value={method}
                  control={<Radio />}
                  sx={{ alignItems: "flex-start", m: 0 }}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {methodLabel.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {methodLabel.description}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  </CheckoutSectionCard>
);

export type { PaymentSectionProps } from "./types";
