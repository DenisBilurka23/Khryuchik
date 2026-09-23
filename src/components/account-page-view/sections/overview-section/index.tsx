import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { DownloadRow } from "@/components/download-row";
import { Plate } from "@/components/primitives";
import {
  getUserShippingAddressLines,
  getUserShippingAddressTitle,
} from "@/utils/account-page";

import {
  accountBadgeSx,
  PersonalDetailsSection,
  SectionCard,
} from "../../shared";
import { OrderCard } from "../orders-section";

import type { OverviewSectionProps } from "./types";

const addressButtonSx = {
  display: "block",
  width: "100%",
  borderRadius: "var(--radius-field)",
  textAlign: "left",
} as const;

const addressPlateSx = {
  borderRadius: "var(--radius-field)",
  width: "100%",
  transition: "opacity 0.2s ease, border-color 0.2s ease",
} as const;

export const OverviewSection = ({
  locale,
  timeZone,
  orders,
  orderProducts,
  productReviews,
  downloads,
  addresses,
  selectedShippingAddressId,
  profileEditor,
  selectingAddressId,
  onAddAddress,
  onSelectAddress,
  onShowAllOrders,
  onShowAllBooks,
}: OverviewSectionProps) => {
  const t = useTranslations("accountPage");

  return (
    <Stack spacing={3}>
      <PersonalDetailsSection {...profileEditor} />

      <SectionCard
        title={t("recentOrders")}
        action={
          <Button variant="text" onClick={onShowAllOrders}>
            {t("allOrders")}
          </Button>
        }
      >
        <Stack spacing={2}>
          {orders.length === 0 ? (
            <Plate pad="sm">
              <Typography color="text.secondary">{t("noOrders")}</Typography>
            </Plate>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                locale={locale}
                timeZone={timeZone}
                orderProducts={orderProducts}
                productReviews={productReviews}
              />
            ))
          )}
        </Stack>
      </SectionCard>

      <SectionCard
        title={t("books")}
        action={
          <Button variant="text" onClick={onShowAllBooks}>
            {t("allBooks")}
          </Button>
        }
      >
        <Stack spacing={2}>
          {downloads.length === 0 ? (
            <Typography color="text.secondary">{t("noBooks")}</Typography>
          ) : (
            downloads.map((item) => (
              <DownloadRow
                key={item.assetId}
                download={item}
                actionLabel={t("download")}
              />
            ))
          )}
        </Stack>
      </SectionCard>

      <SectionCard
        title={t("shippingAddresses")}
        action={
          <Button variant="text" onClick={onAddAddress}>
            {t("addAddress")}
          </Button>
        }
      >
        <Stack spacing={2}>
          {addresses.length === 0 ? (
            <Plate pad="sm">
              <Typography color="text.secondary">
                {t("noAddressesYet")}
              </Typography>
            </Plate>
          ) : null}

          {addresses.map((address) => {
            const isCurrent = address.id === selectedShippingAddressId;
            const isSelecting = selectingAddressId === address.id;
            const lines = getUserShippingAddressLines(address, locale);

            return (
              <ButtonBase
                key={address.id}
                onClick={() => {
                  if (!isCurrent) {
                    onSelectAddress(address.id);
                  }
                }}
                disabled={isCurrent || Boolean(selectingAddressId)}
                sx={addressButtonSx}
              >
                <Plate
                  pad="sm"
                  sx={{
                    ...addressPlateSx,
                    ...(isCurrent
                      ? { borderColor: "var(--color-action)" }
                      : null),
                    opacity: isSelecting ? 0.72 : 1,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <LocationOnOutlinedIcon />
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          {getUserShippingAddressTitle(address)}
                        </Typography>
                        {isCurrent ? (
                          <Chip
                            label={t("currentAddress")}
                            color="primary"
                            size="small"
                            sx={accountBadgeSx}
                          />
                        ) : isSelecting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null}
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, lineHeight: 1.8 }}
                      >
                        {lines.map((line) => (
                          <Box key={line} component="span" display="block">
                            {line}
                          </Box>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>
                </Plate>
              </ButtonBase>
            );
          })}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export type { OverviewSectionProps } from "./types";
