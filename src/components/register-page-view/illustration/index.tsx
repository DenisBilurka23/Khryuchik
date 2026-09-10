import Image from "next/image";

import signUpImage from "@/assets/KhryuchikSignUp.png";

import type { RegisterIllustrationProps } from "./types";

const artImageStyle = {
  display: "block",
  width: "100%",
  height: "auto",
  borderRadius: "var(--radius-plate)",
  boxShadow: "var(--shadow-floating)",
} as const;

export const RegisterIllustration = ({ alt }: RegisterIllustrationProps) => (
  <Image
    src={signUpImage}
    alt={alt}
    sizes="(max-width: 900px) 90vw, 520px"
    priority
    style={artImageStyle}
  />
);

export type { RegisterIllustrationProps } from "./types";
