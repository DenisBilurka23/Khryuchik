"use client";

import { useSyncExternalStore } from "react";

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_PENDING_EVENT_LIMIT,
  CLARITY_CONSENT_DENIED,
  CLARITY_CONSENT_GRANTED,
} from "@/constants/analytics";
import type {
  AnalyticsConsentSnapshot,
  AnalyticsConsentStatus,
  AnalyticsEvent,
} from "@/types/analytics";
import { clearGoogleAnalyticsCookies, isAnalyticsConsentStatus } from "@/utils";

const serverSnapshot: AnalyticsConsentSnapshot = {
  ready: false,
  status: null,
  settingsOpen: false,
};

let snapshot: AnalyticsConsentSnapshot | null = null;
let storageListenerAttached = false;
let trackingState: "pending" | "enabled" | "disabled" = "pending";
let pendingEvents: AnalyticsEvent[] = [];
let clarityStopped = false;

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const readStoredStatus = (): AnalyticsConsentStatus | null => {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);

    return isAnalyticsConsentStatus(value) ? value : null;
  } catch {
    return null;
  }
};

const persistStatus = (status: AnalyticsConsentStatus) => {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, status);
  } catch {
    return;
  }
};

const ensureSnapshot = (): AnalyticsConsentSnapshot => {
  snapshot ??= { ready: true, status: readStoredStatus(), settingsOpen: false };

  return snapshot;
};

const setSnapshot = (nextSnapshot: AnalyticsConsentSnapshot) => {
  snapshot = nextSnapshot;
  emitChange();
};

const handleStorage = (event: StorageEvent) => {
  if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY) {
    return;
  }

  setSnapshot({ ...ensureSnapshot(), status: readStoredStatus() });
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  if (typeof window !== "undefined" && !storageListenerAttached) {
    window.addEventListener("storage", handleStorage);
    storageListenerAttached = true;
  }

  return () => {
    listeners.delete(listener);

    if (
      typeof window !== "undefined" &&
      storageListenerAttached &&
      listeners.size === 0
    ) {
      window.removeEventListener("storage", handleStorage);
      storageListenerAttached = false;
    }
  };
};

const getServerSnapshot = (): AnalyticsConsentSnapshot => serverSnapshot;

export const setAnalyticsConsent = (status: AnalyticsConsentStatus) => {
  persistStatus(status);
  setSnapshot({ ready: true, status, settingsOpen: false });
};

export const openAnalyticsConsentSettings = () => {
  setSnapshot({ ...ensureSnapshot(), settingsOpen: true });
};

export const useAnalyticsConsent = (): AnalyticsConsentSnapshot =>
  useSyncExternalStore(subscribe, ensureSnapshot, getServerSnapshot);

const sendEvent = ({ name, params }: AnalyticsEvent) => {
  window.gtag?.("event", name, params);
};

export const trackAnalyticsEvent = (event: AnalyticsEvent) => {
  if (typeof window === "undefined" || trackingState === "disabled") {
    return;
  }

  if (trackingState === "enabled") {
    sendEvent(event);
    return;
  }

  if (pendingEvents.length < ANALYTICS_PENDING_EVENT_LIMIT) {
    pendingEvents.push(event);
  }
};

export const setGoogleAnalyticsEnabled = (
  measurementId: string,
  enabled: boolean,
) => {
  const events = pendingEvents;

  window[`ga-disable-${measurementId}`] = !enabled;
  trackingState = enabled ? "enabled" : "disabled";
  pendingEvents = [];

  if (enabled) {
    events.forEach(sendEvent);
    return;
  }

  clearGoogleAnalyticsCookies();
};

export const setClarityEnabled = (enabled: boolean) => {
  const { clarity } = window;

  if (!clarity) {
    return;
  }

  if (!enabled) {
    clarity("consentv2", CLARITY_CONSENT_DENIED);
    clarity("stop");
    clarityStopped = true;
    return;
  }

  if (clarityStopped) {
    clarity("consentv2", CLARITY_CONSENT_GRANTED);
    clarity("start");
    clarityStopped = false;
  }
};
