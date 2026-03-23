import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { formatCurrency } from "../utils";
import styles from "./order-section.module.css";
import type { OrderSectionProps } from "./types";

export const OrderSection = ({
  locale,
  total,
  name,
  contact,
  note,
  status,
  mailtoHref,
  cartItems,
  dictionary,
  setName,
  setContact,
  setNote,
  copyOrder,
  clearCart,
}: OrderSectionProps) => {
  return (
    <Box component="section" id="order" className={styles.section}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              className={styles.contentCard}
              sx={{ p: { xs: 3, md: 4 } }}
            >
              <Typography className={styles.eyebrow}>
                {dictionary.orderSection.eyebrow}
              </Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 32, md: 42 } }}
              >
                {dictionary.orderSection.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 2.5, lineHeight: 1.8 }}
              >
                {dictionary.orderSection.lead}
              </Typography>

              <Paper
                elevation={0}
                className={styles.nextStep}
                sx={{ mt: 4, p: 3 }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                  {dictionary.orderSection.nextTitle}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1.5, lineHeight: 1.8 }}
                >
                  {dictionary.orderSection.nextText}
                </Typography>
              </Paper>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              className={styles.summaryCard}
              sx={{ p: { xs: 3, md: 4 } }}
            >
              <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
                {dictionary.orderSection.cartTitle}
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 3 }}>
                {cartItems.length === 0 ? (
                  <Paper
                    elevation={0}
                    className={styles.cartCard}
                    sx={{ p: 2.5 }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      {dictionary.orderSection.emptyTitle}
                    </Typography>
                    <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.72)" }}>
                      {dictionary.orderSection.emptyText}
                    </Typography>
                  </Paper>
                ) : (
                  cartItems.map((item) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      className={styles.cartCard}
                      sx={{ p: 2.5 }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{ mt: 0.75, color: "rgba(255,255,255,0.72)" }}
                          >
                            {dictionary.orderSection.quantityLabel}:{" "}
                            {item.quantity}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.subtotal, locale)}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))
                )}
              </Stack>

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                  {dictionary.orderSection.totalLabel}
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 800 }}>
                  {formatCurrency(total, locale)}
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label={dictionary.orderSection.form.nameLabel}
                  placeholder={dictionary.orderSection.form.namePlaceholder}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  variant="outlined"
                  className={styles.outlinedField}
                />
                <TextField
                  fullWidth
                  label={dictionary.orderSection.form.contactLabel}
                  placeholder={dictionary.orderSection.form.contactPlaceholder}
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  variant="outlined"
                  className={styles.outlinedField}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label={dictionary.orderSection.form.noteLabel}
                  placeholder={dictionary.orderSection.form.notePlaceholder}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  variant="outlined"
                  className={styles.outlinedField}
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 3 }}
              >
                <Button variant="contained" onClick={copyOrder}>
                  {dictionary.orderSection.form.copyButton}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  href={mailtoHref}
                  className={styles.emailButton}
                >
                  {dictionary.orderSection.form.emailButton}
                </Button>
                <Button variant="text" color="inherit" onClick={clearCart}>
                  {dictionary.orderSection.form.clearButton}
                </Button>
              </Stack>

              {status ? (
                <Typography className={styles.status}>{status}</Typography>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
