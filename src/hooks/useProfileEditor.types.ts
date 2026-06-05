import type { SyntheticEvent } from "react";

import type { AccountPageUser } from "@/components/account-page-view/types";

export type ProfileEditorState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isEditingProfile: boolean;
  isSavingProfile: boolean;
  isEmailEditable: boolean;
  profileError: string | null;
  profileSuccess: string | null;
  onBeginEdit: () => void;
  onCancel: () => void;
  onSave: (event?: SyntheticEvent) => Promise<void>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};

export type UseProfileEditorReturn = {
  profileUser: AccountPageUser;
  avatarPreviewSrc: string | null;
  userName: string;
  userEmail: string;
  userInitial: string;
  isEditingProfile: boolean;
  isSavingProfile: boolean;
  beginProfileEditing: () => void;
  handleAvatarSelect: (file: File) => void;
  handleProfileSave: (event?: SyntheticEvent) => Promise<void>;
  profileEditorState: ProfileEditorState;
};
