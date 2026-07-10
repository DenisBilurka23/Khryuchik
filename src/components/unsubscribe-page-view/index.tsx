import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { UnsubscribeConfirm } from "./confirm";
import type { UnsubscribePageViewProps } from "./types";

export const UnsubscribePageView = async ({
  locale,
  token,
}: UnsubscribePageViewProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.unsubscribePage",
  });

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "28px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Stack spacing={2.5}>
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 13,
                fontWeight: 700,
                color: "#d4607a",
              }}
            >
              {t("eyebrow")}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
              {t("title")}
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
              {t("intro")}
            </Typography>

            <UnsubscribeConfirm
              token={token}
              confirmLabel={t("confirmButton")}
              successMessage={t("successMessage")}
              errorMessage={t("errorMessage")}
            />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export type { UnsubscribePageViewProps } from "./types";
