import { Box, Container } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { CONTACT_EMAIL } from "@/constants/contact";
import type { ContactPageLabels } from "@/i18n/types";
import { getServerAuthSession } from "@/server/auth/config";
import { formatPersonName } from "@/utils";
import { getFooterItemHref } from "@/utils/footer";

import shellStyles from "../storefront/storefront.module.css";

import styles from "./contact-page-view.module.css";
import { ContactChannelsSection } from "./sections/contact-channels-section";
import type { ContactChannelItem } from "./sections/contact-channels-section/types";
import { ContactForm } from "./sections/contact-form-section";
import { ContactHero } from "./sections/contact-hero";
import type { ContactPageViewProps } from "./types";
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
    <Box className={shellStyles.pageShell}>
      <Box className={shellStyles.pageContent}>
        <Box component="section" className={styles.section}>
          <Container maxWidth="lg">
            <ContactHero
              eyebrow={hero.eyebrow}
              titlePrefix={hero.titlePrefix}
              titleAccent={hero.titleAccent}
              lede={hero.lede}
            />

            <Box className={styles.content}>
              <Box className={styles.panel}>
                <ContactChannelsSection
                  title={channels.title}
                  sub={channels.sub}
                  note={channels.note}
                  channels={channelItems}
                />
              </Box>

              <Box className={styles.panel}>
                <ContactForm
                  locale={locale}
                  contactEmail={CONTACT_EMAIL}
                  defaultName={defaultName}
                  defaultEmail={defaultEmail}
                  labels={form}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export type { ContactPageViewProps } from "./types";
