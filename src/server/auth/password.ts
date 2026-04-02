import "server-only";

import { compare, hash } from "bcryptjs";

const PASSWORD_SALT_ROUNDS = 12;

export const hashPassword = async (value: string) =>
  hash(value, PASSWORD_SALT_ROUNDS);

export const verifyPassword = async (
  value: string,
  passwordHash: string,
) => compare(value, passwordHash);