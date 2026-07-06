import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { StorefrontFooterSection } from "@/i18n/types";
import type { CountryCode } from "@/utils";
import { getFooterItemHref } from "@/utils/footer";

import styles from "./footer-section.module.css";

export const FooterSection = async ({
  locale,
  country,
}: {
  locale: Locale;
  country: CountryCode;
}) => {
  const [tStorefront, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: "storefront" }),
    getTranslations({ locale, namespace: "storefront.footer" }),
  ]);
  const sections = tFooter.raw("sections") as StorefrontFooterSection[];

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box className={styles.brandMark}>🐷</Box>
              <Typography className={styles.brandTitle}>
                {tStorefront("brand.shortLabel")}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, lineHeight: 1.7 }}
            >
              {tFooter("description")}
            </Typography>
          </Grid>

          {sections.map((section) => (
            <Grid key={section.title} size={{ xs: 12, md: 3 }}>
              <Typography sx={{ fontWeight: 700 }}>{section.title}</Typography>
              <Stack spacing={1.5} sx={{ mt: 2, color: "text.secondary" }}>
                {section.items.map((item) => {
                  const href = getFooterItemHref(item.key, locale, country);

                  return (
                    <Link
                      key={item.key}
                      href={href}
                      className={styles.footerLink}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <Typography component="span">{item.label}</Typography>
                    </Link>
                  );
                })}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
