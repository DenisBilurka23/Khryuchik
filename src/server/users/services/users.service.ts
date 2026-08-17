import "server-only";

import { ObjectId } from "mongodb";

import {
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from "@/server/auth/email-verification";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
} from "@/server/auth/reset-password";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import {
  EmailVerificationErrorReason,
  PasswordResetErrorReason,
  SignInErrorCode,
} from "@/types/auth";
import type {
  RegisterUserInput,
  SafeAuthUser,
  UpdateAdminUserInput,
  UpdateUserProfileInput,
  UserDocument,
  UserShippingAddressInput,
} from "@/types/users";
import { UserOperationErrorReason } from "@/types/users";
import { isIsoCountryCode, isPostalCodeValid } from "@/utils";
import { normalizeShippingAddressInput } from "@/utils/account-page";

import {
  addCredentialsToExistingUser,
  addGoogleToExistingUser,
  addUserShippingAddress,
  countAdminUsers,
  countUsers,
  createCredentialsUser,
  createGoogleUser,
  deleteUserById,
  findAllUsers,
  findUserByEmail,
  findUserById,
  setSelectedUserShippingAddress,
  setUserAdminByEmail,
  setUserEmailVerified,
  setUserPasswordHash,
  toCredentialsAuthUser,
  updateAdminUser,
  updateUserProfile,
} from "../repositories/users.repository";
import {
  findActiveEmailVerificationToken,
  markEmailVerificationTokenUsed,
  replaceEmailVerificationTokenForUser,
} from "../repositories/email-verification-tokens.repository";
import {
  findActivePasswordResetToken,
  markPasswordResetTokenUsed,
  replacePasswordResetTokenForUser,
} from "../repositories/password-reset-tokens.repository";

const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const EMAIL_VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

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

const issueEmailVerificationToken = async (userId: ObjectId) => {
  const token = createEmailVerificationToken();
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

  await replaceEmailVerificationTokenForUser(
    userId,
    hashEmailVerificationToken(token),
    expiresAt,
  );

  return token;
};

export const registerUser = async (input: RegisterUserInput) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser?.passwordHash) {
    return { ok: false as const, reason: UserOperationErrorReason.EmailTaken };
  }

  const passwordHash = await hashPassword(input.password);

  if (existingUser?._id) {
    const user = await addCredentialsToExistingUser(
      existingUser._id as ObjectId,
      {
        ...input,
        passwordHash,
      },
    );
    const verificationToken = existingUser.emailVerifiedAt
      ? null
      : await issueEmailVerificationToken(existingUser._id as ObjectId);

    return { ok: true as const, user, verificationToken };
  }

  const user = await createCredentialsUser({
    ...input,
    passwordHash,
  });
  const verificationToken = await issueEmailVerificationToken(
    new ObjectId(user.id),
  );

  return { ok: true as const, user, verificationToken };
};

export const authenticateCredentialsUser = async (
  email: string,
  password: string,
) => {
  const user = await findUserByEmail(email);

  if (!user?.passwordHash) {
    return { ok: false as const, reason: SignInErrorCode.InvalidCredentials };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return { ok: false as const, reason: SignInErrorCode.InvalidCredentials };
  }

  if (!user.emailVerifiedAt) {
    return { ok: false as const, reason: SignInErrorCode.EmailNotVerified };
  }

  return { ok: true as const, user: toCredentialsAuthUser(user) };
};

export const requestEmailVerification = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user?._id || user.emailVerifiedAt) {
    return null;
  }

  return issueEmailVerificationToken(user._id as ObjectId);
};

export const verifyEmailWithToken = async (token: string) => {
  const tokenHash = hashEmailVerificationToken(token);
  const verificationToken = await findActiveEmailVerificationToken(tokenHash);

  if (!verificationToken?._id) {
    return {
      ok: false as const,
      reason: EmailVerificationErrorReason.InvalidToken,
    };
  }

  const user = await findUserById(verificationToken.userId);

  if (!user?._id) {
    return {
      ok: false as const,
      reason: EmailVerificationErrorReason.InvalidToken,
    };
  }

  await setUserEmailVerified(user._id as ObjectId);
  await markEmailVerificationTokenUsed(verificationToken._id as ObjectId);

  return {
    ok: true as const,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

export const changeAccountUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const user = await findUserById(new ObjectId(userId));

  if (!user?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const hasCredentials = user.authProviders.includes("credentials");

  if (hasCredentials) {
    if (!user.passwordHash) {
      return { ok: false as const, reason: UserOperationErrorReason.NotFound };
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
      return {
        ok: false as const,
        reason: UserOperationErrorReason.WrongPassword,
      };
    }
  }

  const passwordHash = await hashPassword(newPassword);

  if (!hasCredentials) {
    await addCredentialsToExistingUser(user._id as ObjectId, {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email,
      phone: user.phone ?? "",
      passwordHash,
    });
  } else {
    await setUserPasswordHash(user._id as ObjectId, passwordHash);
  }

  return { ok: true as const };
};

export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user?._id) {
    return null;
  }

  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

  await replacePasswordResetTokenForUser(
    user._id as ObjectId,
    tokenHash,
    expiresAt,
  );

  return token;
};

export const resetPasswordWithToken = async (
  token: string,
  password: string,
) => {
  const tokenHash = hashPasswordResetToken(token);
  const resetToken = await findActivePasswordResetToken(tokenHash);

  if (!resetToken?._id) {
    return {
      ok: false as const,
      reason: PasswordResetErrorReason.InvalidToken,
    };
  }

  const user = await findUserById(resetToken.userId);

  if (!user?._id) {
    return {
      ok: false as const,
      reason: PasswordResetErrorReason.InvalidToken,
    };
  }

  const passwordHash = await hashPassword(password);

  await setUserPasswordHash(user._id as ObjectId, passwordHash);
  await markPasswordResetTokenUsed(resetToken._id as ObjectId);

  return { ok: true as const };
};

export const syncGoogleUser = async (input: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
}) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser?._id) {
    const user = await addGoogleToExistingUser(
      existingUser._id as ObjectId,
      input,
    );
    return { user, isNewUser: false };
  }

  const user = await createGoogleUser(input);
  return { user, isNewUser: true };
};

export const getAccountUserByEmail = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  return {
    id: (user._id as ObjectId).toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    isAdmin: Boolean(user.isAdmin),
    image: user.image ?? null,
    authProviders: user.authProviders,
    shippingAddresses: user.shippingAddresses ?? [],
    selectedShippingAddressId: user.selectedShippingAddressId ?? null,
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
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    isAdmin: Boolean(user.isAdmin),
    image: user.image ?? null,
    authProviders: user.authProviders,
    shippingAddresses: user.shippingAddresses ?? [],
    selectedShippingAddressId: user.selectedShippingAddressId ?? null,
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

  return {
    ok: true as const,
    previousAvatarObjectKey: existingUser.avatarObjectKey ?? null,
    nextAvatarObjectKey:
      "image" in input
        ? (input.avatarObjectKey ?? null)
        : (existingUser.avatarObjectKey ?? null),
    user,
  };
};

export const addAccountUserShippingAddress = async (
  userId: string,
  input: UserShippingAddressInput,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const normalizedInput = normalizeShippingAddressInput(input);

  if (
    !normalizedInput.title ||
    !normalizedInput.line1 ||
    !normalizedInput.city
  ) {
    return {
      ok: false as const,
      reason: UserOperationErrorReason.MissingFields,
    };
  }

  if (!isIsoCountryCode(normalizedInput.country)) {
    return {
      ok: false as const,
      reason: UserOperationErrorReason.InvalidCountry,
    };
  }

  if (!isPostalCodeValid(normalizedInput.postalCode ?? "")) {
    return {
      ok: false as const,
      reason: UserOperationErrorReason.InvalidPostalCode,
    };
  }

  const existingUser = await findUserById(new ObjectId(userId));

  if (!existingUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const result = await addUserShippingAddress(
    new ObjectId(userId),
    normalizedInput,
  );

  return {
    ok: true as const,
    address: result.address,
    user: result.user,
  };
};

export const selectAccountUserShippingAddress = async (
  userId: string,
  addressId: string,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const normalizedAddressId = addressId.trim();

  if (!normalizedAddressId) {
    return {
      ok: false as const,
      reason: UserOperationErrorReason.AddressNotFound,
    };
  }

  const existingUser = await findUserById(new ObjectId(userId));

  if (!existingUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  if (
    !(existingUser.shippingAddresses ?? []).some(
      (address) => address.id === normalizedAddressId,
    )
  ) {
    return {
      ok: false as const,
      reason: UserOperationErrorReason.AddressNotFound,
    };
  }

  const user = await setSelectedUserShippingAddress(
    new ObjectId(userId),
    normalizedAddressId,
  );

  return {
    ok: true as const,
    user,
  };
};

export const getAdminUsers = async (limit?: number) => {
  const users = await findAllUsers(limit);

  return users.map((user) => ({
    id: (user._id as ObjectId).toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
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
    firstName: user.firstName,
    lastName: user.lastName,
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
    return {
      ok: false as const,
      reason: UserOperationErrorReason.CannotDemoteSelf,
    };
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
      firstName: user.firstName,
      lastName: user.lastName,
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
    return {
      ok: false as const,
      reason: UserOperationErrorReason.CannotDeleteSelf,
    };
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
      firstName: deletedUser.firstName,
      lastName: deletedUser.lastName,
      isAdmin: Boolean(deletedUser.isAdmin),
    },
    avatarObjectKey: deletedUser.avatarObjectKey ?? null,
  };
};

export const deleteAccountUserSelf = async (
  userId: string,
  currentPassword: string,
) => {
  if (!ObjectId.isValid(userId)) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const user = await findUserById(new ObjectId(userId));

  if (!user?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  const hasCredentials = user.authProviders.includes("credentials");

  if (hasCredentials) {
    if (!user.passwordHash) {
      return { ok: false as const, reason: UserOperationErrorReason.NotFound };
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
      return {
        ok: false as const,
        reason: UserOperationErrorReason.WrongPassword,
      };
    }
  }

  if (user.isAdmin) {
    const { adminUsers } = await getAdminUsersStats();

    if (adminUsers <= 1) {
      return { ok: false as const, reason: UserOperationErrorReason.LastAdmin };
    }
  }

  const deletedUser = await deleteUserById(user._id as ObjectId);

  if (!deletedUser?._id) {
    return { ok: false as const, reason: UserOperationErrorReason.NotFound };
  }

  return {
    ok: true as const,
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
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: Boolean(user.isAdmin),
  };
};
