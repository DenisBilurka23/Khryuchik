import type { RegionCode } from "@/utils";

export type RegionMapProps = {
  region: RegionCode;
  city: string;
};

export type RegionMapPoint = {
  x: number;
  y: number;
};

export type RegionMapShape = {
  region: string;
  land: string;
  pin: RegionMapPoint;
  route: RegionMapPoint[];
  label: RegionMapPoint & { anchor: "start" | "end" };
};
