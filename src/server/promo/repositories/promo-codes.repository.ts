import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { PromoCodeDocument } from "@/types/promo";

const getPromoCodesCollection = async () =>
  (await getMongoDb()).collection<PromoCodeDocument>("promoCodes");

export const findPromoCodeByCode = async (code: string) => {
  const collection = await getPromoCodesCollection();

  return collection.findOne({ code }, { projection: { _id: 0 } });
};

export const findAllPromoCodes = async () => {
  const collection = await getPromoCodesCollection();

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
};

export const upsertPromoCode = async (promoCode: PromoCodeDocument) => {
  const collection = await getPromoCodesCollection();

  await collection.replaceOne({ code: promoCode.code }, promoCode, {
    upsert: true,
  });

  return promoCode;
};

export const deletePromoCodeByCode = async (code: string) => {
  const collection = await getPromoCodesCollection();

  return collection.deleteOne({ code });
};
