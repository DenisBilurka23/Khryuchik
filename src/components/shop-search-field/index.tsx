"use client";

import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef } from "react";

import type { ShopSearchFieldProps } from "./types";

export const ShopSearchField = ({
  initialValue,
  placeholder,
}: ShopSearchFieldProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inputRef.current || inputRef.current.value === currentQuery) {
      return;
    }

    inputRef.current.value = currentQuery;
  }, [currentQuery]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  const handleChange = (nextValue: string) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedValue = nextValue.trim();

      if (trimmedValue) {
        params.set("q", nextValue);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    }, 350);
  };

  return (
    <TextField
      defaultValue={initialValue}
      onChange={(event) => handleChange(event.target.value)}
      placeholder={placeholder}
      inputRef={inputRef}
      sx={{
        minWidth: { xs: "100%", md: 320 },
        bgcolor: "#fff",
        borderRadius: "999px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "999px",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "999px",
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export type { ShopSearchFieldProps } from "./types";