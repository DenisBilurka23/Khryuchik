"use client";

import { type SyntheticEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  changeAccountPasswordClient,
  deleteAccountClient,
  getAccountNewsletterStatusClient,
  setAccountNewsletterSubscriptionClient,
} from "@/client-api/account";
import { requestPasswordResetClient } from "@/client-api/auth";
import { AuthInputErrorCode } from "@/types/auth";
import { UserOperationErrorReason } from "@/types/users";

import type {
  UseAccountSettingsFormParams,
  UseAccountSettingsFormResult,
} from "./useAccountSettingsForm.types";

export const useAccountSettingsForm = ({
  locale,
  userEmail,
  onAccountDeletedAction,
}: UseAccountSettingsFormParams): UseAccountSettingsFormResult => {
  const t = useTranslations("accountPage");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(
    null,
  );

  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isTogglingSubscription, setIsTogglingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isActive = true;

    void getAccountNewsletterStatusClient().then((response) => {
      if (isActive && response.ok) {
        setIsSubscribed(Boolean(response.data?.subscribed));
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const toggleSubscription = async (nextSubscribed: boolean) => {
    setIsTogglingSubscription(true);
    setSubscriptionError(null);
    setIsSubscribed(nextSubscribed);

    const response = await setAccountNewsletterSubscriptionClient(
      nextSubscribed,
      locale,
    );

    setIsTogglingSubscription(false);

    if (!response.ok) {
      setIsSubscribed(!nextSubscribed);
      setSubscriptionError(t("notificationsUpdateError"));
    }
  };

  const requestReset = async () => {
    if (isSendingReset || resetSent) return;
    setIsSendingReset(true);
    await requestPasswordResetClient(userEmail, locale);
    setIsSendingReset(false);
    setResetSent(true);
  };

  const submitPassword = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== repeatPassword) {
      setErrorMessage(t("securityPasswordMismatch"));
      return;
    }

    setIsSaving(true);

    const response = await changeAccountPasswordClient({
      currentPassword,
      newPassword,
    });

    setIsSaving(false);

    if (!response.ok) {
      const error = response.data?.error;

      if (error === UserOperationErrorReason.WrongPassword) {
        setErrorMessage(t("securityWrongPassword"));
      } else if (error === AuthInputErrorCode.PasswordTooShort) {
        setErrorMessage(t("securityPasswordTooShort"));
      } else {
        setErrorMessage(t("securityUnexpectedError"));
      }

      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");
    setSuccessMessage(t("securitySaveSuccess"));
  };

  const confirmDeletion = async () => {
    setDeleteErrorMessage(null);

    const response = await deleteAccountClient({
      currentPassword: deletePassword,
    });

    if (!response.ok) {
      const error = response.data?.error;

      if (error === UserOperationErrorReason.WrongPassword) {
        setDeleteErrorMessage(t("deleteAccountWrongPassword"));
      } else if (error === UserOperationErrorReason.LastAdmin) {
        setDeleteErrorMessage(t("deleteAccountLastAdmin"));
      } else {
        setDeleteErrorMessage(t("deleteAccountUnexpectedError"));
      }

      return false;
    }

    onAccountDeletedAction();
  };

  const changeDeletePassword = (value: string) => {
    setDeletePassword(value);
    setDeleteErrorMessage(null);
  };

  return {
    password: {
      currentPassword,
      newPassword,
      repeatPassword,
      isSaving,
      isSendingReset,
      resetSent,
      errorMessage,
      successMessage,
      setCurrentPassword,
      setNewPassword,
      setRepeatPassword,
      requestReset,
      submit: submitPassword,
    },
    deletion: {
      password: deletePassword,
      errorMessage: deleteErrorMessage,
      setPassword: changeDeletePassword,
      confirm: confirmDeletion,
    },
    newsletter: {
      isSubscribed,
      isToggling: isTogglingSubscription,
      errorMessage: subscriptionError,
      toggle: toggleSubscription,
    },
  };
};
