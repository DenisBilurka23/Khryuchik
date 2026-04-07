"use client";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { IconButton } from "@mui/material";

import { useWishlist } from "@/hooks/useWishlist";

type WishlistButtonProps = {
  productId: string;
  label: string;
  className?: string;
};

export const WishlistButton = ({ productId, label, className }: WishlistButtonProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isActive = isInWishlist(productId);

  return (
    <IconButton
      aria-label={label}
      className={className}
      color={isActive ? "primary" : "default"}
      onClick={() => {
        void toggleWishlist(productId);
      }}
    >
      {isActive ? <FavoriteOutlinedIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
    </IconButton>
  );
};