import { ContactPageSkeleton } from "@/components/contact-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <ContactPageSkeleton locale={locale} />;
};

export default Loading;
