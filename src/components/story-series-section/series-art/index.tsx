import Image from "next/image";

import adventuresImage from "@/assets/KhryuchikAdventures.png";
import littleImage from "@/assets/KhryuchikWhenHeWasLittle.png";
import { BOOK_SERIES } from "@/constants/catalog";

import type { SeriesArtProps } from "./types";

export const SeriesArt = ({ series, alt }: SeriesArtProps) => {
  return (
    <Image
      src={series === BOOK_SERIES.travel ? adventuresImage : littleImage}
      alt={alt}
      sizes="(max-width: 899px) 100vw, 640px"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 45%",
      }}
    />
  );
};

export type { SeriesArtProps } from "./types";
