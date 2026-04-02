"use client";

import { useState, type SyntheticEvent } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { updateAccountProfileClient } from "@/client-api/account";
import { getAccountPageMockData } from "@/data/account-page-mock";

import type {
  AccountPageViewProps,
  AccountSidebarItem,
  SectionCardProps,
  SectionKey,
  SidebarItemProps,
} from "./account-page-view.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const splitName = (value: string | null | undefined) => {
  const normalizedName = value?.trim() ?? "";

  if (!normalizedName) {
    return { firstName: "", lastName: "" };
  }

  const [firstName = "", ...lastNameParts] = normalizedName.split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};

const getProfileErrorMessage = (
  errorCode: string,
  dictionary: AccountPageViewProps["dictionary"],
) => {
  switch (errorCode) {
    case "invalid_email":
      return dictionary.invalidEmail;
    case "email_taken":
      return dictionary.emailTaken;
    case "missing_fields":
      return dictionary.missingFields;
    case "email_managed_by_google":
      return dictionary.emailManagedByGoogle;
    default:
      return dictionary.unexpectedError;
  }
};

const tabSections: Array<Exclude<SectionKey, "favorites" | "logout">> = [
  "overview",
  "orders",
  "books",
  "addresses",
  "settings",
];

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
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

const SectionCard = ({ title, action, children }: SectionCardProps) => {
  return (
    <Card sx={{ border: "1px solid #F0DFC8" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
            {title}
          </Typography>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};

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
  const { orders, downloads, addresses, favorites } = getAccountPageMockData(
    locale,
    copy,
  );

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

  const sidebarItems: AccountSidebarItem[] = [
    { key: "overview", label: copy.profile, icon: <PersonOutlineIcon /> },
    { key: "orders", label: copy.orders, icon: <ReceiptLongOutlinedIcon /> },
    { key: "books", label: copy.books, icon: <MenuBookOutlinedIcon /> },
    {
      key: "addresses",
      label: copy.addresses,
      icon: <LocationOnOutlinedIcon />,
    },
    { key: "favorites", label: copy.favorites, icon: <FavoriteBorderIcon /> },
    { key: "settings", label: copy.settings, icon: <SettingsOutlinedIcon /> },
    { key: "logout", label: copy.logout, icon: <LogoutOutlinedIcon /> },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
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

  const renderOverview = () => (
    <Stack spacing={3}>
      <SectionCard
        title={copy.personalData}
        action={
          <Button
            variant={isEditingProfile ? "contained" : "outlined"}
            color="inherit"
            startIcon={isEditingProfile ? <SaveOutlinedIcon /> : <EditOutlinedIcon />}
            sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
            onClick={isEditingProfile ? () => void handleProfileSave() : beginProfileEditing}
            loading={isSavingProfile}
          >
            {isEditingProfile ? copy.save : copy.editProfile}
          </Button>
        }
      >
        <Box component="form" onSubmit={handleProfileSave}>
          <Stack spacing={2} sx={{ mb: 2.5 }}>
            {profileError ? <Chip color="error" label={profileError} /> : null}
            {profileSuccess ? <Chip color="success" label={profileSuccess} /> : null}
            {!isEmailEditable ? (
              <Typography color="text.secondary">{copy.emailManagedByGoogle}</Typography>
            ) : null}
          </Stack>

          <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={copy.firstNameLabel}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={!isEditingProfile}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={copy.lastNameLabel}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={!isEditingProfile}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={copy.emailLabel}
              value={email}
              onChange={(event) => setEmail(event.target.value.toLowerCase())}
              disabled={!isEditingProfile || !isEmailEditable}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={copy.phoneLabel}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={!isEditingProfile}
            />
          </Grid>
          </Grid>
        </Box>
      </SectionCard>

      <SectionCard
        title={copy.recentOrders}
        action={<Button variant="text">{copy.allOrders}</Button>}
      >
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper
              key={order.id}
              elevation={0}
              sx={{
                p: 2.25,
                borderRadius: "22px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{order.id}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {order.date}
                  </Typography>
                  <Typography sx={{ mt: 1.25 }}>{order.items}</Typography>
                </Box>
                <Stack
                  alignItems={{ xs: "flex-start", md: "flex-end" }}
                  spacing={1}
                >
                  <Chip
                    label={order.status}
                    sx={{
                      bgcolor:
                        order.status === copy.delivered ? "#E6F6EC" : "#FFF3D6",
                      fontWeight: 700,
                    }}
                  />
                  <Typography sx={{ fontWeight: 800 }}>
                    {order.total}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </SectionCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title={copy.downloadedBooks}>
            <Stack spacing={2}>
              {downloads.map((item) => (
                <Paper
                  key={item.title}
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {item.format} • {item.size}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<DownloadOutlinedIcon />}
                      sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
                    >
                      {locale === "ru" ? "Скачать" : "Download"}
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title={copy.shippingAddresses}>
            <Stack spacing={2}>
              {addresses.map((address) => (
                <Paper
                  key={address.title}
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <LocationOnOutlinedIcon />
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {address.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, lineHeight: 1.8 }}
                      >
                        {address.line1}
                        <br />
                        {address.line2}
                        <br />
                        {address.line3}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return (
          <SectionCard title={copy.allOrders}>
            <Stack spacing={2}>
              {orders.map((order) => (
                <Paper
                  key={order.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack spacing={0.75}>
                      <Typography sx={{ fontWeight: 800 }}>
                        {order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.date}
                      </Typography>
                      <Typography>{order.items}</Typography>
                    </Stack>
                    <Stack
                      alignItems={{ xs: "flex-start", md: "flex-end" }}
                      spacing={1.25}
                    >
                      <Chip
                        label={order.status}
                        sx={{
                          bgcolor:
                            order.status === copy.delivered
                              ? "#E6F6EC"
                              : "#FFF3D6",
                          fontWeight: 700,
                        }}
                      />
                      <Typography sx={{ fontWeight: 800 }}>
                        {order.total}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionCard>
        );
      case "books":
        return (
          <SectionCard
            title={copy.downloadedBooks}
            action={<Button variant="text">{copy.showAll}</Button>}
          >
            <Stack spacing={2}>
              {downloads.map((item) => (
                <Paper
                  key={item.title}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "22px",
                    border: "1px solid #F0DFC8",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "18px",
                          bgcolor: "#FCE5EA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MenuBookOutlinedIcon />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.format} • {item.size}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      variant="contained"
                      startIcon={<DownloadOutlinedIcon />}
                    >
                      {locale === "ru" ? "Скачать" : "Download"}
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </SectionCard>
        );
      case "addresses":
        return (
          <SectionCard
            title={copy.shippingAddresses}
            action={<Button variant="contained">{copy.addAddress}</Button>}
          >
            <Grid container spacing={2}>
              {addresses.map((address) => (
                <Grid key={address.title} size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "22px",
                      border: "1px solid #F0DFC8",
                      bgcolor: "#fff",
                      height: "100%",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <LocationOnOutlinedIcon />
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {address.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.75, lineHeight: 1.8 }}
                        >
                          {address.line1}
                          <br />
                          {address.line2}
                          <br />
                          {address.line3}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        );
      case "favorites":
        return (
          <SectionCard
            title={copy.favorites}
            action={<Button variant="text">{copy.removeAll}</Button>}
          >
            <Grid container spacing={2}>
              {favorites.map((item) => (
                <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: "22px",
                      border: "1px solid #F0DFC8",
                      bgcolor: "#fff",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        height: 152,
                        borderRadius: "18px",
                        bgcolor: "#FFF8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                      }}
                    >
                      {item.emoji}
                    </Box>
                    <Typography sx={{ mt: 2, fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {item.subtitle}
                    </Typography>
                    <Typography
                      sx={{ mt: 1.25, color: "primary.main", fontWeight: 800 }}
                    >
                      {item.price}
                    </Typography>
                    <Stack direction="row" spacing={1.25} sx={{ mt: 2 }}>
                      <Button fullWidth variant="contained">
                        {locale === "ru" ? "В корзину" : "Add to cart"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        sx={{
                          minWidth: 44,
                          px: 0,
                          borderColor: "#E8D6BF",
                          bgcolor: "#fff",
                        }}
                      >
                        <FavoriteOutlinedIcon fontSize="small" />
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        );
      case "settings":
        return (
          <Stack spacing={3}>
            <SectionCard title={copy.languageRegion}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={locale === "ru" ? "Язык" : "Language"}
                    defaultValue={locale === "ru" ? "Русский" : "English"}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={locale === "ru" ? "Регион магазина" : "Store region"}
                    defaultValue={locale === "ru" ? "Беларусь" : "Belarus"}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={copy.notifications}
              action={
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<NotificationsOutlinedIcon />}
                  sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
                >
                  {copy.notifications}
                </Button>
              }
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "18px",
                  border: "1px solid #F0DFC8",
                  bgcolor: "#fff",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>Email updates</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {locale === "ru"
                    ? "Новые книги, статусы заказов и сезонные коллекции."
                    : "New books, order updates, and seasonal collections."}
                </Typography>
              </Paper>
            </SectionCard>

            <SectionCard
              title={copy.security}
              action={
                <Button variant="contained" startIcon={<SaveOutlinedIcon />}>
                  {copy.save}
                </Button>
              }
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={locale === "ru" ? "Новый пароль" : "New password"}
                    type="password"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={
                      locale === "ru" ? "Повторите пароль" : "Repeat password"
                    }
                    type="password"
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        );
      case "logout":
        return (
          <SectionCard
            title={copy.signOutTitle}
            action={
              <Button
                variant="contained"
                onClick={() => signOut({ callbackUrl: homeHref })}
              >
                {copy.signOutButton}
              </Button>
            }
          >
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {copy.signOutText}
            </Typography>
          </SectionCard>
        );
      case "overview":
      default:
        return renderOverview();
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
                  <Chip
                    label="Belarus store"
                    sx={{ bgcolor: "#FCE5EA", fontWeight: 700 }}
                  />
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
            <Typography
              variant="h1"
              sx={{ mt: 1.5, fontSize: { xs: 34, md: 48 } }}
            >
              {copy.welcome}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 680, lineHeight: 1.8 }}
            >
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
