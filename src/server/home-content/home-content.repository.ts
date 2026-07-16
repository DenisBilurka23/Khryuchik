import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { HeroContentDocument } from "@/types/home-content";

const HERO_KEY = "hero" as const;

export const findHeroContent = async () => {
  const db = await getMongoDb();

  return db
    .collection<HeroContentDocument>("homeContent")
    .findOne({ key: HERO_KEY }, { projection: { _id: 0 } });
};

export const upsertHeroContent = async (content: HeroContentDocument) => {
  const db = await getMongoDb();

  await db
    .collection<HeroContentDocument>("homeContent")
    .replaceOne({ key: HERO_KEY }, content, { upsert: true });

  return content;
};
