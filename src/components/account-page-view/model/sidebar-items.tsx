import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import type { AccountPageDictionary } from "@/i18n/types";

import type { AccountSidebarItem } from "../types";

export const getAccountSidebarItems = (
  dictionary: AccountPageDictionary,
): AccountSidebarItem[] => {
  return [
    { key: "overview", label: dictionary.tabs[0], icon: <PersonOutlineIcon /> },
    { key: "orders", label: dictionary.orders, icon: <ReceiptLongOutlinedIcon /> },
    { key: "books", label: dictionary.books, icon: <MenuBookOutlinedIcon /> },
    {
      key: "addresses",
      label: dictionary.addresses,
      icon: <LocationOnOutlinedIcon />,
    },
    { key: "favorites", label: dictionary.favorites, icon: <FavoriteBorderIcon /> },
    { key: "settings", label: dictionary.settings, icon: <SettingsOutlinedIcon /> },
    { key: "logout", label: dictionary.logout, icon: <LogoutOutlinedIcon /> },
  ];
};