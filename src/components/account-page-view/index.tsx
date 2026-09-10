"use client";

import { useEffect, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import type { UserShippingAddress } from "@/types/users";

import { AccountHero } from "./hero";
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
import { useShippingAddressSelection } from "@/hooks/useShippingAddressSelection";
import { accountSectionKeys, accountSidebarConfig } from "@/constants/account";
import { secondaryButtonSx } from "@/theme/sx";
import type { AccountPageViewProps, SectionKey } from "./types";

const asideCardSx = {
  width: "100%",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-panel)",
  boxShadow: "var(--shadow-panel)",
} as const;

const profileCardSx = {
  ...asideCardSx,
  height: "100%",
} as const;

const sidebarCardSx = asideCardSx;

const userNameSx = {
  mt: 2,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.2,
} as const;

const editProfileSx = {
  ...secondaryButtonSx,
  mt: 2.5,
} as const;

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
  availableCountries,
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

  const sidebarItems = accountSidebarConfig.map(({ key, tKey, Icon }) => ({
    key,
    label: key === "overview" ? (tabs[0] ?? t("profile")) : t(tKey),
    icon: <Icon />,
  }));

  const replaceSection = (
    nextSection: SectionKey,
    options?: { action?: string },
  ) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextSection === "overview") {
      nextSearchParams.delete("section");
    } else {
      nextSearchParams.set("section", nextSection);
    }

    if (options?.action) {
      nextSearchParams.set("action", options.action);
    } else {
      nextSearchParams.delete("action");
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

  const handleAddAddressFromOverview = () => {
    replaceSection("addresses", { action: "add" });
  };

  const shouldAutoOpenAddAddress =
    activeSection === "addresses" && searchParams.get("action") === "add";

  useEffect(() => {
    if (searchParams.get("action") !== "add") {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("action");
    const nextSearch = nextSearchParams.toString();

    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
      scroll: false,
    });
  }, [searchParams, pathname, router]);

  const handleAddressesChange = (
    addresses: UserShippingAddress[],
    selectedId: string | null,
  ) => {
    setShippingAddresses(addresses);
    setSelectedShippingAddressId(selectedId);
  };

  const { selectingAddressId, selectAddress } = useShippingAddressSelection({
    onAddressesChange: handleAddressesChange,
  });

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
            initialAddresses={shippingAddresses}
            initialSelectedId={selectedShippingAddressId}
            onAddressesChange={handleAddressesChange}
            autoOpenAddForm={shouldAutoOpenAddAddress}
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
            availableCountries={availableCountries}
            profileEditor={profileEditorState}
            authProviders={user.authProviders ?? []}
            userEmail={user.email ?? ""}
            onAccountDeletedAction={() => signOut({ callbackUrl: homeHref })}
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
            selectingAddressId={selectingAddressId}
            onAddAddress={handleAddAddressFromOverview}
            onSelectAddress={(addressId) =>
              void selectAddress(addressId, selectedShippingAddressId)
            }
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
          <Card sx={profileCardSx}>
            <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
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
                <Typography sx={userNameSx}>{userName}</Typography>
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
                  sx={isEditingProfile ? { mt: 2.5 } : editProfileSx}
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
          <AccountHero
            eyebrow={t("account")}
            title={t("welcome")}
            lead={t("lead")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 3.5 }} order={{ xs: 2, md: 3 }}>
          <Card sx={sidebarCardSx}>
            <CardContent sx={{ p: 1.5 }}>
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
