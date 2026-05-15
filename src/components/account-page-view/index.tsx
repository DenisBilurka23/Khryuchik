"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
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
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { updateAccountProfileClient } from "@/client-api/account";
import { getAccountPageMockData } from "@/data/account-page-mock";
import { splitName } from "@/utils/account-page";
import { UserOperationErrorReason } from "@/types/users";
import { EMAIL_PATTERN } from "@/utils/validation";

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

const getActiveSection = (searchParams: { get: (name: string) => string | null }) => {
  const sectionParam = searchParams.get("section");

  return accountSectionKeys.includes(sectionParam as SectionKey)
    ? (sectionParam as SectionKey)
    : "overview";
};

export const AccountPageView = ({
  locale,
  country,
  homeHref,
  user,
}: AccountPageViewProps) => {
  const t = useTranslations("accountPage");
  const tabs = t.raw("tabs") as string[];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const [profileUser, setProfileUser] = useState(user);
  const { firstName: initialFirstName, lastName: initialLastName } = splitName(user.name);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewSrc, setAvatarPreviewSrc] = useState(user.image ?? null);
  const avatarPreviewUrlRef = useRef<string | null>(null);
  const userName = profileUser.name || (locale === "ru" ? "Пользователь" : "User");
  const userEmail = profileUser.email || "email@example.com";
  const userInitial = userName.charAt(0).toUpperCase();
  const isEmailEditable = !(profileUser.authProviders ?? []).includes("google");
  const {
    orders,
    downloads,
    addresses,
    favorites,
    favoriteSuggestions,
    favoritesTotal,
  } = getAccountPageMockData(locale, t("delivered"), t("inDelivery"));
  const favoriteCategories = Array.from(new Set(favorites.map((item) => item.category)));
  const favoritesInStockCount = favorites.filter(
    (item) => item.availabilityTone === "in-stock",
  ).length;
  const sidebarItems = [
    { key: "overview" as const, label: tabs[0] ?? t("profile"), icon: <PersonOutlineIcon /> },
    { key: "orders" as const, label: t("orders"), icon: <ReceiptLongOutlinedIcon /> },
    { key: "books" as const, label: t("books"), icon: <MenuBookOutlinedIcon /> },
    { key: "addresses" as const, label: t("addresses"), icon: <LocationOnOutlinedIcon /> },
    { key: "favorites" as const, label: t("favorites"), icon: <FavoriteBorderIcon /> },
    { key: "settings" as const, label: t("settings"), icon: <SettingsOutlinedIcon /> },
    { key: "logout" as const, label: t("logout"), icon: <LogoutOutlinedIcon /> },
  ];
  const activeSection = getActiveSection(searchParams);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }
    };
  }, []);

  const clearAvatarPreviewUrl = () => {
    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = null;
    }
  };

  const beginProfileEditing = () => {
    setIsEditingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
  };

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

  const cancelProfileEditing = () => {
    const { firstName: nextFirstName, lastName: nextLastName } = splitName(profileUser.name);

    setFirstName(nextFirstName);
    setLastName(nextLastName);
    setEmail(profileUser.email ?? "");
    setPhone(profileUser.phone ?? "");
    clearAvatarPreviewUrl();
    setAvatarFile(null);
    setAvatarPreviewSrc(profileUser.image ?? null);
    setIsEditingProfile(false);
    setProfileError(null);
    setProfileSuccess(null);
  };

  const handleAvatarSelect = (file: File) => {
    clearAvatarPreviewUrl();

    const nextPreviewUrl = URL.createObjectURL(file);
    avatarPreviewUrlRef.current = nextPreviewUrl;
    setAvatarFile(file);
    setAvatarPreviewSrc(nextPreviewUrl);
  };

  const handleProfileSave = async (event?: SyntheticEvent) => {
    event?.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!normalizedName || !normalizedEmail) {
      setProfileError(t("missingFields"));
      setProfileSuccess(null);
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setProfileError(t("invalidEmail"));
      setProfileSuccess(null);
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    const response = await updateAccountProfileClient({
      name: normalizedName,
      email: normalizedEmail,
      phone,
      avatar: avatarFile,
    });

    setIsSavingProfile(false);

    if (!response.ok || !response.data?.user) {
      switch (response.data?.error ?? "unexpected_error") {
        case "invalid_email":
          setProfileError(t("invalidEmail"));
          break;
        case UserOperationErrorReason.EmailTaken:
          setProfileError(t("emailTaken"));
          break;
        case "missing_fields":
          setProfileError(t("missingFields"));
          break;
        case UserOperationErrorReason.EmailManagedByGoogle:
          setProfileError(t("emailManagedByGoogle"));
          break;
        default:
          setProfileError(t("unexpectedError"));
          break;
      }
      return;
    }

    setProfileUser(response.data.user);
    setFirstName(splitName(response.data.user.name).firstName);
    setLastName(splitName(response.data.user.name).lastName);
    setEmail(response.data.user.email);
    setPhone(response.data.user.phone);
    clearAvatarPreviewUrl();
    setAvatarFile(null);
    setAvatarPreviewSrc(response.data.user.image ?? null);
    setIsEditingProfile(false);
    setProfileSuccess(t("saved"));

    await update({
      user: {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone,
        authProviders: response.data.user.authProviders,
        image: response.data.user.image ?? null,
      },
    });
  };

  const handleSidebarClick = (key: SectionKey) => {
    if (key === activeSection) {
      return;
    }

    replaceSection(key);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection orders={orders} />;
      case "books":
        return <BooksSection locale={locale} downloads={downloads} />;
      case "addresses":
        return <AddressesSection addresses={addresses} />;
      case "favorites":
        return (
          <FavoritesSection
            locale={locale}
            favorites={favorites}
            favoriteSuggestions={favoriteSuggestions}
            favoriteCategories={favoriteCategories}
            favoritesInStockCount={favoritesInStockCount}
            favoritesTotal={favoritesTotal}
          />
        );
      case "settings":
        return (
          <SettingsSection
            locale={locale}
            country={country}
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            isEditingProfile={isEditingProfile}
            isSavingProfile={isSavingProfile}
            isEmailEditable={isEmailEditable}
            profileError={profileError}
            profileSuccess={profileSuccess}
            onBeginEdit={beginProfileEditing}
            onCancel={cancelProfileEditing}
            onSave={() => handleProfileSave()}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
          />
        );
      case "logout":
        return <LogoutSection onSignOut={() => signOut({ callbackUrl: homeHref })} />;
      case "overview":
      default:
        return (
          <OverviewSection
            locale={locale}
            orders={orders}
            downloads={downloads}
            addresses={addresses}
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            isEditingProfile={isEditingProfile}
            isSavingProfile={isSavingProfile}
            isEmailEditable={isEmailEditable}
            profileError={profileError}
            profileSuccess={profileSuccess}
            onBeginEdit={beginProfileEditing}
            onCancel={cancelProfileEditing}
            onSave={handleProfileSave}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
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
          <Card sx={{ border: "1px solid #F0DFC8", width: "100%", height: "100%" }}>
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
                    isEditingProfile ? <SaveOutlinedIcon /> : <EditOutlinedIcon />
                  }
                  sx={
                    isEditingProfile
                      ? { mt: 2.5 }
                      : { mt: 2.5, borderColor: "#E8D6BF", bgcolor: "#fff" }
                  }
                  onClick={isEditingProfile ? () => void handleProfileSave() : openProfileSettings}
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
            <Typography variant="h1" sx={{ mt: 1.5, fontSize: { xs: 34, md: 48 } }}>
              {t("welcome")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 680, lineHeight: 1.8 }}>
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