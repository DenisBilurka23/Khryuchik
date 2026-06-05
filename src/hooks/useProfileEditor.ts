import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { updateAccountProfileClient } from "@/client-api/account";
import type { Locale } from "@/i18n/config";
import { UserOperationErrorReason } from "@/types/users";
import { splitName } from "@/utils/account-page";
import { EMAIL_PATTERN } from "@/utils/validation";

import type { AccountPageUser } from "@/components/account-page-view/types";
import type { ProfileEditorState, UseProfileEditorReturn } from "./useProfileEditor.types";

export type { ProfileEditorState, UseProfileEditorReturn } from "./useProfileEditor.types";

export const useProfileEditor = (
  user: AccountPageUser,
  locale: Locale,
): UseProfileEditorReturn => {
  const t = useTranslations("accountPage");
  const { update } = useSession();

  const { firstName: initialFirstName, lastName: initialLastName } = splitName(user.name);
  const [profileUser, setProfileUser] = useState(user);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewSrc, setAvatarPreviewSrc] = useState(user.image ?? null);
  const avatarPreviewUrlRef = useRef<string | null>(null);

  const userName = profileUser.name || (locale === "ru" ? "Пользователь" : "User");
  const userEmail = profileUser.email || "email@example.com";
  const userInitial = userName.charAt(0).toUpperCase();
  const isEmailEditable = !(profileUser.authProviders ?? []).includes("google");

  useEffect(() => {
    return () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }
    };
  }, []);

  const clearAvatarPreviewUrl = () => {
    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = null;
    }
  };

  const beginProfileEditing = () => {
    setIsEditingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
  };

  const cancelProfileEditing = () => {
    const { firstName: nextFirstName, lastName: nextLastName } = splitName(profileUser.name);

    setFirstName(nextFirstName);
    setLastName(nextLastName);
    setEmail(profileUser.email ?? "");
    setPhone(profileUser.phone ?? "");
    clearAvatarPreviewUrl();
    setAvatarFile(null);
    setAvatarPreviewSrc(profileUser.image ?? null);
    setIsEditingProfile(false);
    setProfileError(null);
    setProfileSuccess(null);
  };

  const handleAvatarSelect = (file: File) => {
    clearAvatarPreviewUrl();
    const nextPreviewUrl = URL.createObjectURL(file);
    avatarPreviewUrlRef.current = nextPreviewUrl;
    setAvatarFile(file);
    setAvatarPreviewSrc(nextPreviewUrl);
  };

  const handleProfileSave = async (event?: SyntheticEvent) => {
    event?.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!normalizedName || !normalizedEmail) {
      setProfileError(t("missingFields"));
      setProfileSuccess(null);
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setProfileError(t("invalidEmail"));
      setProfileSuccess(null);
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    const response = await updateAccountProfileClient({
      name: normalizedName,
      email: normalizedEmail,
      phone,
      avatar: avatarFile,
    });

    setIsSavingProfile(false);

    if (!response.ok || !response.data?.user) {
      switch (response.data?.error ?? "unexpected_error") {
        case "invalid_email":
          setProfileError(t("invalidEmail"));
          break;
        case UserOperationErrorReason.EmailTaken:
          setProfileError(t("emailTaken"));
          break;
        case "missing_fields":
          setProfileError(t("missingFields"));
          break;
        case UserOperationErrorReason.EmailManagedByGoogle:
          setProfileError(t("emailManagedByGoogle"));
          break;
        default:
          setProfileError(t("unexpectedError"));
          break;
      }
      return;
    }

    const savedUser = response.data.user;

    setProfileUser(savedUser);
    setFirstName(splitName(savedUser.name).firstName);
    setLastName(splitName(savedUser.name).lastName);
    setEmail(savedUser.email);
    setPhone(savedUser.phone);
    clearAvatarPreviewUrl();
    setAvatarFile(null);
    setAvatarPreviewSrc(savedUser.image ?? null);
    setIsEditingProfile(false);
    setProfileSuccess(t("saved"));

    await update({
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        authProviders: savedUser.authProviders,
        image: savedUser.image ?? null,
      },
    });
  };

  const profileEditorState: ProfileEditorState = {
    firstName,
    lastName,
    email,
    phone,
    isEditingProfile,
    isSavingProfile,
    isEmailEditable,
    profileError,
    profileSuccess,
    onBeginEdit: beginProfileEditing,
    onCancel: cancelProfileEditing,
    onSave: handleProfileSave,
    onFirstNameChange: setFirstName,
    onLastNameChange: setLastName,
    onEmailChange: setEmail,
    onPhoneChange: setPhone,
  };

  return {
    profileUser,
    avatarPreviewSrc,
    userName,
    userEmail,
    userInitial,
    isEditingProfile,
    isSavingProfile,
    beginProfileEditing,
    handleAvatarSelect,
    handleProfileSave,
    profileEditorState,
  };
};
