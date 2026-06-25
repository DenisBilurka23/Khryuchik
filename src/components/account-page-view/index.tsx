"use client";

import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import type { UserShippingAddress } from "@/types/users";

import {
  AddressesSection,
  BooksSection,
  FavoritesSection,
  LogoutSection,
  OrdersSection,
  OverviewSection,
  SettingsSection,
} from "./sections";
import { AccountAvatarUploadField, SidebarItem } from "./shared";
import { useProfileEditor } from "@/hooks/useProfileEditor";
import type { AccountPageViewProps, SectionKey } from "./types";

const accountSectionKeys: SectionKey[] = [
  "overview",
  "orders",
  "books",
  "addresses",
  "favorites",
  "settings",
  "logout",
];

const getActiveSection = (searchParams: {
  get: (name: string) => string | null;
}) => {
  const sectionParam = searchParams.get("section");

  return accountSectionKeys.includes(sectionParam as SectionKey)
    ? (sectionParam as SectionKey)
    : "overview";
};

export const AccountPageView = ({
  locale,
  country,
  availableLocales,
  homeHref,
  favoriteCategoryLabels,
  user,
  orders,
  downloads,
}: AccountPageViewProps) => {
  const t = useTranslations("accountPage");
  const tabs = t.raw("tabs") as string[];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    avatarPreviewSrc,
    userName,
    userEmail,
    userInitial,
    isEditingProfile,
    isSavingProfile,
    beginProfileEditing,
    handleAvatarSelect,
    handleProfileSave,
    profileEditorState,
  } = useProfileEditor(user, locale);

  const [shippingAddresses, setShippingAddresses] = useState(
    user.shippingAddresses ?? [],
  );
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(
    user.selectedShippingAddressId ?? user.shippingAddresses?.[0]?.id ?? null,
  );

  const activeSection = getActiveSection(searchParams);

  const overviewAddresses = [...shippingAddresses].sort((left, right) => {
    const leftSelected = left.id === selectedShippingAddressId ? 1 : 0;
    const rightSelected = right.id === selectedShippingAddressId ? 1 : 0;

    return rightSelected - leftSelected;
  });

  const sidebarItems = [
    {
      key: "overview" as const,
      label: tabs[0] ?? t("profile"),
      icon: <PersonOutlineIcon />,
    },
    {
      key: "orders" as const,
      label: t("orders"),
      icon: <ReceiptLongOutlinedIcon />,
    },
    {
      key: "books" as const,
      label: t("books"),
      icon: <MenuBookOutlinedIcon />,
    },
    {
      key: "addresses" as const,
      label: t("addresses"),
      icon: <LocationOnOutlinedIcon />,
    },
    {
      key: "favorites" as const,
      label: t("favorites"),
      icon: <FavoriteBorderIcon />,
    },
    {
      key: "settings" as const,
      label: t("settings"),
      icon: <SettingsOutlinedIcon />,
    },
    {
      key: "logout" as const,
      label: t("logout"),
      icon: <LogoutOutlinedIcon />,
    },
  ];

  const replaceSection = (nextSection: SectionKey) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextSection === "overview") {
      nextSearchParams.delete("section");
    } else {
      nextSearchParams.set("section", nextSection);
    }

    const nextSearch = nextSearchParams.toString();

    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
      scroll: false,
    });
  };

  const openProfileSettings = () => {
    replaceSection("settings");
    beginProfileEditing();
  };

  const handleSidebarClick = (key: SectionKey) => {
    if (key === activeSection) {
      return;
    }

    replaceSection(key);
  };

  const handleAddressesChange = (
    addresses: UserShippingAddress[],
    selectedId: string | null,
  ) => {
    setShippingAddresses(addresses);
    setSelectedShippingAddressId(selectedId);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection locale={locale} orders={orders} />;
      case "books":
        return <BooksSection locale={locale} downloads={downloads} />;
      case "addresses":
        return (
          <AddressesSection
            locale={locale}
            initialAddresses={user.shippingAddresses ?? []}
            initialSelectedId={
              user.selectedShippingAddressId ??
              user.shippingAddresses?.[0]?.id ??
              null
            }
            onAddressesChange={handleAddressesChange}
          />
        );
      case "favorites":
        return (
          <FavoritesSection
            locale={locale}
            categoryLabels={favoriteCategoryLabels}
          />
        );
      case "settings":
        return (
          <SettingsSection
            locale={locale}
            country={country}
            availableLocales={availableLocales}
            profileEditor={profileEditorState}
          />
        );
      case "logout":
        return (
          <LogoutSection onSignOut={() => signOut({ callbackUrl: homeHref })} />
        );
      case "overview":
      default:
        return (
          <OverviewSection
            locale={locale}
            orders={orders}
            downloads={downloads}
            addresses={overviewAddresses}
            selectedShippingAddressId={selectedShippingAddressId}
            profileEditor={profileEditorState}
          />
        );
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={3.5}>
        <Grid
          size={{ xs: 12, md: 4, lg: 3.5 }}
          order={{ xs: 1, md: 1 }}
          sx={{ display: "flex" }}
        >
          <Card
            sx={{ border: "1px solid #F0DFC8", width: "100%", height: "100%" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack alignItems="center" textAlign="center">
                <AccountAvatarUploadField
                  imageSrc={avatarPreviewSrc}
                  imageAlt={userName}
                  fallbackLabel={userInitial}
                  changeLabel={t("changeAvatar")}
                  replaceLabel={t("replaceAvatar")}
                  emptyLabel={t("avatarEmptyLabel")}
                  onRequestEditAction={openProfileSettings}
                  onFileSelectAction={handleAvatarSelect}
                />
                <Typography sx={{ mt: 2, fontSize: 24, fontWeight: 800 }}>
                  {userName}
                </Typography>
                <Typography color="text.secondary">{userEmail}</Typography>
                <Button
                  variant={isEditingProfile ? "contained" : "outlined"}
                  color={isEditingProfile ? undefined : "inherit"}
                  startIcon={
                    isEditingProfile ? (
                      <SaveOutlinedIcon />
                    ) : (
                      <EditOutlinedIcon />
                    )
                  }
                  sx={
                    isEditingProfile
                      ? { mt: 2.5 }
                      : { mt: 2.5, borderColor: "#E8D6BF", bgcolor: "#fff" }
                  }
                  onClick={
                    isEditingProfile
                      ? () => void handleProfileSave()
                      : openProfileSettings
                  }
                  loading={isSavingProfile}
                >
                  {isEditingProfile ? t("save") : t("editProfile")}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{ xs: 12, md: 8, lg: 8.5 }}
          order={{ xs: 3, md: 2 }}
          sx={{ display: "flex" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "32px",
              background:
                "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.45), transparent 28%), #fff",
              border: "1px solid #F0DFC8",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 13,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {t("account")}
            </Typography>
            <Typography
              variant="h1"
              sx={{ mt: 1.5, fontSize: { xs: 34, md: 48 } }}
            >
              {t("welcome")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 680, lineHeight: 1.8 }}
            >
              {t("lead")}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 3.5 }} order={{ xs: 2, md: 3 }}>
          <Card sx={{ border: "1px solid #F0DFC8" }}>
            <CardContent sx={{ p: 2 }}>
              <List sx={{ p: 0 }}>
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    active={activeSection === item.key}
                    onClick={() => handleSidebarClick(item.key)}
                  />
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 8.5 }} order={{ xs: 4, md: 4 }}>
          {renderSection()}
        </Grid>
      </Grid>
    </Box>
  );
};
