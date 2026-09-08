import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";

import authorImage from "@/assets/Author.jpeg";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { Panel } from "@/components/primitives";
import { CONTACT_EMAIL } from "@/constants/contact";

import type { StoryAuthorSectionProps } from "./types";

const portraitSx = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: { xs: 280, md: "none" },
  justifySelf: { xs: "center", md: "stretch" },
  aspectRatio: "4 / 5",
  borderRadius: "var(--radius-plate)",
  background: "var(--color-products)",
} as const;

const namePlateSx = {
  position: "absolute",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  display: "inline-flex",
  alignItems: "center",
  minHeight: 36,
  padding: "0 16px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-card)",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--color-text)",
  whiteSpace: "nowrap",
} as const;

const paragraphSx = {
  maxWidth: "62ch",
  mt: 2,
  fontSize: 15,
  lineHeight: 1.7,
  color: "var(--color-text-secondary)",
} as const;

const actionSx = {
  minHeight: 46,
  mt: 3,
  paddingInline: "22px",
  borderRadius: "var(--radius-pill)",
  borderColor: "var(--color-accent)",
  fontWeight: 500,
  color: "var(--color-accent)",
  "&:hover": {
    borderColor: "var(--color-accent)",
    background: "var(--color-accent-pale)",
  },
} as const;

export const StoryAuthorSection = ({
  eyebrow,
  title,
  name,
  role,
  paragraphs,
  actionLabel,
}: StoryAuthorSectionProps) => {
  return (
    <Box component="section" id="author" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Panel
          tone="cream"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "280px minmax(0, 1fr)",
            },
            alignItems: "center",
            gap: { xs: 3.5, md: 5 },
          }}
        >
          <Box sx={portraitSx}>
            <Image
              src={authorImage}
              alt={name}
              fill
              sizes="280px"
              placeholder="blur"
              style={{ objectFit: "cover" }}
            />

            <Typography component="span" sx={namePlateSx}>
              {name} · {role}
            </Typography>
          </Box>

          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography
              variant="h2"
              sx={{ mt: 1.5, fontSize: { xs: 28, md: 34 }, lineHeight: 1.15 }}
            >
              {title}
            </Typography>

            {paragraphs.map((paragraph) => (
              <Typography key={paragraph} component="p" sx={paragraphSx}>
                {paragraph}
              </Typography>
            ))}

            <Button
              variant="outlined"
              endIcon={<MailOutlineIcon />}
              component="a"
              href={`mailto:${CONTACT_EMAIL}`}
              sx={actionSx}
            >
              {actionLabel}
            </Button>
          </Box>
        </Panel>
      </Container>
    </Box>
  );
};

export type { StoryAuthorSectionProps } from "./types";
