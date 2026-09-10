import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import type { SidebarItemProps } from "./types";

const buttonSx = {
  borderRadius: "var(--radius-card)",
  mb: 1,
  py: 1.25,
  transition: "background-color 0.2s ease, border-color 0.2s ease",
} as const;

const activeSx = {
  ...buttonSx,
  bgcolor: "var(--color-accent-pale)",
  border: "1px solid var(--color-border-rose)",
  color: "var(--color-action)",
  "&:hover": { bgcolor: "var(--color-accent-pale)" },
} as const;

const inactiveSx = {
  ...buttonSx,
  bgcolor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  "&:hover": { bgcolor: "var(--color-accent-pale)" },
} as const;

export const SidebarItem = ({
  icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} sx={active ? activeSx : inactiveSx}>
        <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          slotProps={{
            primary: {
              sx: { fontWeight: active ? 700 : 600, color: "inherit" },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export type { SidebarItemProps } from "./types";
