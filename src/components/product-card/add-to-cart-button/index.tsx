"use client";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Button, IconButton } from "@mui/material";

import { showCartToast } from "@/components/cart/cart-toast-store";
import { useCart } from "@/components/cart/store";

import type { AddToCartButtonProps } from "./types";

export const AddToCartButton = ({
  productId,
  label,
  className,
  iconOnly = false,
}: AddToCartButtonProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId,
    });
    showCartToast();
  };

  if (iconOnly) {
    return (
      <IconButton
        aria-label={label}
        title={label}
        className={className}
        onClick={handleAddToCart}
      >
        <ShoppingBagOutlinedIcon fontSize="small" />
      </IconButton>
    );
  }

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
