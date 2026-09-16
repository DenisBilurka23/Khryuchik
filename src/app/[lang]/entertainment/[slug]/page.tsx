import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EntertainmentItemPageView } from "@/components/entertainment-item-page-view";
import { hasAdminAccess } from "@/server/admin/auth";
import { getEntertainmentItem } from "@/server/entertainment/services/entertainment.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedEntertainmentItemPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedEntertainmentItemPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  await requireActiveLocale(lang);

  const item = await getEntertainmentItem(lang, slug);

  if (!item) {
    return {};
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${item.title} | ${tStorefront("brand.title")}`;

  return createStorefrontMetadata({
    locale: lang,
    path: `/entertainment/${slug}`,
    title,
    description: item.description,
    openGraph: {
      type: "video.other",
      images: item.poster?.src ? [{ url: item.poster.src }] : undefined,
    },
  });
};

const LocalizedEntertainmentItemPage = async ({
  params,
}: LocalizedEntertainmentItemPageProps) => {
  const { lang, slug } = await params;

  await requireActiveLocale(lang);

  const [item, isAdmin] = await Promise.all([
    getEntertainmentItem(lang, slug),
    hasAdminAccess(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <EntertainmentItemPageView locale={lang} item={item} isAdmin={isAdmin} />
  );
};

export default LocalizedEntertainmentItemPage;
