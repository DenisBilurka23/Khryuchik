import { Container } from "@mui/material";

import { AccountPageSkeleton } from "@/components/account-page-view";
import { PageShell } from "@/components/page-shell";

const Loading = () => (
  <PageShell>
    <Container maxWidth="lg">
      <AccountPageSkeleton />
    </Container>
  </PageShell>
);

export default Loading;
