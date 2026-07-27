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

import { ReviewForm } from "../review-form";
import type { ProductTabsProps } from "../types";

type TabItem = {
  label: string;
  render: () => React.ReactNode;
};

export const ProductTabs = ({ labels, product, reviewForm }: ProductTabsProps) => {
  const availableTabs: TabItem[] = [
    ...(product.description
      ? [{
          label: labels.description,
          render: () => (
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.9, whiteSpace: "pre-wrap" }}
            >
              {product.description}
            </Typography>
          ),
        }]
      : []),
    ...(product.specs.length > 0
      ? [{
          label: labels.specs,
          render: () => (
            <Grid container spacing={2}>
              {product.specs.map((spec) => (
                <Grid key={spec.label} size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: "20px", bgcolor: "#FFF8F0" }}>
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
          ),
        }]
      : []),
    ...(product.delivery.length > 0
      ? [{
          label: labels.delivery,
          render: () => (
            <List disablePadding>
              {product.delivery.map((item) => (
                <ListItem key={item} disableGutters sx={{ py: 1 }}>
                  <ListItemText
                    primary={item}
                    slotProps={{ primary: { color: "text.secondary" } }}
                  />
                </ListItem>
              ))}
            </List>
          ),
        }]
      : []),
    {
      label: labels.reviews,
      render: () => (
        <Box>
          {product.reviews.map((review) => (
            <Paper
              key={review.id}
              elevation={0}
              sx={{ p: 3, borderRadius: "20px", bgcolor: "#FFF8F0", mb: 2 }}
            >
              <Typography sx={{ fontWeight: 700 }}>{review.author}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {review.date} • {"★".repeat(review.rating)}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
                {review.text}
              </Typography>
            </Paper>
          ))}
          <ReviewForm {...reviewForm} />
        </Box>
      ),
    },
  ];

  const [tab, setTab] = useState(0);

  if (availableTabs.length === 0) return null;

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
        {availableTabs.map((t) => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>

      <Box sx={{ p: { xs: 3, md: 4 } }}>
        {availableTabs[tab]?.render()}
      </Box>
    </Paper>
  );
};
