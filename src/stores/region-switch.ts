"use client";

import { useSyncExternalStore } from "react";

let isSwitching = false;

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => isSwitching;

const getServerSnapshot = () => false;

export const setRegionSwitching = (next: boolean) => {
  if (next === isSwitching) {
    return;
  }

  isSwitching = next;
  listeners.forEach((listener) => listener());
};

export const useIsRegionSwitching = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
