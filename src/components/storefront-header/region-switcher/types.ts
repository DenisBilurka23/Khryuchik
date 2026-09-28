import type { RegionCode } from "@/utils";
import type { SxProps, Theme } from "@mui/material/styles";

export type RegionSwitcherProps = {
  region: RegionCode;
  availableRegions: RegionCode[];
  label?: string;
  sx?: SxProps<Theme>;
};
