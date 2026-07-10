import "server-only";

import type { Locale } from "@/i18n/config";
import { sendNewProductAnnouncement } from "@/server/email/new-product";
import { markProductAnnouncedIfNew } from "@/server/newsletter/repositories/announcements.repository";
import {
  addNewsletterSubscriber,
  getAllNewsletterSubscribers,
  isNewsletterSubscriberPresent,
  removeNewsletterSubscriberByEmail,
  removeNewsletterSubscriberByToken,
} from "@/server/newsletter/repositories/newsletter.repository";
import type { ProductDocument } from "@/types/catalog";

export const subscribeToNewsletter = async (email: string, locale: Locale) => {
  await addNewsletterSubscriber(email.toLowerCase(), locale);
};

export const isSubscribedToNewsletter = async (email: string) =>
  isNewsletterSubscriberPresent(email.toLowerCase());

export const setNewsletterSubscription = async (
  email: string,
  locale: Locale,
  subscribed: boolean,
) => {
  if (subscribed) {
    await subscribeToNewsletter(email, locale);
    return;
  }

  await removeNewsletterSubscriberByEmail(email.toLowerCase());
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
