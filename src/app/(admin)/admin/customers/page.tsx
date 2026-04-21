import type { Metadata } from "next";
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import { AdminPageHero, AdminSectionCard, AdminStatusChip } from "@/components/admin-page-shared";
import { getAdminCustomers } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { formatAdminDate, getAdminAuthProviderLabel } from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => {
	const { dictionary } = await getAdminPageContext();

	return createAdminMetadata(
		dictionary.customers.title,
		dictionary.customers.description,
	);
};

const AdminCustomersPage = async () => {
	const [{ dictionary, locale }, customers] = await Promise.all([
		getAdminPageContext(),
		getAdminCustomers(),
	]);
	const shared = dictionary.shared;

	return (
		<Stack gap={3}>
			<AdminPageHero eyebrow={dictionary.customers.eyebrow} title={dictionary.customers.title} description={dictionary.customers.description} />

			<AdminSectionCard title={dictionary.customers.sectionTitle} description={`${dictionary.customers.sectionDescription}: ${customers.length}`}>
				<Box sx={{ overflowX: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{dictionary.customers.columns.user}</TableCell>
								<TableCell>{dictionary.customers.columns.phone}</TableCell>
								<TableCell>{dictionary.customers.columns.role}</TableCell>
								<TableCell>{dictionary.customers.columns.providers}</TableCell>
								<TableCell>{dictionary.customers.columns.created}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{customers.map((customer) => (
								<TableRow key={customer.id} hover>
									<TableCell>
										<Stack gap={0.5}>
											<Typography fontWeight={700}>{customer.name || shared.placeholders.noName}</Typography>
											<Typography variant="body2" color="text.secondary">{customer.email}</Typography>
										</Stack>
									</TableCell>
									<TableCell>{customer.phone || shared.placeholders.emptyValue}</TableCell>
									<TableCell>
										<AdminStatusChip label={customer.isAdmin ? shared.status.admin : shared.status.user} tone={customer.isAdmin ? "accent" : "neutral"} />
									</TableCell>
									<TableCell>
										<Stack direction="row" gap={1} flexWrap="wrap">
											{customer.authProviders.map((provider) => (
												<AdminStatusChip key={provider} label={getAdminAuthProviderLabel(provider, shared.status.authProviders)} tone={provider === "google" ? "info" : "warning"} />
											))}
										</Stack>
									</TableCell>
									<TableCell>{formatAdminDate(customer.createdAt, locale)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</AdminSectionCard>
		</Stack>
	);
};

export default AdminCustomersPage;