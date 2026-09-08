import { Box, Container, Grid, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Logo } from "@/components/logo";
import type { Locale } from "@/i18n/config";
import type { StorefrontFooterSection } from "@/i18n/types";
import type { CountryCode } from "@/utils";
import { getFooterItemHref } from "@/utils/footer";

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
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid var(--color-border-rose)",
        background: "var(--color-cream)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Logo markSize={40} title={tStorefront("brand.shortLabel")} />
            <Typography
              sx={{
                mt: 2,
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
              }}
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
                component="p"
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mt: 2,
                    fontSize: 15,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {section.items.map((item) => {
                    const href = getFooterItemHref(item.key, locale, country);

                    return (
                      <Link
                        key={item.key}
                        href={href}
                        {...(href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "block",
                            width: "fit-content",
                            color: "inherit",
                            "&:hover": {
                              color: "var(--color-action)",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {item.label}
                        </Box>
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
