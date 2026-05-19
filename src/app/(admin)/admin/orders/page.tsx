import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button, Stack } from "@mui/material";

import { AdminEmptyState, AdminPageHero, AdminSectionCard } from "@/components/admin-page-shared";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await resolveLocale("admin");
	const tOrders = await getTranslations({
		locale,
		namespace: "adminPage.orders",
	});

	return createAdminMetadata(
		tOrders("title"),
		tOrders("description"),
		locale,
	);
};

const AdminOrdersPage = async () => {
	const locale = await resolveLocale("admin");
	const tOrders = await getTranslations({
		locale,
		namespace: "adminPage.orders",
	});

	return (
		<Stack gap={3}>
			<AdminPageHero eyebrow={tOrders("eyebrow")} title={tOrders("title")} description={tOrders("description")} />

			<AdminSectionCard title={tOrders("sectionTitle")} description={tOrders("sectionDescription")}>
				<AdminEmptyState title={tOrders("emptyTitle")} description={tOrders("emptyDescription")} action={<Button href="/admin/customers" variant="outlined">{tOrders("action")}</Button>} />
			</AdminSectionCard>
		</Stack>
	);
};

export default AdminOrdersPage;