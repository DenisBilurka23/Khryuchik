import {
  EntertainmentCatalogSkeleton,
  EntertainmentPageView,
} from "@/components/entertainment-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return (
    <EntertainmentPageView locale={locale}>
      <EntertainmentCatalogSkeleton />
    </EntertainmentPageView>
  );
};

export default Loading;
