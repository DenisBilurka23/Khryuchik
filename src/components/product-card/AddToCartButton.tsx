"use client";

import { Button } from "@mui/material";

import type { AddToCartButtonProps } from "./types";
import { useCart } from "../cart/store";

export const AddToCartButton = ({
  slug,
  title,
  price,
  emoji,
  bgColor,
  label,
  className,
}: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      slug,
      title,
      price,
      emoji,
      bgColor: bgColor ?? "#FFF8F0",
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