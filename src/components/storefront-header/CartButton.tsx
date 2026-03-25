"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Badge, Button } from "@mui/material";

import type { CartButtonProps } from "./types";
import { useCart } from "../cart/store";

export const CartButton = ({ href, label, className }: CartButtonProps) => {
  const { totalCount } = useCart();

  return (
    <Button
      variant="contained"
      href={href}
      startIcon={
        <Badge badgeContent={totalCount} color="primary">
          <ShoppingBagOutlinedIcon />
        </Badge>
      }
      className={className}
    >
      {label}
    </Button>
  );
};