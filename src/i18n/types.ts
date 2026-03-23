export type StorefrontBook = {
  slug: string;
  title: string;
  lang: string;
  desc: string;
  emoji: string;
};

export type StorefrontProduct = {
  id: string;
  title: string;
  price: number;
  emoji: string;
  category: string;
};

export type ProductPageLabels = {
  breadcrumbs: {
    home: string;
    shop: string;
  };
  selectors: {
    language: string;
    format: string;
    size: string;
    color: string;
    quantity: string;
  };
  actions: {
    addToCart: string;
    buyNow: string;
    viewBook: string;
  };
  details: {
    sku: string;
    securePayment: string;
    shipping: string;
    languageSupport: string;
  };
  tabs: {
    description: string;
    specs: string;
    delivery: string;
    reviews: string;
  };
  relatedTitle: string;
  storyConnection: {
    title: string;
    description: string;
  };
};

export type StorefrontFooterSection = {
  title: string;
  items: string[];
};

export type StorefrontDictionary = {
  brand: {
    title: string;
    subtitle: string;
    shortLabel: string;
  };
  localeSwitcherLabel: string;
  cartLabel: string;
  nav: {
    books: string;
    shop: string;
    story: string;
    faq: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    lead: string;
    primaryAction: string;
    secondaryAction: string;
    chips: string[];
    featuredHit: {
      label: string;
      title: string;
      price: number;
    };
    character: {
      eyebrow: string;
      title: string;
      subtitle: string;
      emoji: string;
    };
    newBook: {
      label: string;
      title: string;
      edition: string;
      emoji: string;
    };
    promos: Array<{
      eyebrow: string;
      title: string;
      desc: string;
    }>;
  };
  booksSection: {
    eyebrow: string;
    title: string;
    actionLabel: string;
    detailsButton: string;
    buyButton: string;
    items: StorefrontBook[];
  };
  shopSection: {
    eyebrow: string;
    title: string;
    filters: string[];
    addToCart: string;
    wishlistAriaLabel: string;
    items: StorefrontProduct[];
  };
  storySection: {
    eyebrow: string;
    title: string;
    text: string;
    actionLabel: string;
    features: Array<{
      emoji: string;
      title: string;
      text: string;
    }>;
  };
  orderSection: {
    eyebrow: string;
    title: string;
    lead: string;
    nextTitle: string;
    nextText: string;
    cartTitle: string;
    emptyTitle: string;
    emptyText: string;
    quantityLabel: string;
    totalLabel: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      contactLabel: string;
      contactPlaceholder: string;
      noteLabel: string;
      notePlaceholder: string;
      copyButton: string;
      emailButton: string;
      clearButton: string;
    };
    status: {
      emptyCart: string;
      copied: string;
      cleared: string;
    };
    summary: {
      title: string;
      nameFallback: string;
      contactFallback: string;
      itemsTitle: string;
      emptyItem: string;
      totalLabel: string;
      noteLabel: string;
      noteFallback: string;
    };
    emailSubject: string;
  };
  productPage: ProductPageLabels;
  newsletter: {
    eyebrow: string;
    title: string;
    text: string;
    emailPlaceholder: string;
    buttonLabel: string;
  };
  footer: {
    description: string;
    sections: StorefrontFooterSection[];
  };
};

export type Dictionary = {
  metadata: {
    title: string;
    description: string;
  };
  storefront: StorefrontDictionary;
};
