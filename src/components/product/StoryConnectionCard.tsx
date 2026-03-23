import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import type { StoryConnectionCardProps } from "./types";

export const StoryConnectionCard = ({
  storyTitle = "Khryuchik in Winter",
  description,
  buttonHref,
  labels,
}: StoryConnectionCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        p: 4,
        borderRadius: "28px",
        bgcolor: "#FCE5EA",
        border: "1px solid #F0DFC8",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "20px",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AutoStoriesOutlinedIcon />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
            {labels.storyConnection.title.replace("{title}", storyTitle)}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
            {description}
          </Typography>
        </Box>

        <Button href={buttonHref} variant="contained">
          {labels.actions.viewBook}
        </Button>
      </Stack>
    </Paper>
  );
};
