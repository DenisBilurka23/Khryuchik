"use client";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import type { ReactNode } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { usePathname } from "next/navigation";

import type { AdminNavItem, AdminViewKey } from "@/types/admin";

const iconByKey: Record<AdminViewKey, ReactNode> = {
  dashboard: <DashboardOutlinedIcon />,
  products: <Inventory2OutlinedIcon />,
  categories: <CategoryOutlinedIcon />,
  orders: <ShoppingBagOutlinedIcon />,
  customers: <PeopleAltOutlinedIcon />,
  shipping: <ShoppingBagOutlinedIcon />,
  promocodes: <CategoryOutlinedIcon />,
  settings: <DashboardOutlinedIcon />,
};

type AdminNavigationProps = {
  items: AdminNavItem[];
};

export const AdminNavigation = ({ items }: AdminNavigationProps) => {
  const pathname = usePathname();

  return (
    <List sx={{ p: 0 }}>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <ListItemButton
            key={item.key}
            href={item.href}
            sx={{
              borderRadius: "18px",
              mb: 1,
              bgcolor: isActive ? "#FCE5EA" : "#fff",
              border: `1px solid ${isActive ? "#F3B7C3" : "#F0DFC8"}`,
              py: 1.25,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
              {iconByKey[item.key]}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  fontWeight: isActive ? 800 : 600,
                },
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};