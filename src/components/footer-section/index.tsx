import { Box, Container, Grid, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Logo } from "@/components/logo";
import type { Locale } from "@/i18n/config";
import type { StorefrontFooterSection } from "@/i18n/types";
import type { CountryCode } from "@/utils";
import { getFooterItemHref } from "@/utils/footer";

import styles from "./footer-section.module.css";
import { FooterSocialLinks } from "./social-links";

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
  const sectionColumnWidth = (12 - 4) / sections.length;

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg" className={styles.inner}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Logo markSize={40} title={tStorefront("brand.shortLabel")} />
            <Typography className={styles.description}>
              {tFooter("description")}
            </Typography>
          </Grid>

          {sections.map((section) => (
            <Grid
              key={section.title}
              size={{ xs: 6, sm: 3, lg: sectionColumnWidth }}
            >
              <Typography component="p" className={styles.columnTitle}>
                {section.title}
              </Typography>

              {section.variant === "social" ? (
                <Box className={styles.social}>
                  <FooterSocialLinks
                    items={section.items.map((item) => ({
                      key: item.key,
                      label: item.label,
                      href: getFooterItemHref(item.key, locale, country),
                    }))}
                  />
                </Box>
              ) : (
                <Box className={styles.links}>
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
                        {item.label}
                      </Link>
                    );
                  })}
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
