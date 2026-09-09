import { Box, Container } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { Plate } from "@/components/primitives";
import { CONTACT_EMAIL } from "@/constants/contact";
import type { ContactPageLabels } from "@/i18n/types";
import { getServerAuthSession } from "@/server/auth/config";
import { formatPersonName } from "@/utils";
import { getFooterItemHref } from "@/utils/footer";

import { PageShell } from "../storefront/page-shell";
import { ContactChannelsSection } from "./sections/contact-channels-section";
import type { ContactChannelItem } from "./sections/contact-channels-section/types";
import { ContactForm } from "./sections/contact-form-section";
import { ContactHero } from "./sections/contact-hero";
import type { ContactPageViewProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "minmax(0, 0.86fr) minmax(0, 1.14fr)",
  },
  alignItems: "stretch",
  gap: { xs: 2, md: 3 },
  mt: { xs: 3, md: 4 },
  p: { xs: 2, md: 3 },
  borderRadius: "var(--radius-panel)",
  background: "var(--color-accent-pale)",
} as const;
import { getInstagramHandle } from "./utils";

export const ContactPageView = async ({
  locale,
  country,
}: ContactPageViewProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.contactPage",
  });
  const hero = t.raw("hero") as ContactPageLabels["hero"];
  const channels = t.raw("channels") as ContactPageLabels["channels"];
  const form = t.raw("form") as ContactPageLabels["form"];

  const session = await getServerAuthSession();
  const defaultName = formatPersonName(
    session?.user?.firstName,
    session?.user?.lastName,
  );
  const defaultEmail = session?.user?.email ?? "";

  const instagramHref = getFooterItemHref("instagram", locale, country);
  const facebookHref = getFooterItemHref("facebook", locale, country);
  const emailHref = getFooterItemHref("email", locale, country);

  const channelItems: ContactChannelItem[] = [
    {
      kind: "ig",
      label: channels.instagramLabel,
      value: getInstagramHandle(instagramHref),
      href: instagramHref,
      external: true,
    },
    {
      kind: "fb",
      label: channels.facebookLabel,
      value: channels.facebookHandle,
      href: facebookHref,
      external: true,
    },
    {
      kind: "mail",
      label: channels.emailLabel,
      value: CONTACT_EMAIL,
      href: emailHref,
      external: false,
    },
  ];

  return (
    <PageShell>
      <Box component="section" sx={{ pt: { xs: 3, md: 6 } }}>
        <Container maxWidth="lg">
          <ContactHero
            eyebrow={hero.eyebrow}
            titlePrefix={hero.titlePrefix}
            titleAccent={hero.titleAccent}
            lede={hero.lede}
          />

          <Box sx={panelSx}>
            <Plate pad="lg">
              <ContactChannelsSection
                title={channels.title}
                sub={channels.sub}
                note={channels.note}
                channels={channelItems}
              />
            </Plate>

            <Plate pad="lg">
              <ContactForm
                locale={locale}
                contactEmail={CONTACT_EMAIL}
                defaultName={defaultName}
                defaultEmail={defaultEmail}
                labels={form}
              />
            </Plate>
          </Box>
        </Container>
      </Box>
    </PageShell>
  );
};

export type { ContactPageViewProps } from "./types";
