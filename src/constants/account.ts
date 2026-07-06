import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { SvgIconProps } from "@mui/material";
import type { ComponentType } from "react";

import type { SectionKey } from "@/components/account-page-view/types";

export const accountSectionKeys = [
  "overview",
  "orders",
  "books",
  "addresses",
  "favorites",
  "settings",
  "logout",
] as const;

export type AccountSidebarItem = {
  key: SectionKey;
  tKey: string;
  Icon: ComponentType<SvgIconProps>;
};

export const accountSidebarConfig: AccountSidebarItem[] = [
  { key: "overview", tKey: "profile", Icon: PersonOutlineIcon },
  { key: "orders", tKey: "orders", Icon: ReceiptLongOutlinedIcon },
  { key: "books", tKey: "books", Icon: MenuBookOutlinedIcon },
  { key: "addresses", tKey: "addresses", Icon: LocationOnOutlinedIcon },
  { key: "favorites", tKey: "favorites", Icon: FavoriteBorderIcon },
  { key: "settings", tKey: "settings", Icon: SettingsOutlinedIcon },
  { key: "logout", tKey: "logout", Icon: LogoutOutlinedIcon },
];
