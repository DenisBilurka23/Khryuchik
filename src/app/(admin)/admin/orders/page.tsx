import type { Metadata } from "next";
import { Button, Stack } from "@mui/material";

import { AdminEmptyState, AdminPageHero, AdminSectionCard } from "@/components/admin-page-shared";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";

export const generateMetadata = async (): Promise<Metadata> => {
	const { dictionary } = await getAdminPageContext();

	return createAdminMetadata(
		dictionary.orders.title,
		dictionary.orders.description,
	);
};

const AdminOrdersPage = async () => {
	const { dictionary } = await getAdminPageContext();

	return (
		<Stack gap={3}>
			<AdminPageHero eyebrow={dictionary.orders.eyebrow} title={dictionary.orders.title} description={dictionary.orders.description} />

			<AdminSectionCard title={dictionary.orders.sectionTitle} description={dictionary.orders.sectionDescription}>
				<AdminEmptyState title={dictionary.orders.emptyTitle} description={dictionary.orders.emptyDescription} action={<Button href="/admin/customers" variant="outlined">{dictionary.orders.action}</Button>} />
			</AdminSectionCard>
		</Stack>
	);
};

export default AdminOrdersPage;