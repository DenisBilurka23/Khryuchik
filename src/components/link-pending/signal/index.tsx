"use client";

import { useLinkStatus } from "next/link";
import { useContext, useEffect } from "react";

import { LinkPendingContext } from "../context";

export const LinkPendingSignal = () => {
  const { pending } = useLinkStatus();
  const { setPending } = useContext(LinkPendingContext);

  useEffect(() => {
    setPending(pending);
  }, [pending, setPending]);

  return null;
};
