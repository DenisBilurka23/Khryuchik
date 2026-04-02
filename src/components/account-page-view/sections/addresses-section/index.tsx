import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import { SectionCard } from "../../shared";

import type { AddressesSectionProps } from "./types";

export const AddressesSection = ({ dictionary, addresses }: AddressesSectionProps) => {
  return (
    <SectionCard
      title={dictionary.shippingAddresses}
      action={<Button variant="contained">{dictionary.addAddress}</Button>}
    >
      <Grid container spacing={2}>
        {addresses.map((address) => (
          <Grid key={address.title} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "22px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
                height: "100%",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <LocationOnOutlinedIcon />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{address.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.8 }}>
                    {address.line1}
                    <br />
                    {address.line2}
                    <br />
                    {address.line3}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </SectionCard>
  );
};

export type { AddressesSectionProps } from "./types";