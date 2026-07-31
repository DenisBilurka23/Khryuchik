import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/product";
import { defaultLocale, locales } from "@/i18n/config";
import {
  getProductDetails,
  getProductSummariesByIds,
} from "@/server/catalog/services/catalog.service";
import { isActiveLocale } from "@/server/localization/localization.service";
import { getRequestCountry } from "@/server/country/request-country";
import { getServerAuthSession } from "@/server/auth/config";
import { getProductPurchaseContext } from "@/server/downloads/downloads.service";
import { getUserReviewForProduct } from "@/server/reviews/services/reviews.service";
import type { ProductPurchaseContext } from "@/types/download";
import type { UserReviewSummary } from "@/types/reviews";

type LocalizedProductPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedProductPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const country = await getRequestCountry();
  const product = await getProductDetails(lang, country, slug);

  if (!product) {
    notFound();
  }

  const tBrand = await getTranslations({
    locale: lang,
    namespace: "storefront.brand",
  });

  return {
    title: `${product.title} | ${tBrand("title")}`,
    description: product.description,
    alternates: {
      canonical:
        lang === defaultLocale
          ? `/products/${slug}`
          : `/${lang}/products/${slug}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale
            ? `/products/${slug}`
            : `/${locale}/products/${slug}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: product.title,
      description: product.description,
      siteName: tBrand("title"),
    },
  };
};

const LocalizedProductPage = async ({ params }: LocalizedProductPageProps) => {
  const { lang, slug } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const country = await getRequestCountry();
  const product = await getProductDetails(lang, country, slug);

  if (!product) {
    notFound();
  }

  const session = await getServerAuthSession();

  const [relatedProducts, storyProducts, purchaseContext, userReview] =
    await Promise.all([
      getProductSummariesByIds(lang, country, product.relatedIds),
      getProductSummariesByIds(
        lang,
        country,
        product.storyProductId ? [product.storyProductId] : [],
      ),
      session?.user
        ? getProductPurchaseContext(
            session.user.id || undefined,
            session.user.email ?? undefined,
            product.productId,
          )
        : Promise.resolve<ProductPurchaseContext>({
            ownedLanguages: [],
            hasPurchased: false,
          }),
      session?.user
        ? getUserReviewForProduct(
            session.user.id || undefined,
            product.productId,
            lang,
          )
        : Promise.resolve<UserReviewSummary | null>(null),
    ]);

  return (
    <ProductPageView
      locale={lang}
      country={country}
      product={product}
      relatedProducts={relatedProducts}
      storyProduct={storyProducts[0] ?? null}
      ownedLanguages={purchaseContext.ownedLanguages}
      isAuthenticated={Boolean(session?.user)}
      hasPurchased={purchaseContext.hasPurchased}
      userReview={userReview}
    />
  );
};

export default LocalizedProductPage;
