import Image from "next/image";

import forgotPasswordImage from "@/assets/ForgotPasswordHero.png";

import type { ForgotPasswordIllustrationProps } from "./types";

const artImageStyle = {
  display: "block",
  width: "100%",
  height: "auto",
  borderRadius: "var(--radius-plate)",
  boxShadow: "var(--shadow-floating)",
} as const;

export const ForgotPasswordIllustration = ({
  alt,
}: ForgotPasswordIllustrationProps) => (
  <Image
    src={forgotPasswordImage}
    alt={alt}
    sizes="(max-width: 900px) 90vw, 520px"
    priority
    style={artImageStyle}
  />
);

export type { ForgotPasswordIllustrationProps } from "./types";
