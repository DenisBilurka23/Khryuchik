import "server-only";

import { ObjectId } from "mongodb";

import { createPasswordResetToken, hashPasswordResetToken } from "@/server/auth/reset-password";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { PasswordResetErrorReason } from "@/types/auth";
import type {
  RegisterUserInput,
  SafeAuthUser,
  UpdateAdminUserInput,
  UpdateUserProfileInput,
  UserDocument,
} from "@/types/users";
import { UserOperationErrorReason } from "@/types/users";

import {
  countAdminUsers,
  countUsers,
  deleteUserById,
  addGoogleToExistingUser,
  addCredentialsToExistingUser,
  createGoogleUser,
  createCredentialsUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  setUserAdminByEmail,
  setUserPasswordHash,
  toCredentialsAuthUser,
  updateAdminUser,
  updateUserProfile,
} from "../repositories/users.repository";
import {
  findActivePasswordResetToken,
  markPasswordResetTokenUsed,
  replacePasswordResetTokenForUser,
} from "../repositories/password-reset-tokens.repository";

const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

const resolveNextUpdatableEmail = async ({
  userId,
  existingUser,
  inputEmail,
}: {
  userId: string;
  existingUser: UserDocument;
  inputEmail: string;
}): Promise<
  | {
      ok: false;
      reason:
        | UserOperationErrorReason.EmailManagedByGoogle
        | UserOperationErrorReason.EmailTaken;
    }
  | {
      ok: true;
      nextEmail: string;
    }
> => {
  const nextEmail = inputEmail.trim().toLowerCase();
  const currentEmail = existingUser.email.trim().toLowerCase();
  const hasGoogleProvider = existingUser.authProviders.includes("google");

  if (hasGoogleProvider && nextEmail !== currentEmail) {
    return { ok: false, reason: UserOperationErrorReason.EmailManagedByGoogle };
  }

  if (nextEmail !== currentEmail) {
    const userWithSameEmail = await findUserByEmail(nextEmail);

    if (userWithSameEmail?._id && userWithSameEmail._id.toString() !== userId) {
      return { ok: false, reason: UserOperationErrorReason.EmailTaken };
    }
  }

  return { ok: true, nextEmail };
};

export const registerUser = async (input: RegisterUserInput) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser?.passwordHash) {
    return { ok: false as const, reason: UserOperationErrorReason.EmailTaken };
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
    return { ok: false as const, reason: PasswordResetErrorReason.InvalidToken };
  }

  const user = await findUserById(resetToken.userId);

  if (!user?._id) {
    return { ok: false as const, reason: PasswordResetErrorReason.InvalidToken };
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
    isAdmin: Boolean(user.isAdmin),
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
    isAdmin: Boolean(user.isAdmin),
    image: user.image ?? null,
    authProviders: user.authProviders,
  } satisfies SafeAuthUser;
};

export const updateAccountUserProfile = async (
  userId: string,
  input: UpdateUserProfileInput,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const existingUser = await findUserById(new ObjectId(userId));

  if (!existingUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const emailResolution = await resolveNextUpdatableEmail({
    userId,
    existingUser,
    inputEmail: input.email,
  });

  if (!emailResolution.ok) {
    return emailResolution;
  }

  const { nextEmail } = emailResolution;

  const user = await updateUserProfile(new ObjectId(userId), {
    ...input,
    email: nextEmail,
  });

  return { ok: true as const, user };
};

export const getAdminUsers = async (limit?: number) => {
  const users = await findAllUsers(limit);

  return users.map((user) => ({
    id: (user._id as ObjectId).toString(),
    email: user.email,
    name: user.name,
    phone: user.phone,
    isAdmin: Boolean(user.isAdmin),
    image: user.image ?? null,
    authProviders: user.authProviders,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
};

export const getAdminUserEditorData = async (userId: string) => {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const user = await findUserById(new ObjectId(userId));

  if (!user?._id) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    phone: user.phone,
    isAdmin: Boolean(user.isAdmin),
    image: user.image ?? null,
    authProviders: user.authProviders,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const updateAdminUserAccount = async (
  actorUserId: string,
  userId: string,
  input: UpdateAdminUserInput,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const existingUser = await findUserById(new ObjectId(userId));

  if (!existingUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  if (actorUserId === userId && !input.isAdmin) {
    return { ok: false as const, reason: UserOperationErrorReason.CannotDemoteSelf };
  }

  if (existingUser.isAdmin && !input.isAdmin) {
    const { adminUsers } = await getAdminUsersStats();

    if (adminUsers <= 1) {
      return { ok: false as const, reason: UserOperationErrorReason.LastAdmin };
    }
  }

  const emailResolution = await resolveNextUpdatableEmail({
    userId,
    existingUser,
    inputEmail: input.email,
  });

  if (!emailResolution.ok) {
    return emailResolution;
  }

  const { nextEmail } = emailResolution;

  const user = await updateAdminUser(new ObjectId(userId), {
    ...input,
    email: nextEmail,
  });

  return {
    ok: true as const,
    previousAvatarObjectKey: existingUser.avatarObjectKey ?? null,
    nextAvatarObjectKey: user.avatarObjectKey ?? null,
    user: {
      id: user._id?.toString() ?? userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      isAdmin: Boolean(user.isAdmin),
      image: user.image ?? null,
      authProviders: user.authProviders,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  };
};

export const deleteAdminUserAccount = async (
  actorUserId: string,
  userId: string,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  if (actorUserId === userId) {
    return { ok: false as const, reason: UserOperationErrorReason.CannotDeleteSelf };
  }

  const existingUser = await findUserById(new ObjectId(userId));

  if (!existingUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  if (existingUser.isAdmin) {
    const { adminUsers } = await getAdminUsersStats();

    if (adminUsers <= 1) {
      return { ok: false as const, reason: UserOperationErrorReason.LastAdmin };
    }
  }

  const deletedUser = await deleteUserById(new ObjectId(userId));

  if (!deletedUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  return {
    ok: true as const,
    user: {
      id: deletedUser._id.toString(),
      email: deletedUser.email,
      name: deletedUser.name,
      isAdmin: Boolean(deletedUser.isAdmin),
    },
    avatarObjectKey: deletedUser.avatarObjectKey ?? null,
  };
};

export const getAdminUsersStats = async () => {
  const [totalUsers, adminUsers] = await Promise.all([
    countUsers(),
    countAdminUsers(),
  ]);

  return {
    totalUsers,
    adminUsers,
  };
};

export const grantAdminRoleToUserByEmail = async (email: string) => {
  const user = await setUserAdminByEmail(email, true);

  if (!user?._id) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    isAdmin: Boolean(user.isAdmin),
  };
};