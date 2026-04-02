export type SeedStorefrontBook = {
  slug: string;
  title: string;
  lang: string;
  desc: string;
  emoji: string;
};

export type SeedStorefrontProduct = {
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

export type ShopPageLabels = {
  eyebrow: string;
  title: string;
  lead: string;
  filters: {
    all: string;
  };
  searchPlaceholder: string;
  resultsLabel: string;
  emptyTitle: string;
  emptyText: string;
  resetFilters: string;
  breadcrumbs: {
    home: string;
    current: string;
  };
};

export type CartPageLabels = {
  eyebrow: string;
  title: string;
  lead: string;
  breadcrumbs: {
    home: string;
    shop: string;
    current: string;
  };
  emptyState: {
    title: string;
    text: string;
    action: string;
  };
  itemCard: {
    variantLabel: string;
    removeLabel: string;
  };
  summary: {
    title: string;
    promoPlaceholder: string;
    promoButton: string;
    itemsLabel: string;
    shippingLabel: string;
    freeShipping: string;
    discountLabel: string;
    totalLabel: string;
    checkoutButton: string;
    continueShopping: string;
    infoTitle: string;
    infoText: string;
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
  countrySwitcherLabel: string;
  cartLabel: string;
  userMenu: {
    account: string;
    signIn: string;
  };
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
  };
  shopSection: {
    eyebrow: string;
    title: string;
    actionLabel: string;
    addToCart: string;
    wishlistAriaLabel: string;
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
    cartSummary: {
      helperText: string;
      itemCount: {
        one: string;
        few?: string;
        many?: string;
        other: string;
      };
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
  shopPage: ShopPageLabels;
  cartPage: CartPageLabels;
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

export type AuthPageDictionary = {
  eyebrow: string;
  title: string;
  lead: string;
  credentialsTitle: string;
  credentialsLead: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  forgotPasswordLinkLabel: string;
  registerPrompt: string;
  registerLinkLabel: string;
  invalidCredentials: string;
  unexpectedError: string;
  googleTitle: string;
  googleButton: string;
  unavailable: string;
  ready: string;
  dividerLabel: string;
  chips: string[];
};

export type ForgotPasswordPageDictionary = {
  eyebrow: string;
  title: string;
  lead: string;
  chips: string[];
  emailLabel: string;
  emailPlaceholder: string;
  submitButton: string;
  loginPrompt: string;
  loginLinkLabel: string;
  successMessage: string;
  invalidEmail: string;
  unexpectedError: string;
};

export type ResetPasswordPageDictionary = {
  eyebrow: string;
  title: string;
  lead: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  submitButton: string;
  successMessage: string;
  loginLinkLabel: string;
  passwordMismatch: string;
  passwordTooShort: string;
  invalidToken: string;
  unexpectedError: string;
};

export type RegisterPageDictionary = {
  eyebrow: string;
  title: string;
  lead: string;
  chips: string[];
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  submitButton: string;
  loginPrompt: string;
  loginLinkLabel: string;
  passwordMismatch: string;
  emailTaken: string;
  passwordTooShort: string;
  invalidEmail: string;
  missingFields: string;
  unexpectedError: string;
};

export type AccountPageDictionary = {
  account: string;
  welcome: string;
  lead: string;
  profile: string;
  orders: string;
  books: string;
  addresses: string;
  favorites: string;
  settings: string;
  logout: string;
  delivered: string;
  inDelivery: string;
  editProfile: string;
  save: string;
  saved: string;
  firstNameLabel: string;
  lastNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  invalidEmail: string;
  emailTaken: string;
  missingFields: string;
  emailManagedByGoogle: string;
  unexpectedError: string;
  addAddress: string;
  allOrders: string;
  showAll: string;
  removeAll: string;
  signOutButton: string;
  security: string;
  notifications: string;
  languageRegion: string;
  personalData: string;
  recentOrders: string;
  downloadedBooks: string;
  shippingAddresses: string;
  signOutTitle: string;
  signOutText: string;
  tabs: string[];
};

export type SeedStorefrontDictionary = Omit<
  StorefrontDictionary,
  "booksSection" | "shopSection"
> & {
  booksSection: StorefrontDictionary["booksSection"];
  shopSection: StorefrontDictionary["shopSection"];
};

export type Dictionary = {
  metadata: {
    title: string;
    description: string;
  };
  storefront: StorefrontDictionary;
  authPage: AuthPageDictionary;
  registerPage: RegisterPageDictionary;
  forgotPasswordPage: ForgotPasswordPageDictionary;
  resetPasswordPage: ResetPasswordPageDictionary;
  accountPage: AccountPageDictionary;
};

export type SeedDictionary = {
  metadata: {
    title: string;
    description: string;
  };
  storefront: SeedStorefrontDictionary;
  authPage: AuthPageDictionary;
  registerPage: RegisterPageDictionary;
  forgotPasswordPage: ForgotPasswordPageDictionary;
  resetPasswordPage: ResetPasswordPageDictionary;
  accountPage: AccountPageDictionary;
};
