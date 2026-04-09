"use client";

import { useState, type SyntheticEvent } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";

import { updateAccountProfileClient } from "@/client-api/account";
import { getAccountPageMockData } from "@/data/account-page-mock";
import {
  getProfileErrorMessage,
  splitName,
  tabSections,
} from "@/utils/account-page";
import { EMAIL_PATTERN } from "@/utils/validation";

import { getAccountSidebarItems } from "./model";
import {
  AddressesSection,
  BooksSection,
  FavoritesSection,
  LogoutSection,
  OrdersSection,
  OverviewSection,
  SettingsSection,
} from "./sections";
import { SidebarItem } from "./shared";
import type { AccountPageViewProps, SectionKey } from "./types";

export const AccountPageView = ({
  locale,
  dictionary,
  homeHref,
  user,
}: AccountPageViewProps) => {
  const { update } = useSession();
  const copy = dictionary;
  const [tab, setTab] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
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
  } = getAccountPageMockData(locale, copy);
  const favoriteCategories = Array.from(new Set(favorites.map((item) => item.category)));
  const favoritesInStockCount = favorites.filter(
    (item) => item.availabilityTone === "in-stock",
  ).length;
  const sidebarItems = getAccountSidebarItems(copy);

  const beginProfileEditing = () => {
    setIsEditingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
  };

  const handleProfileSave = async (event?: SyntheticEvent) => {
    event?.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!normalizedName || !normalizedEmail) {
      setProfileError(copy.missingFields);
      setProfileSuccess(null);
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setProfileError(copy.invalidEmail);
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
    });

    setIsSavingProfile(false);

    if (!response.ok || !response.data?.user) {
      setProfileError(
        getProfileErrorMessage(response.data?.error ?? "unexpected_error", copy),
      );
      return;
    }

    setProfileUser(response.data.user);
    setFirstName(splitName(response.data.user.name).firstName);
    setLastName(splitName(response.data.user.name).lastName);
    setEmail(response.data.user.email);
    setPhone(response.data.user.phone);
    setIsEditingProfile(false);
    setProfileSuccess(copy.saved);

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

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setTab(value);
    setActiveSection(tabSections[value]);
  };

  const handleSidebarClick = (key: SectionKey) => {
    setActiveSection(key);

    const nextTab = tabSections.indexOf(key as (typeof tabSections)[number]);

    if (nextTab >= 0) {
      setTab(nextTab);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection dictionary={copy} orders={orders} />;
      case "books":
        return <BooksSection locale={locale} dictionary={copy} downloads={downloads} />;
      case "addresses":
        return <AddressesSection dictionary={copy} addresses={addresses} />;
      case "favorites":
        return (
          <FavoritesSection
            locale={locale}
            dictionary={copy}
            favorites={favorites}
            favoriteSuggestions={favoriteSuggestions}
            favoriteCategories={favoriteCategories}
            favoritesInStockCount={favoritesInStockCount}
            favoritesTotal={favoritesTotal}
          />
        );
      case "settings":
        return <SettingsSection locale={locale} dictionary={copy} />;
      case "logout":
        return (
          <LogoutSection
            dictionary={copy}
            onSignOut={() => signOut({ callbackUrl: homeHref })}
          />
        );
      case "overview":
      default:
        return (
          <OverviewSection
            locale={locale}
            dictionary={copy}
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
        <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
          <Card sx={{ border: "1px solid #F0DFC8", mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack alignItems="center" textAlign="center">
                <Avatar
                  src={user.image ?? undefined}
                  sx={{
                    width: 84,
                    height: 84,
                    bgcolor: "#FCE5EA",
                    color: "#27272A",
                    fontSize: 30,
                  }}
                >
                  {userInitial}
                </Avatar>
                <Typography sx={{ mt: 2, fontSize: 24, fontWeight: 800 }}>
                  {userName}
                </Typography>
                <Typography color="text.secondary">{userEmail}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip label="Belarus store" sx={{ bgcolor: "#FCE5EA", fontWeight: 700 }} />
                  <Chip
                    label={locale.toUpperCase()}
                    sx={{
                      bgcolor: "#fff",
                      border: "1px solid #E8D6BF",
                      fontWeight: 700,
                    }}
                  />
                </Stack>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<EditOutlinedIcon />}
                  sx={{ mt: 2.5, borderColor: "#E8D6BF", bgcolor: "#fff" }}
                  onClick={beginProfileEditing}
                >
                  {copy.editProfile}
                </Button>
              </Stack>
            </CardContent>
          </Card>

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

        <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: { xs: 3, md: 4 },
              borderRadius: "32px",
              background:
                "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.45), transparent 28%), #fff",
              border: "1px solid #F0DFC8",
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
              {copy.account}
            </Typography>
            <Typography variant="h1" sx={{ mt: 1.5, fontSize: { xs: 34, md: 48 } }}>
              {copy.welcome}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 680, lineHeight: 1.8 }}>
              {copy.lead}
            </Typography>
          </Paper>

          <Paper
            sx={{
              mb: 3,
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #F0DFC8",
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 1,
                "& .MuiTabs-indicator": { height: 3, borderRadius: 999 },
              }}
            >
              {copy.tabs.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          </Paper>

          {renderSection()}
        </Grid>
      </Grid>
    </Box>
  );
};