import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EntertainmentItemPageView } from "@/components/entertainment-item-page-view";
import { defaultLocale } from "@/i18n/config";
import { hasAdminAccess } from "@/server/admin/auth";
import { getEntertainmentItem } from "@/server/entertainment/services/entertainment.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";

type DefaultEntertainmentItemPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: DefaultEntertainmentItemPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const item = await getEntertainmentItem(defaultLocale, slug);

  if (!item) {
    return {};
  }

  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${item.title} | ${tStorefront("brand.title")}`;

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: `/entertainment/${slug}`,
    title,
    description: item.description,
    openGraph: {
      type: "video.other",
      images: item.poster?.src ? [{ url: item.poster.src }] : undefined,
    },
  });
};

const DefaultEntertainmentItemPage = async ({
  params,
}: DefaultEntertainmentItemPageProps) => {
  const { slug } = await params;
  const [item, isAdmin] = await Promise.all([
    getEntertainmentItem(defaultLocale, slug),
    hasAdminAccess(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <EntertainmentItemPageView
      locale={defaultLocale}
      item={item}
      isAdmin={isAdmin}
    />
  );
};

export default DefaultEntertainmentItemPage;
