"use client";

import { Button } from "@mui/material";

import type { AddToCartButtonProps } from "./types";
import { useCart } from "../cart/store";

export const AddToCartButton = ({
  productId,
  label,
  className,
}: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId,
    });
  };

  return (
    <Button
      fullWidth
      variant="contained"
      className={className}
      onClick={handleAddToCart}
    >
      {label}
    </Button>
  );
};