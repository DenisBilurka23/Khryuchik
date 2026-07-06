export const CONTACT_EMAIL = "khryuchik@gmail.com";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61585834529574",
  // Keyed by shipping/storefront country, not UI locale — falls back to the
  // US (English) account for any country without its own account.
  instagramByCountry: {
    BY: "https://www.instagram.com/khryuchik/",
    US: "https://www.instagram.com/khryuchik.kids/",
  },
} as const;
