import type { Metadata } from "next";

import { Storefront } from "@/components/storefront";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const generateMetadata = async (): Promise<Metadata> => {
  const dictionary = await getDictionary(defaultLocale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        ru: "/ru",
      },
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const HomePage = async () => {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <Storefront locale={defaultLocale} dictionary={dictionary.storefront} />
  );
};

export default HomePage;
