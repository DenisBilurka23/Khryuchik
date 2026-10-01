import { FavoritesPageSkeleton } from "@/components/favorites-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <FavoritesPageSkeleton locale={locale} />;
};

export default Loading;
