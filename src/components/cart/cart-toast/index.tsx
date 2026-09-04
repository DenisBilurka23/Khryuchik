"use client";

import { Alert, Snackbar } from "@mui/material";
import { useTranslations } from "next-intl";

import { hideCartToast, useCartToast } from "../cart-toast-store";

import styles from "./cart-toast.module.css";

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
        className={styles.alert}
      >
        {t("addedToCart")}
      </Alert>
    </Snackbar>
  );
};
