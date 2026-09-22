import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import type { SvgIconProps } from "@mui/material";
import type { ComponentType } from "react";

import type { StorefrontNavItem } from "@/components/storefront-header/types";

export const headerAboutNavKeys = ["story", "faq", "contacts"] as const;

export type HeaderAboutNavKey = (typeof headerAboutNavKeys)[number];

export const navIconByKey: Record<
  StorefrontNavItem["key"],
  ComponentType<SvgIconProps>
> = {
  home: HomeOutlinedIcon,
  shop: StorefrontOutlinedIcon,
  story: AutoStoriesOutlinedIcon,
  entertainment: SmartDisplayOutlinedIcon,
  faq: LocalShippingOutlinedIcon,
  contacts: ChatBubbleOutlineOutlinedIcon,
};
