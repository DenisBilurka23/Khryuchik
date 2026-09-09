import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import type { SidebarItemProps } from "./types";

export const SidebarItem = ({
  icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: "var(--radius-plate)",
          mb: 1,
          bgcolor: active ? "var(--color-accent-tint)" : "var(--color-white)",
          border: `1px solid ${active ? "var(--color-border-rose)" : "var(--color-border)"}`,
          py: 1.25,
        }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          slotProps={{
            primary: {
              sx: { fontWeight: active ? 800 : 600 },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export type { SidebarItemProps } from "./types";
