"use client";

import { Alert, Button, Stack, Typography } from "@mui/material";

type AdminErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const AdminErrorPage = ({ error, reset }: AdminErrorPageProps) => {
  console.error("Admin route error boundary", error);

  return (
    <Stack gap={2} sx={{ maxWidth: 720, px: { xs: 2, md: 3 }, py: 4 }}>
      <Typography variant="h4" fontWeight={800}>
        Ошибка в админке
      </Typography>
      <Alert severity="error">
        Что-то пошло не так при обработке этой страницы или действия. Попробуйте повторить еще раз.
      </Alert>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
        <Button variant="contained" onClick={() => reset()}>
          Повторить
        </Button>
        <Button variant="outlined" href="/admin/products">
          К товарам
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdminErrorPage;