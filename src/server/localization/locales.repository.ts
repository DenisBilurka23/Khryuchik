import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { LocaleDocument } from "@/types/localization";

export const findAllLocales = async () => {
  const db = await getMongoDb();

  return db
    .collection<LocaleDocument>("locales")
    .find({}, { projection: { _id: 0 } })
    .sort({ sortOrder: 1, code: 1 })
    .toArray();
};

export const upsertLocale = async (locale: LocaleDocument) => {
  const db = await getMongoDb();

  await db.collection<LocaleDocument>("locales").replaceOne(
    { code: locale.code },
    locale,
    { upsert: true },
  );

  return locale;
};

export const clearDefaultLocaleExcept = async (code: string) => {
  const db = await getMongoDb();

  await db
    .collection<LocaleDocument>("locales")
    .updateMany(
      { code: { $ne: code }, isDefault: true },
      { $set: { isDefault: false } },
    );
};

export const deleteLocaleByCode = async (code: string) => {
  const db = await getMongoDb();

  return db.collection<LocaleDocument>("locales").deleteOne({ code });
};

export const countLocales = async () => {
  const db = await getMongoDb();

  return db.collection<LocaleDocument>("locales").countDocuments();
};
