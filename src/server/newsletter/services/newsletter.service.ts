import "server-only";

import type { Locale } from "@/i18n/config";
import { sendNewProductAnnouncement } from "@/server/email/new-product";
import { markProductAnnouncedIfNew } from "@/server/newsletter/repositories/announcements.repository";
import {
  addNewsletterSubscriber,
  getAllNewsletterSubscribers,
  removeNewsletterSubscriberByToken,
} from "@/server/newsletter/repositories/newsletter.repository";
import type { ProductDocument } from "@/types/catalog";

export const subscribeToNewsletter = async (email: string, locale: Locale) => {
  await addNewsletterSubscriber(email.toLowerCase(), locale);
};

export const unsubscribeFromNewsletter = async (token: string) =>
  removeNewsletterSubscriberByToken(token);

export const announceNewProduct = async (product: ProductDocument) => {
  const isFirstAnnouncement = await markProductAnnouncedIfNew(
    product.productId,
  );

  if (!isFirstAnnouncement) {
    return;
  }

  const subscribers = await getAllNewsletterSubscribers();

  await sendNewProductAnnouncement(product, subscribers);
};
