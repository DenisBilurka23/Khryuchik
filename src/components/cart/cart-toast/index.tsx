"use client";

import { Alert, Snackbar } from "@mui/material";
import { useTranslations } from "next-intl";

import { MAX_CART_ITEM_QUANTITY } from "@/constants/cart";
import { hideCartToast, useCartToast } from "@/stores/cart-toast";

export const CartToast = () => {
  const t = useTranslations("storefront.cartToast");
  const { open, addedCount, isCapped } = useCartToast();

  return (
    <Snackbar
      key={addedCount}
      open={open}
      autoHideDuration={3000}
      onClose={hideCartToast}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={hideCartToast}
        severity={isCapped ? "warning" : "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {isCapped
          ? t("maxQuantityReached", { count: MAX_CART_ITEM_QUANTITY })
          : t("addedToCart")}
      </Alert>
    </Snackbar>
  );
};
