"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { updateAdminTimeZonePreferenceClient } from "@/client-api/admin-timezone";

import type { AdminTimeZoneSyncProps } from "./types";

export const AdminTimeZoneSync = ({ timeZone }: AdminTimeZoneSyncProps) => {
  const router = useRouter();

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!detected || detected === timeZone) {
      return;
    }

    let isActive = true;

    void updateAdminTimeZonePreferenceClient(detected)
      .then((response) => {
        if (isActive && response?.ok && response.data?.timeZone === detected) {
          router.refresh();
        }
      })
      .catch(() => null);

    return () => {
      isActive = false;
    };
  }, [router, timeZone]);

  return null;
};

export type { AdminTimeZoneSyncProps } from "./types";
