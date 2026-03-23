"use client";

import { useState, type SyntheticEvent } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import type { ProductTabsProps } from "./types";

export const ProductTabs = ({ labels, product }: ProductTabsProps) => {
  const [tab, setTab] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        borderRadius: "32px",
        border: "1px solid #F0DFC8",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={tab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 2, borderBottom: "1px solid #F0DFC8", bgcolor: "#fff" }}
      >
        <Tab label={labels.tabs.description} />
        <Tab label={labels.tabs.specs} />
        <Tab label={labels.tabs.delivery} />
        <Tab label={labels.tabs.reviews} />
      </Tabs>

      <Box sx={{ p: { xs: 3, md: 4 } }}>
        {tab === 0 ? (
          <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
            {product.description}
          </Typography>
        ) : null}

        {tab === 1 ? (
          <Grid container spacing={2}>
            {product.specs.map((spec) => (
              <Grid key={spec.label} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{ p: 2.5, borderRadius: "20px", bgcolor: "#FFF8F0" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {spec.label}
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                    {spec.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : null}

        {tab === 2 ? (
          <List disablePadding>
            {product.delivery.map((item) => (
              <ListItem key={item} disableGutters sx={{ py: 1 }}>
                <ListItemText
                  primary={item}
                  slotProps={{
                    primary: {
                      color: "text.secondary",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : null}

        {tab === 3 ? (
          <Box>
            {product.reviews.map((review) => (
              <Paper
                key={review.id}
                elevation={0}
                sx={{ p: 3, borderRadius: "20px", bgcolor: "#FFF8F0", mb: 2 }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {review.author}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {review.date} • {"★".repeat(review.rating)}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1.5, lineHeight: 1.8 }}
                >
                  {review.text}
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
};
