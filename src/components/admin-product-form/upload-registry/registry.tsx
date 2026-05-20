"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

export type AdminProductUploadRunner = () => Promise<void>;

type AdminProductUploadRegistryValue = {
  register: (runner: AdminProductUploadRunner) => () => void;
  runAll: () => Promise<void>;
};

const AdminProductUploadRegistryContext =
  createContext<AdminProductUploadRegistryValue | null>(null);

export const AdminProductUploadRegistryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const runnersRef = useRef<Set<AdminProductUploadRunner>>(new Set());

  const register = useCallback((runner: AdminProductUploadRunner) => {
    runnersRef.current.add(runner);

    return () => {
      runnersRef.current.delete(runner);
    };
  }, []);

  const runAll = useCallback(async () => {
    const runners = Array.from(runnersRef.current);

    await Promise.all(runners.map((runner) => runner()));
  }, []);

  const value = useMemo(() => ({ register, runAll }), [register, runAll]);

  return (
    <AdminProductUploadRegistryContext.Provider value={value}>
      {children}
    </AdminProductUploadRegistryContext.Provider>
  );
};

export const useAdminProductUploadRegistry = () => {
  const value = useContext(AdminProductUploadRegistryContext);

  if (!value) {
    throw new Error(
      "useAdminProductUploadRegistry must be used within AdminProductUploadRegistryProvider",
    );
  }

  return value;
};
