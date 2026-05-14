import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Button, Stack } from "@mui/material";

import { AdminEmptyState, AdminPageHero, AdminSectionCard } from "@/components/admin-page-shared";
import type { Dictionary } from "@/i18n/types";
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
	const messages = await getMessages({ locale });
	const { adminPage: dictionary } = messages as Dictionary;

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