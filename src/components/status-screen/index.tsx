import { Box } from "@mui/material";

import {
  ActionButton,
  ActionLink,
  Blob,
  Code,
  FloatBook,
  FloatSparkle,
  FloatStar,
  Footer,
  Screen,
  Text,
  Title,
} from "./parts";
import type { StatusScreenAction, StatusScreenProps } from "./types";

const renderAction = (action: StatusScreenAction) =>
  action.kind === "link" ? (
    <ActionLink key={action.label} variant={action.variant} href={action.href}>
      {action.label}
    </ActionLink>
  ) : (
    <ActionButton
      key={action.label}
      type="button"
      variant={action.variant}
      onClick={action.onClick}
    >
      {action.label}
    </ActionButton>
  );

export const StatusScreen = ({
  emoji,
  blobTone = "pink",
  code,
  title,
  titleTone = "default",
  text,
  actions,
  showFloats = false,
  footer,
}: StatusScreenProps) => {
  const blob = (
    <Blob aria-hidden tone={blobTone} compact={Boolean(code)}>
      {emoji}
    </Blob>
  );

  return (
    <Screen>
      {showFloats && (
        <>
          <FloatStar aria-hidden>⭐</FloatStar>
          <FloatBook aria-hidden>📖</FloatBook>
          <FloatSparkle aria-hidden>✨</FloatSparkle>
        </>
      )}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 520,
          textAlign: "center",
        }}
      >
        {code ? (
          <Box sx={{ position: "relative", mb: 1 }}>
            <Code>{code}</Code>
            {blob}
          </Box>
        ) : (
          blob
        )}

        <Title tone={titleTone}>{title}</Title>

        <Text>{text}</Text>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          {actions.map(renderAction)}
        </Box>

        {footer ? <Footer>{footer}</Footer> : null}
      </Box>
    </Screen>
  );
};

export type { StatusScreenAction, StatusScreenProps } from "./types";
