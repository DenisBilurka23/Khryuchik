import type { Dictionary } from "@/i18n/types";

const dictionary: Dictionary = {
  metadata: {
    title: "Khryuchik | Stories, books, and merch for the whole family",
    description:
      "Khryuchik website with bilingual books, a merch shop, and SEO-friendly localized pages in Russian and English.",
  },
  storefront: {
    brand: {
      title: "Khryuchik",
      subtitle: "Stories • Books • Merch",
      shortLabel: "Khryuchik",
    },
    localeSwitcherLabel: "Language switcher",
    cartLabel: "Cart",
    nav: {
      books: "Books",
      shop: "Shop",
      story: "Story",
      faq: "Shipping",
    },
    hero: {
      badge: "✨ Books in Russian and English",
      title:
        "The warm world of Khryuchik — stories, books, and merch for the whole family",
      highlight: "Khryuchik",
      lead: "Kind stories inspired by real life, plus cozy products with a beloved character: books, mugs, T-shirts, stickers, and gift bundles.",
      primaryAction: "Browse books",
      secondaryAction: "Open the shop",
      chips: [
        "📦 Shipping across Belarus and internationally",
        "🌍 RU / EN website versions",
        "🎁 Ready-made gift sets",
      ],
      featuredHit: {
        label: "This week's favorite",
        title: "Khryuchik mug",
        price: 24,
      },
      character: {
        eyebrow: "Main character",
        title: "Khryuchik",
        subtitle: "the hero of gentle family stories",
        emoji: "🐷",
      },
      newBook: {
        label: "New book",
        title: "RU / EN edition",
        edition: "bilingual release",
        emoji: "📕",
      },
      promos: [
        {
          eyebrow: "Collection",
          title: "Khryuchik in Winter",
          desc: "A book, a mug, and a warm blanket in one themed bundle.",
        },
        {
          eyebrow: "For gifting",
          title: "Gift Box",
          desc: "Ready-made sets for children and parents.",
        },
      ],
    },
    booksSection: {
      eyebrow: "Books",
      title: "Stories you want to read again and again",
      actionLabel: "All books",
      detailsButton: "Details",
      buyButton: "Buy",
      items: [
        {
          slug: "book-winter",
          title: "Khryuchik in Winter",
          lang: "RU / EN",
          desc: "A warm story about Khryuchik's winter adventures.",
          emoji: "📘",
        },
        {
          slug: "book-country-house",
          title: "Khryuchik at the Country House",
          lang: "RU / EN",
          desc: "A cheerful tale inspired by real family memories.",
          emoji: "📚",
        },
        {
          slug: "book-friends",
          title: "Khryuchik and Friends",
          lang: "RU / EN",
          desc: "A kind story about friendship, care, and small discoveries.",
          emoji: "📚",
        },
      ],
    },
    shopSection: {
      eyebrow: "Shop",
      title: "Favorite Khryuchik merch",
      filters: ["All", "Apparel", "Gifts"],
      addToCart: "Add to cart",
      wishlistAriaLabel: "Add to favorites",
      items: [
        {
          id: "book-winter",
          title: "Book 'Khryuchik in Winter'",
          price: 29,
          emoji: "📘",
          category: "All",
        },
        {
          id: "mug",
          title: "Khryuchik mug",
          price: 24,
          emoji: "☕",
          category: "Gifts",
        },
        {
          id: "tshirt",
          title: "Khryuchik T-shirt",
          price: 49,
          emoji: "👕",
          category: "Apparel",
        },
        {
          id: "stickers",
          title: "Khryuchik stickers",
          price: 12,
          emoji: "✨",
          category: "Gifts",
        },
      ],
    },
    storySection: {
      eyebrow: "Brand story",
      title: "Stories born out of real life",
      text: "Khryuchik is more than a character. It is a warm family world inspired by real moments, memories, and experiences worth keeping in a book and in the heart.",
      actionLabel: "Read the story",
      features: [
        {
          emoji: "🌍",
          title: "Two language versions",
          text: "A Russian and English catalog, books, and product cards for both local and international audiences.",
        },
        {
          emoji: "🎁",
          title: "Collections built around book plots",
          text: "Each book can grow into its own merch collection: apparel, mugs, postcards, stickers, and bundles.",
        },
      ],
    },
    orderSection: {
      eyebrow: "Order",
      title: "Build a cart and send an inquiry any way you like",
      lead: "No heavy checkout yet: add products, leave your contact details, and confirm shipping or personalization manually over email, Telegram, or social media.",
      nextTitle: "What can be added next",
      nextText:
        "Online payments, stock control, an account area, real product photos, and CRM or Telegram bot integration.",
      cartTitle: "Your order",
      emptyTitle: "Your cart is empty",
      emptyText: "Add products from the shop above.",
      quantityLabel: "Quantity",
      totalLabel: "Estimated total",
      form: {
        nameLabel: "Your name",
        namePlaceholder: "For example, Anna",
        contactLabel: "Preferred contact",
        contactPlaceholder: "Phone, Telegram, or Instagram",
        noteLabel: "Order details",
        notePlaceholder:
          "For example: signed postcard, gift wrapping, or a child's name on the card",
        copyButton: "Copy inquiry",
        emailButton: "Open email",
        clearButton: "Clear cart",
      },
      status: {
        emptyCart: "Add products to the cart first.",
        copied:
          "The inquiry has been copied. You can now send it via Telegram, Instagram, or email.",
        cleared: "The cart has been cleared.",
      },
      summary: {
        title: "Khryuchik merch inquiry",
        nameFallback: "not provided",
        contactFallback: "not provided",
        itemsTitle: "Order items:",
        emptyItem: "• No products selected yet",
        totalLabel: "Total",
        noteLabel: "Notes",
        noteFallback: "none",
      },
      emailSubject: "Khryuchik merch order",
    },
    productPage: {
      breadcrumbs: {
        home: "Home",
        shop: "Shop",
      },
      selectors: {
        language: "Language",
        format: "Format",
        size: "Size",
        color: "Color",
        quantity: "Quantity",
      },
      actions: {
        addToCart: "Add to cart",
        buyNow: "Buy now",
        viewBook: "View the book",
      },
      details: {
        sku: "SKU",
        securePayment: "Secure online payment",
        shipping: "Shipping across Belarus and internationally",
        languageSupport: "RU / EN versions available for books",
      },
      tabs: {
        description: "Description",
        specs: "Specifications",
        delivery: "Delivery and payment",
        reviews: "Reviews",
      },
      relatedTitle: "Build your own Khryuchik bundle",
      storyConnection: {
        title: "This product was inspired by the story '{title}'",
        description:
          "Add the book to your purchase and create a cozy Khryuchik gift set.",
      },
    },
    shopPage: {
      eyebrow: "Catalog",
      title: "Khryuchik shop — books, gifts, and cozy merch",
      lead: "Browse bilingual books, mugs, T-shirts, stickers, and gift-ready items inspired by Khryuchik's gentle stories.",
      filters: {
        all: "All",
        books: "Books",
        clothes: "Apparel",
        gifts: "Gifts",
      },
      searchPlaceholder: "Search products",
      resultsLabel: "Products found",
      emptyTitle: "Nothing found",
      emptyText: "Try changing your search or choosing another category.",
      resetFilters: "Reset filters",
      breadcrumbs: {
        home: "Home",
        current: "Shop",
      },
    },
    newsletter: {
      eyebrow: "Newsletter",
      title: "Get updates on new books and Khryuchik collections",
      text: "Announcements about new stories, merch drops, gift bundles, and seasonal releases — without extra noise.",
      emailPlaceholder: "Your email",
      buttonLabel: "Subscribe",
    },
    footer: {
      description:
        "Gentle family stories and cozy merch for children and adults.",
      sections: [
        {
          title: "Sections",
          items: ["Books", "Shop", "Khryuchik story", "Gift bundles"],
        },
        {
          title: "For customers",
          items: ["Shipping and payment", "Returns", "FAQ", "Contacts"],
        },
        {
          title: "Socials",
          items: ["Instagram", "TikTok", "Telegram", "Email"],
        },
      ],
    },
  },
};

export default dictionary;
