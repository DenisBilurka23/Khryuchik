"use client";

import { Button } from "@mui/material";

import { useCart } from "@/components/cart/store";

import type { AddToCartButtonProps } from "./types";

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