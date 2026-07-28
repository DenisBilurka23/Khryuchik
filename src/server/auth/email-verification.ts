import "server-only";

import { createHash, randomBytes } from "crypto";

export const createEmailVerificationToken = () =>
  randomBytes(32).toString("hex");

export const hashEmailVerificationToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
