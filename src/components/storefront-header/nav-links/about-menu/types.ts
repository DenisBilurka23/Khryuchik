import type { SxProps, Theme } from "@mui/material/styles";

import type { HeaderAboutNavItem } from "../types";

export type HeaderAboutMenuProps = {
  items: HeaderAboutNavItem[];
  sx?: SxProps<Theme>;
};
