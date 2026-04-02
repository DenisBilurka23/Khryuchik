import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import type { SidebarItemProps } from "./types";

export const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: "18px",
          mb: 1,
          bgcolor: active ? "#FCE5EA" : "#fff",
          border: `1px solid ${active ? "#F3B7C3" : "#F0DFC8"}`,
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