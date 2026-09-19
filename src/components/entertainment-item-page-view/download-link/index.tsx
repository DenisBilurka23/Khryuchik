"use client";

import { useEntertainmentView } from "@/hooks/useEntertainmentView";

import { ArrowLink } from "@/components/arrow-link";
import type { EntertainmentDownloadLinkProps } from "../types";

export const EntertainmentDownloadLink = ({
  slug,
  href,
  label,
  sx,
}: EntertainmentDownloadLinkProps) => {
  const registerView = useEntertainmentView(slug);

  return <ArrowLink href={href} label={label} onClick={registerView} sx={sx} />;
};
