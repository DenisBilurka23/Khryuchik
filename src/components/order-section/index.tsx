import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import orderImage from "@/assets/MainBottomTransparent.png";
import { SectionEyebrow } from "@/components/section-eyebrow";
import type { StorefrontDictionary } from "@/i18n/types";

import { OrderSteps } from "./order-steps";
import styles from "./order-section.module.css";
import type { OrderSectionProps } from "./types";

export const OrderSection = async ({
  locale,
  shopHref,
  cartHref,
}: OrderSectionProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.orderSection",
  });
  const steps = t.raw("steps") as StorefrontDictionary["orderSection"]["steps"];

  return (
    <Box component="section" id="order" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box className={styles.layout}>
            <Box>
              <SectionEyebrow label={t("eyebrow")} />

              <Typography variant="h2" className={styles.title}>
                {t("title")}
              </Typography>

              <OrderSteps steps={steps} />
            </Box>

            <Image
              src={orderImage}
              alt=""
              sizes="(max-width: 1200px) 40vw, 260px"
              className={styles.illustration}
            />
          </Box>

          <Box className={styles.actions}>
            <Link href={shopHref}>
              <Button
                component="span"
                variant="contained"
                className={styles.action}
              >
                {t("shopAction")}
              </Button>
            </Link>

            <Link href={cartHref}>
              <Button
                component="span"
                variant="outlined"
                className={`${styles.action} ${styles.cartButton}`}
              >
                {t("cartAction")}
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
