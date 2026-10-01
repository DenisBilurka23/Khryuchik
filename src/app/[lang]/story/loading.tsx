import { StoryPageSkeleton } from "@/components/story-page-view";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return <StoryPageSkeleton locale={locale} />;
};

export default Loading;
