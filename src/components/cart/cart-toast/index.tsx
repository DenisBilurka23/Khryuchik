"use client";

import { Alert, Snackbar } from "@mui/material";
import { useTranslations } from "next-intl";

import { hideCartToast, useCartToast } from "../cart-toast-store";

export const CartToast = () => {
  const t = useTranslations("storefront.cartToast");
  const { open, addedCount } = useCartToast();

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
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {t("addedToCart")}
      </Alert>
    </Snackbar>
  );
};
