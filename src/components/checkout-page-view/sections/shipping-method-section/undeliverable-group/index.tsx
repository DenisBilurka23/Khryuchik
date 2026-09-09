import { Alert, Box, Button, Stack, Typography } from "@mui/material";

import type { UndeliverableGroupProps } from "./types";

const THUMBNAIL_SIZE = 44;

const thumbnailSx = {
  width: THUMBNAIL_SIZE,
  height: THUMBNAIL_SIZE,
  flexShrink: 0,
  borderRadius: "var(--radius-field)",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
} as const;

export const CheckoutUndeliverableGroup = ({
  title,
  message,
  items,
  removeLabel,
  onRemove,
}: UndeliverableGroupProps) => (
  <Stack spacing={1}>
    {title ? <Typography sx={{ fontWeight: 700 }}>{title}</Typography> : null}

    <Alert
      severity="warning"
      sx={{
        alignItems: "center",
        "& .MuiAlert-action": { alignItems: "center", pt: 0, mt: 0 },
      }}
      action={
        onRemove ? (
          <Button size="small" color="inherit" onClick={onRemove}>
            {removeLabel}
          </Button>
        ) : undefined
      }
    >
      <Stack spacing={1.25}>
        <Typography variant="body2">{message}</Typography>

        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={1.25}
            alignItems="center"
          >
            <Box
              sx={{
                ...thumbnailSx,
                bgcolor:
                  item.thumbnail?.bgColor ||
                  item.thumbnailBackgroundColor ||
                  "var(--color-cream)",
              }}
            >
              {item.thumbnail?.src ? (
                <Box
                  component="img"
                  src={item.thumbnail.src}
                  alt={item.thumbnail.alt ?? item.title}
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                (item.thumbnail?.emoji ?? item.emoji)
              )}
            </Box>

            <Stack spacing={0.25}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {item.title}
                {item.quantity > 1 ? ` ×${item.quantity}` : ""}
              </Typography>
              {item.variant ? (
                <Typography variant="caption" color="text.secondary">
                  {item.variant}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Alert>
  </Stack>
);

export type { UndeliverableGroupProps } from "./types";
