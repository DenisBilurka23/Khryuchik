"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Badge, Button } from "@mui/material";
import Link from "next/link";

import type { CartButtonProps } from "./types";
import { useCart } from "../cart/store";

export const CartButton = ({ href, label, className }: CartButtonProps) => {
  const { totalCount } = useCart();

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Button
        component="span"
        variant="contained"
        startIcon={
          <Badge badgeContent={totalCount} color="primary">
            <ShoppingBagOutlinedIcon />
          </Badge>
        }
        className={className}
      >
        {label}
      </Button>
    </Link>
  );
};