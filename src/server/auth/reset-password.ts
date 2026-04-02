import "server-only";

import { createHash, randomBytes } from "crypto";

export const createPasswordResetToken = () => randomBytes(32).toString("hex");

export const hashPasswordResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");