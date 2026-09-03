import { Box, Container, Grid, Stack, Typography } from "@mui/material";
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
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Logo markSize={40} title={tStorefront("brand.shortLabel")} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, lineHeight: 1.7 }}
            >
              {tFooter("description")}
            </Typography>
          </Grid>

          {sections.map((section) => (
            <Grid
              key={section.title}
              size={{ xs: 6, sm: 3, lg: sectionColumnWidth }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--color-accent)",
                }}
              >
                {section.title}
              </Typography>

              {section.variant === "social" ? (
                <Box sx={{ mt: 2 }}>
                  <FooterSocialLinks
                    items={section.items.map((item) => ({
                      key: item.key,
                      label: item.label,
                      href: getFooterItemHref(item.key, locale, country),
                    }))}
                  />
                </Box>
              ) : (
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
                        <Typography component="span" sx={{ fontSize: 15 }}>
                          {item.label}
                        </Typography>
                      </Link>
                    );
                  })}
                </Stack>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
