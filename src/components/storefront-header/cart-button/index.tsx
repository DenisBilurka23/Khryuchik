"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Badge, Box, Button } from "@mui/material";
import Link from "next/link";

import { useCart } from "../../cart/store";

import type { CartButtonProps } from "./types";

export const CartButton = ({ href, label, className }: CartButtonProps) => {
  const { totalCount } = useCart();
  const icon = (
    <Badge badgeContent={totalCount} color="primary">
      <ShoppingBagOutlinedIcon fontSize="small" />
    </Badge>
  );

  return (
    <Button
      component={Link}
      href={href}
      variant="contained"
      startIcon={icon}
      className={className}
      aria-label={label}
      sx={{
        display: "inline-flex",
        flex: "0 0 auto",
        width: { xs: 40, md: 40, lg: "auto" },
        minWidth: { xs: 40, md: 40, lg: 0 },
        height: { xs: 40, md: 40 },
        px: { xs: 0, md: 0, lg: 2 },
        py: { xs: 0, md: 0, lg: 1.25 },
        borderRadius: { xs: "999px", md: "999px", lg: "999px" },
        justifyContent: "center",
        whiteSpace: "nowrap",
        "& .MuiButton-startIcon": {
          marginRight: { xs: 0, md: 0, lg: 2 },
          marginLeft: 0,
        },
      }}
    >
      <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
        {label}
      </Box>
    </Button>
  );
};

export type { CartButtonProps } from "./types";