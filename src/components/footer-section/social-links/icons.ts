import type { SvgIconComponent } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PublicIcon from "@mui/icons-material/Public";

import { TikTokIcon } from "./tiktok-icon";

const iconByKey: Record<string, SvgIconComponent> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  email: MailOutlineIcon,
};

export const getSocialIcon = (key: string): SvgIconComponent =>
  iconByKey[key] ?? PublicIcon;
