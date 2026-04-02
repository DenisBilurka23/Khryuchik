import "server-only";

import { ObjectId } from "mongodb";

import { createPasswordResetToken, hashPasswordResetToken } from "@/server/auth/reset-password";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import type { RegisterUserInput, SafeAuthUser, UpdateUserProfileInput } from "@/types/users";

import {
  addGoogleToExistingUser,
  addCredentialsToExistingUser,
  createGoogleUser,
  createCredentialsUser,
  findUserByEmail,
  findUserById,
  setUserPasswordHash,
  toCredentialsAuthUser,
  updateUserProfile,
} from "../repositories/users.repository";
import {
  findActivePasswordResetToken,
  markPasswordResetTokenUsed,
  replacePasswordResetTokenForUser,
} from "../repositories/password-reset-tokens.repository";

const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

export const registerUser = async (input: RegisterUserInput) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser?.passwordHash) {
    return { ok: false as const, reason: "email_taken" as const };
  }

  const passwordHash = await hashPassword(input.password);

  if (existingUser?._id) {
    const user = await addCredentialsToExistingUser(existingUser._id as ObjectId, {
      ...input,
      passwordHash,
    });

    return { ok: true as const, user };
  }

  const user = await createCredentialsUser({
    ...input,
    passwordHash,
  });

  return { ok: true as const, user };
};

export const authenticateCredentialsUser = async (
  email: string,
  password: string,
) => {
  const user = await findUserByEmail(email);

  if (!user?.passwordHash) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return toCredentialsAuthUser(user);
};

export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user?._id) {
    return null;
  }

  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

  await replacePasswordResetTokenForUser(user._id as ObjectId, tokenHash, expiresAt);

  return token;
};

export const resetPasswordWithToken = async (
  token: string,
  password: string,
) => {
  const tokenHash = hashPasswordResetToken(token);
  const resetToken = await findActivePasswordResetToken(tokenHash);

  if (!resetToken?._id) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  const user = await findUserById(resetToken.userId);

  if (!user?._id) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  const passwordHash = await hashPassword(password);

  await setUserPasswordHash(user._id as ObjectId, passwordHash);
  await markPasswordResetTokenUsed(resetToken._id as ObjectId);

  return { ok: true as const };
};

export const syncGoogleUser = async (input: {
  email: string;
  name?: string | null;
  image?: string | null;
}) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser?._id) {
    return addGoogleToExistingUser(existingUser._id as ObjectId, input);
  }

  return createGoogleUser(input);
};

export const getAccountUserByEmail = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  return {
    id: (user._id as ObjectId).toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image ?? null,
    authProviders: user.authProviders,
  } satisfies SafeAuthUser;
};

export const getAccountUserById = async (userId: string) => {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const user = await findUserById(new ObjectId(userId));

  if (!user?._id) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image ?? null,
    authProviders: user.authProviders,
  } satisfies SafeAuthUser;
};

export const updateAccountUserProfile = async (
  userId: string,
  input: UpdateUserProfileInput,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: "not_found" as const };
  }

  const existingUser = await findUserById(new ObjectId(userId));

  if (!existingUser?._id) {
    return { ok: false as const, reason: "not_found" as const };
  }

  const nextEmail = input.email.trim().toLowerCase();
  const currentEmail = existingUser.email.trim().toLowerCase();
  const hasGoogleProvider = existingUser.authProviders.includes("google");

  if (hasGoogleProvider && nextEmail !== currentEmail) {
    return { ok: false as const, reason: "email_managed_by_google" as const };
  }

  if (nextEmail !== currentEmail) {
    const userWithSameEmail = await findUserByEmail(nextEmail);

    if (userWithSameEmail?._id && userWithSameEmail._id.toString() !== userId) {
      return { ok: false as const, reason: "email_taken" as const };
    }
  }

  const user = await updateUserProfile(new ObjectId(userId), {
    ...input,
    email: nextEmail,
  });

  return { ok: true as const, user };
};