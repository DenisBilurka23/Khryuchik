"use client";

import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { updateCountryPreferenceClient } from "@/client-api/country";
import { countries, type CountryCode } from "@/utils";
import { setClientCountry } from "@/utils/country/client";
import type { RegionToggleProps } from "./types";

export const RegionToggle = ({
  country,
  accent,
  toggleAriaLabel,
  options,
}: RegionToggleProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState(country);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelected(country);
  }, [country]);

  const updateCountry = async (nextCountry: CountryCode) => {
    if (nextCountry === selected || isPending) {
      return;
    }

    const previousCountry = selected;
    setSelected(nextCountry);

    try {
      const response = await updateCountryPreferenceClient(nextCountry);

      if (!response.ok) {
        console.error(`Failed to update country: ${response.status}`);
        setClientCountry(previousCountry);
        setSelected(previousCountry);
        return;
      }

      setClientCountry(nextCountry);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      setClientCountry(previousCountry);
      setSelected(previousCountry);
    }
  };

  return (
    <Box
      role="tablist"
      aria-label={toggleAriaLabel}
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1.5,
        p: 1,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {countries.map((code) => {
        const option = options[code];
        const isActive = selected === code;

        return (
          <ButtonBase
            key={code}
            role="tab"
            aria-selected={isActive}
            disabled={isPending}
            onClick={() => void updateCountry(code)}
            sx={{
              justifyContent: "flex-start",
              gap: 1.5,
              p: 1.75,
              borderRadius: 2,
              textAlign: "left",
              transition: "background .2s ease, box-shadow .2s ease",
              backgroundColor: isActive ? "#fff" : "transparent",
              boxShadow: isActive ? "0 2px 12px rgba(42,37,34,0.08)" : "none",
              "&:hover": {
                backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.6)",
              },
            }}
          >
            <Box component="span" sx={{ fontSize: 26, lineHeight: 1 }}>
              {option.flag}
            </Box>
            <Stack spacing={0.25}>
              <Typography
                component="span"
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isActive ? "text.primary" : "text.secondary",
                }}
              >
                {option.country}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: 12,
                  color: isActive ? accent : "text.secondary",
                }}
              >
                {option.subtitle}
              </Typography>
            </Stack>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export type { RegionToggleProps } from "./types";
