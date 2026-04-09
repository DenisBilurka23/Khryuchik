import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import type { FavoritesHeroProps } from "./types";

export const FavoritesHero = ({
  guestCopy,
  authCopy,
  authState,
  countLabel,
  shopHref,
  loginHref,
  registerHref,
  onAddAllToCart,
  isAddAllDisabled,
}: FavoritesHeroProps) => {
  const renderGuestActions = () => (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 4, width: "100%" }}
      >
        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: "0 0 auto" }}>
          <Link
            href={loginHref}
            style={{ textDecoration: "none", display: "flex" }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginOutlinedIcon />}
              fullWidth
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {guestCopy.primaryAction}
            </Button>
          </Link>
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: "0 0 auto" }}>
          <Link
            href={registerHref}
            style={{ textDecoration: "none", display: "flex" }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<PersonAddAltOutlinedIcon />}
              sx={{
                borderColor: "#E8D6BF",
                bgcolor: "#fff",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {guestCopy.secondaryAction}
            </Button>
          </Link>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Link
          href={shopHref}
          style={{ textDecoration: "none", display: "inline-flex" }}
        >
          <Button
            variant="text"
            sx={{ mt: 1.5, px: 1.75 }}
            endIcon={<ChevronRightOutlinedIcon />}
          >
            {guestCopy.continueAction}
          </Button>
        </Link>
      </Box>
    </>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: "36px",
        border: "1px solid #F0DFC8",
        background:
          "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.35), transparent 28%), #fff",
      }}
    >
      <Grid container spacing={{ xs: 1.5, md: 4 }} alignItems="center">
        <Grid size={{ xs: 12, md: "grow" }}>
          <Box>
            <Chip
              label={authState ? authCopy.favoritesEyebrow : guestCopy.eyebrow}
              sx={{ bgcolor: "#FCE5EA", fontWeight: 800 }}
            />
            <Typography
              variant="h1"
              sx={{ mt: 2, fontSize: { xs: 36, md: 58 } }}
            >
              {authState ? authCopy.favoritesTitle : guestCopy.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 2, lineHeight: 1.85, fontSize: { xs: 16, md: 18 } }}
            >
              {authState ? authCopy.favoritesLead : guestCopy.lead}
            </Typography>

            {authState ? (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ mt: 4, width: { xs: "100%", md: "auto" } }}
              >
                <Box
                  sx={{ width: { xs: "100%", md: "auto" }, flex: "0 0 auto" }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={onAddAllToCart}
                    disabled={isAddAllDisabled}
                    sx={{ width: { xs: "100%", md: "auto" } }}
                  >
                    {authCopy.favoritesAddAllToCart}
                  </Button>
                </Box>
              </Stack>
            ) : (
              renderGuestActions()
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: "auto" }}>
          <Box
            sx={{
              width: { xs: "100%", md: "fit-content" },
              minWidth: { md: 170 },
              maxWidth: { md: 220 },
              p: { xs: 1.25, md: 1.5 },
              borderRadius: "20px",
              bgcolor: "rgba(255,255,255,0.78)",
              border: "1px solid #F0DFC8",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {authState ? authCopy.favoritesSavedLabel : guestCopy.savedLabel}
            </Typography>
            <Typography
              sx={{ mt: 0.25, fontWeight: 800, fontSize: { xs: 22, md: 24 } }}
            >
              {countLabel}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export type { FavoritesHeroProps } from "./types";
