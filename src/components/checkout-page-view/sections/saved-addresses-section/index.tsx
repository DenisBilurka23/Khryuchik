import {
  Box,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import {
  getUserShippingAddressLines,
  getUserShippingAddressTitle,
} from "@/utils/account-page";

import { CheckoutSectionCard } from "../../section-card";
import type { SavedAddressesSectionProps } from "./types";

const selectedBorder = (isSelected: boolean) =>
  isSelected ? "1px solid #D9876C" : "1px solid #F0DFC8";

export const CheckoutSavedAddressesSection = ({
  addresses,
  selectedAddressId,
  onSelect,
  locale,
  labels,
}: SavedAddressesSectionProps) => (
  <CheckoutSectionCard title={labels.savedAddressesTitle}>
    <RadioGroup
      value={selectedAddressId}
      onChange={(event) => onSelect(event.target.value)}
    >
      <Stack spacing={1.5}>
        {addresses.map((address) => {
          const lines = getUserShippingAddressLines(address, locale);

          return (
            <Paper
              key={address.id}
              elevation={0}
              sx={{
                borderRadius: "18px",
                border: selectedBorder(selectedAddressId === address.id),
                bgcolor: "#fff",
                transition: "border-color 0.2s ease",
              }}
            >
              <FormControlLabel
                value={address.id}
                control={<Radio />}
                sx={{ alignItems: "flex-start", m: 0, p: 2, width: "100%" }}
                label={
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ ml: 0.5 }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ mt: 0.25, color: "text.secondary" }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {getUserShippingAddressTitle(address)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.25, lineHeight: 1.7 }}
                      >
                        {lines.join(", ")}
                      </Typography>
                    </Box>
                  </Stack>
                }
              />
            </Paper>
          );
        })}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "18px",
            border: selectedBorder(selectedAddressId === ""),
            bgcolor: "#fff",
            transition: "border-color 0.2s ease",
          }}
        >
          <FormControlLabel
            value=""
            control={<Radio />}
            sx={{ alignItems: "center", m: 0, p: 2, width: "100%" }}
            label={
              <Typography sx={{ ml: 0.5 }}>{labels.newAddressOption}</Typography>
            }
          />
        </Paper>
      </Stack>
    </RadioGroup>
  </CheckoutSectionCard>
);

export type { SavedAddressesSectionProps } from "./types";
