import { getTranslations } from "next-intl/server";

import type { DeliveryPageLabels } from "@/i18n/types";
import { getLocalizedPath } from "@/utils";

import { PageShell } from "@/components/page-shell";
import {
  DeliveryCtaSection,
  DeliveryFaqSection,
  DeliveryHeroSection,
  DeliveryMethodsSection,
  DeliveryPaymentSection,
  DeliveryReturnsSection,
  DeliveryStepsSection,
} from "./sections";
import { getDeliveryPaymentVariant } from "./utils";
import type { DeliveryPageViewProps } from "./types";

export const DeliveryPageView = async ({
  locale,
  region,
}: DeliveryPageViewProps) => {
  const [t, tRegions] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.deliveryPage" }),
    getTranslations({ locale, namespace: "storefront.regions" }),
  ]);
  const hero = t.raw("hero") as DeliveryPageLabels["hero"];
  const payment = t.raw("payment") as DeliveryPageLabels["payment"];
  const methods = t.raw("methods") as DeliveryPageLabels["methods"];
  const steps = t.raw("steps") as DeliveryPageLabels["steps"];
  const faq = t.raw("faq") as DeliveryPageLabels["faq"];
  const returns = t.raw("returns") as DeliveryPageLabels["returns"];
  const finalCta = t.raw("finalCta") as DeliveryPageLabels["finalCta"];

  const paymentVariant = getDeliveryPaymentVariant(region);
  const regionLabel = tRegions(`${region}.label`);
  const shopHref = getLocalizedPath(locale, "/shop");
  const methodsTitlePrefix = t("methods.titlePrefix", { region: regionLabel });

  return (
    <PageShell>
      <DeliveryHeroSection
        {...hero}
        region={region}
        regionLabel={regionLabel}
      />
      <DeliveryPaymentSection {...payment} paymentVariant={paymentVariant} />
      <DeliveryMethodsSection {...methods} titlePrefix={methodsTitlePrefix} />
      <DeliveryStepsSection {...steps} />
      <DeliveryFaqSection {...faq} />
      <DeliveryReturnsSection {...returns} />
      <DeliveryCtaSection {...finalCta} shopHref={shopHref} />
    </PageShell>
  );
};

export { DeliveryPageSkeleton } from "./skeleton";
export type { DeliveryPageSkeletonProps, DeliveryPageViewProps } from "./types";
