import { EntertainmentItemPageSkeleton } from "@/components/entertainment-item-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <EntertainmentItemPageSkeleton locale={locale} />;
};

export default Loading;
