import { Box, Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import { accountSidebarConfig } from "@/constants/account";
import { ACCOUNT_SKELETON_ITEM_COUNT } from "@/constants/loading";

import { AccountHero } from "../hero";

const asideCardSx = {
  width: "100%",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-panel)",
  boxShadow: "var(--shadow-panel)",
} as const;

const orderCardSx = {
  p: 2.5,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-plate)",
} as const;

const navigationItemSx = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  px: 2,
  height: 56,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
} as const;

export const AccountPageSkeleton = () => {
  const t = useTranslations("accountPage");

  return (
    <Box aria-hidden="true" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12, md: 4, lg: 3.5 }} order={{ xs: 1, md: 1 }}>
          <Card sx={{ ...asideCardSx, height: "100%" }}>
            <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
              <Stack alignItems="center" spacing={1.5}>
                <Skeleton variant="circular" width={104} height={104} />
                <Skeleton variant="text" width="65%" height={36} />
                <Skeleton variant="text" width="80%" />
                <Skeleton
                  variant="rounded"
                  width={136}
                  height={44}
                  sx={{ mt: 1, borderRadius: "var(--radius-field)" }}
                />
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
          <Card sx={asideCardSx}>
            <CardContent sx={{ p: 1.5 }}>
              <Stack spacing={0.75}>
                {accountSidebarConfig.map(({ key }) => (
                  <Box key={key} sx={navigationItemSx}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 8.5 }} order={{ xs: 4, md: 4 }}>
          <Card sx={asideCardSx}>
            <CardContent sx={{ p: { xs: 2.5, md: "28px 32px" } }}>
              <Skeleton
                variant="text"
                width="35%"
                height={42}
                sx={{ mb: 2.5 }}
              />
              <Stack spacing={2}>
                {Array.from(
                  { length: ACCOUNT_SKELETON_ITEM_COUNT },
                  (_, index) => (
                    <Box key={index} sx={orderCardSx}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Skeleton variant="text" width="45%" />
                        <Skeleton variant="rounded" width={96} height={28} />
                      </Stack>
                      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Skeleton variant="rounded" width={50} height={60} />
                        <Stack sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="65%" />
                          <Skeleton variant="text" width="40%" />
                        </Stack>
                      </Stack>
                    </Box>
                  ),
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
