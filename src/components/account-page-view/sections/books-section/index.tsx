import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import { SectionCard } from "../../shared";

import type { BooksSectionProps } from "./types";

export const BooksSection = ({ locale, dictionary, downloads }: BooksSectionProps) => {
  return (
    <SectionCard
      title={dictionary.downloadedBooks}
      action={<Button variant="text">{dictionary.showAll}</Button>}
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
                  <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.format} • {item.size}
                  </Typography>
                </Box>
              </Stack>
              <Button variant="contained" startIcon={<DownloadOutlinedIcon />}>
                {locale === "ru" ? "Скачать" : "Download"}
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </SectionCard>
  );
};

export type { BooksSectionProps } from "./types";