import { getTranslations } from "next-intl/server";
import { CONTACT_EMAIL } from "@/constants/contact";
import type { ContactPageLabels } from "@/i18n/types";
import { getServerAuthSession } from "@/server/auth/config";
import { formatPersonName } from "@/utils";
import { getFooterItemHref } from "@/utils/footer";
import styles from "./contact-page-view.module.css";
import { ContactChannelsSection } from "./sections/contact-channels-section";
import type { ContactChannelItem } from "./sections/contact-channels-section/types";
import { ContactForm } from "./sections/contact-form-section";
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
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>{hero.eyebrow}</span>
          <h1 className={styles.heroTitle}>
            {hero.titlePrefix} <em>{hero.titleAccent}</em>
          </h1>
          <p className={styles.heroLede}>{hero.lede}</p>
        </div>
      </section>

      <div className={styles.main}>
        <ContactChannelsSection
          title={channels.title}
          sub={channels.sub}
          note={channels.note}
          channels={channelItems}
        />
        <ContactForm
          locale={locale}
          contactEmail={CONTACT_EMAIL}
          defaultName={defaultName}
          defaultEmail={defaultEmail}
          labels={form}
        />
      </div>
    </div>
  );
};

export type { ContactPageViewProps } from "./types";
