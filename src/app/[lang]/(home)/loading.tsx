import { HeroSection } from "@/components/hero-section";
import { HomeSectionSkeleton } from "@/components/home-page-view";
import { PageShell } from "@/components/page-shell";
import { resolveLocale } from "@/server/i18n/request-locale";

const Loading = async () => {
  const locale = await resolveLocale("storefront");

  return (
    <PageShell>
      <HeroSection locale={locale} />
      <HomeSectionSkeleton kind="books" />
      <HomeSectionSkeleton kind="shop" />
      <HomeSectionSkeleton kind="entertainment" />
    </PageShell>
  );
};

export default Loading;
