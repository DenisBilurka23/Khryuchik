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

export type CountLabelForms = {
  one: string;
  few?: string;
  many?: string;
  other: string;
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

export type FavoritesPageLabels = {
  eyebrow: string;
  title: string;
  lead: string;
  savedLabel: string;
  primaryAction: string;
  secondaryAction: string;
  continueAction: string;
  listTitle: string;
  guestListTitle: string;
  guestListText: string;
  itemCount: CountLabelForms;
  addToCart: string;
  view: string;
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
  favoritesLabel: string;
  favoritesPage: FavoritesPageLabels;
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
      itemCount: CountLabelForms;
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
  favoritesEyebrow: string;
  favoritesTitle: string;
  favoritesLead: string;
  favoritesSavedLabel: string;
  favoritesInStockLabel: string;
  favoritesTotalLabel: string;
  favoritesListTitle: string;
  favoritesAddAllToCart: string;
  favoritesFilterAll: string;
  favoritesPriceLabel: string;
  favoritesView: string;
  favoritesRecommendationsTitle: string;
  favoritesRecommendationsAction: string;
  signOutTitle: string;
  signOutText: string;
  tabs: string[];
};

export type AdminPageDictionary = {
  layout: {
    searchPlaceholder: string;
    addProduct: string;
    brandSubtitle: string;
    secureAccessText: string;
    languageSwitcherLabel: string;
  };
  nav: {
    dashboard: string;
    products: string;
    categories: string;
    customers: string;
    orders: string;
  };
  shared: {
    actions: {
      edit: string;
      update: string;
      manage: string;
      backToProducts: string;
      viewCatalog: string;
      viewAccounts: string;
      openAccounts: string;
    };
    placeholders: {
      noName: string;
      emptyValue: string;
    };
    status: {
      active: string;
      hidden: string;
      admin: string;
      user: string;
      homeTabs: string;
      shopOnly: string;
      ordersWired: string;
      ordersPending: string;
      availability: {
        in_stock: string;
        out_of_stock: string;
        preorder: string;
        made_to_order: string;
      };
      productTypes: {
        book: string;
        merch: string;
      };
      authProviders: {
        google: string;
        credentials: string;
      };
    };
  };
  dashboard: {
    eyebrow: string;
    title: string;
    description: string;
    systemStateTitle: string;
    systemStateDescription: string;
    stats: {
      productsTitle: string;
      productsNote: string;
      accountsTitle: string;
      accountsNote: string;
      categoriesTitle: string;
      categoriesNote: string;
    };
    recentProducts: {
      title: string;
      description: string;
      action: string;
      columns: {
        name: string;
        category: string;
        price: string;
        status: string;
        action: string;
      };
    };
    recentCustomers: {
      title: string;
      description: string;
      action: string;
      createdLabel: string;
    };
    categories: {
      title: string;
      description: string;
      action: string;
      itemsLabel: string;
    };
    orders: {
      title: string;
      description: string;
      emptyTitle: string;
      emptyDescription: string;
    };
  };
  products: {
    eyebrow: string;
    title: string;
    description: string;
    newProduct: string;
    sectionTitle: string;
    sectionDescription: string;
    columns: {
      product: string;
      sku: string;
      type: string;
      category: string;
      price: string;
      status: string;
      sortOrder: string;
      action: string;
    };
  };
  categories: {
    eyebrow: string;
    title: string;
    description: string;
    savedMessage: string;
    newCategoryTitle: string;
    newCategoryDescription: string;
    saveButton: string;
    updateButton: string;
    itemsLabel: string;
    fields: {
      key: string;
      sortOrder: string;
      ruLabel: string;
      enLabel: string;
      ruDescription: string;
      enDescription: string;
    };
    toggles: {
      isActive: string;
      visibleInShop: string;
      visibleInHomeTabs: string;
    };
  };
  customers: {
    eyebrow: string;
    title: string;
    description: string;
    sectionTitle: string;
    sectionDescription: string;
    createdLabel: string;
    columns: {
      user: string;
      phone: string;
      role: string;
      providers: string;
      created: string;
    };
  };
  orders: {
    eyebrow: string;
    title: string;
    description: string;
    sectionTitle: string;
    sectionDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    action: string;
  };
  productForm: {
    newTitle: string;
    newDescription: string;
    editTitlePrefix: string;
    editDescription: string;
    savedMessage: string;
    errorMessages: {
      storageUnavailable: string;
      saveFailed: string;
      unexpected: string;
    };
    createButton: string;
    saveChangesButton: string;
    newEyebrow: string;
    editEyebrow: string;
    summaryTitle: string;
    summaryGalleryAssets: string;
    summaryDigitalFiles: string;
    galleryCountLabel: string;
    filesCountLabel: string;
    baseSectionTitle: string;
    baseSectionDescription: string;
    placementTitle: string;
    pricingSectionTitle: string;
    pricingSectionDescription: string;
    localeSectionTitle: string;
    localeSectionDescription: string;
    currentGalleryTitle: string;
    currentAssetsTitle: string;
    imagesUploadButton: string;
    assetsUploadButton: string;
    relatedSectionTitle: string;
    relatedSectionDescription: string;
    reviewsSectionTitle: string;
    reviewsSectionDescription: string;
    helpers: {
      productId: string;
      slug: string;
      sku: string;
      relatedProductIds: string;
      storyProductId: string;
      mediaRule: string;
      optionsRule: string;
      specsRule: string;
      reviewsRule: string;
      filesRule: string;
    };
    buttons: {
      addLanguage: string;
      addFormat: string;
      addSize: string;
      addColor: string;
      addSpec: string;
      addReview: string;
      removeItem: string;
    };
    fields: {
      productId: string;
      type: string;
      category: string;
      sortOrder: string;
      availability: string;
      quantity: string;
      isActive: string;
      visibleInShop: string;
      visibleOnHome: string;
      byPrice: string;
      byOldPrice: string;
      usPrice: string;
      usOldPrice: string;
      slug: string;
      title: string;
      shortTitle: string;
      shortDescription: string;
      thumbnailBackgroundColor: string;
      subtitle: string;
      badge: string;
      storyLabel: string;
      storyProductId: string;
      sku: string;
      description: string;
      languages: string;
      formats: string;
      sizes: string;
      colors: string;
      specs: string;
      reviews: string;
      specLabel: string;
      specValue: string;
      reviewAuthor: string;
      reviewText: string;
      reviewRating: string;
      reviewDate: string;
      deliveryLines: string;
      relatedProductIds: string;
      thumbnail: string;
      gallery: string;
    };
  };
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
  adminPage: AdminPageDictionary;
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
  adminPage: AdminPageDictionary;
};
