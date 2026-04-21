import type { Metadata } from "next";
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import { getAdminSummaryData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import {
	formatAdminDate,
	getAdminAuthProviderLabel,
	getAdminCategoryLabel,
} from "@/utils/admin";

import {
	AdminEmptyState,
	AdminPageHero,
	AdminSectionCard,
	AdminStatCard,
	AdminStatusChip,
} from "@/components/admin-page-shared";

export const generateMetadata = async (): Promise<Metadata> => {
	const { dictionary } = await getAdminPageContext();

	return createAdminMetadata(
		dictionary.dashboard.title,
		dictionary.dashboard.description,
	);
};

const AdminDashboardPage = async () => {
	const [{ dictionary, locale }, summary] = await Promise.all([
		getAdminPageContext(),
		getAdminSummaryData(),
	]);
	const shared = dictionary.shared;

	const stats = [
		{
			title: dictionary.dashboard.stats.productsTitle,
			value: summary.stats.totalProducts,
			note: `${summary.stats.activeProducts} ${dictionary.dashboard.stats.productsNote}`,
		},
		{
			title: dictionary.dashboard.stats.accountsTitle,
			value: summary.stats.totalUsers,
			note: `${summary.stats.adminUsers} ${dictionary.dashboard.stats.accountsNote}`,
		},
		{
			title: dictionary.dashboard.stats.categoriesTitle,
			value: summary.stats.categoriesCount,
			note: `${summary.stats.booksCount} ${dictionary.dashboard.stats.categoriesNote}`,
		},
	];

	return (
		<Stack gap={3}>
			<AdminPageHero
				eyebrow={dictionary.dashboard.eyebrow}
				title={dictionary.dashboard.title}
				description={dictionary.dashboard.description}
				actions={<Button href="/admin/products/new" variant="contained">{dictionary.layout.addProduct}</Button>}
				aside={
					<Paper elevation={0} sx={{ p: 2.5, borderRadius: "24px", bgcolor: "#fff", border: "1px solid #F0DFC8", minWidth: { xl: 260 } }}>
						<Typography color="text.secondary" variant="body2">
							{dictionary.dashboard.systemStateTitle}
						</Typography>
						<Typography sx={{ mt: 0.75, fontWeight: 800, fontSize: 28 }}>
							{summary.hasOrdersData ? shared.status.ordersWired : shared.status.ordersPending}
						</Typography>
						<Typography color="text.secondary" sx={{ mt: 0.75 }}>
							{dictionary.dashboard.systemStateDescription}
						</Typography>
					</Paper>
				}
			/>

			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }, gap: 3 }}>
				{stats.map((stat) => (
					<AdminStatCard key={stat.title} title={stat.title} value={stat.value} note={stat.note} />
				))}
			</Box>

			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1.3fr 1fr" }, gap: 3 }}>
				<AdminSectionCard title={dictionary.dashboard.recentProducts.title} description={dictionary.dashboard.recentProducts.description} action={<Button href="/admin/products" variant="outlined" color="inherit" sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}>{dictionary.dashboard.recentProducts.action}</Button>}>
					<Box sx={{ overflowX: "auto" }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>{dictionary.dashboard.recentProducts.columns.name}</TableCell>
									<TableCell>{dictionary.dashboard.recentProducts.columns.category}</TableCell>
									<TableCell>{dictionary.dashboard.recentProducts.columns.price}</TableCell>
									<TableCell>{dictionary.dashboard.recentProducts.columns.status}</TableCell>
									<TableCell align="right">{dictionary.dashboard.recentProducts.columns.action}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{summary.recentProducts.map((product) => (
									<TableRow key={product.productId} hover>
										<TableCell>
											<Stack gap={0.5}>
												<Typography fontWeight={700}>{product.title}</Typography>
												<Typography variant="body2" color="text.secondary">{product.slug}</Typography>
											</Stack>
										</TableCell>
										<TableCell>{product.category}</TableCell>
										<TableCell>{product.priceLabel}</TableCell>
										<TableCell>
											<AdminStatusChip label={product.isActive ? shared.status.active : shared.status.hidden} tone={product.isActive ? "success" : "neutral"} />
										</TableCell>
										<TableCell align="right">
											<Button href={`/admin/products/${product.productId}/edit`} variant="outlined">{shared.actions.edit}</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</AdminSectionCard>

				<AdminSectionCard title={dictionary.dashboard.recentCustomers.title} description={dictionary.dashboard.recentCustomers.description} action={<Button href="/admin/customers" variant="text">{dictionary.dashboard.recentCustomers.action}</Button>}>
					<Stack gap={2}>
						{summary.recentCustomers.map((customer) => (
							<Paper key={customer.id} elevation={0} sx={{ p: 2.25, borderRadius: "22px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
								<Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
									<Box>
										<Typography sx={{ fontWeight: 700 }}>{customer.name || shared.placeholders.noName}</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{customer.email}</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{dictionary.dashboard.recentCustomers.createdLabel}: {formatAdminDate(customer.createdAt, locale)}</Typography>
									</Box>
									<Stack direction="row" gap={1} flexWrap="wrap">
										<AdminStatusChip label={customer.isAdmin ? shared.status.admin : shared.status.user} tone={customer.isAdmin ? "accent" : "neutral"} />
										{customer.authProviders.map((provider) => (
											<AdminStatusChip key={provider} label={getAdminAuthProviderLabel(provider, shared.status.authProviders)} tone={provider === "google" ? "info" : "warning"} />
										))}
									</Stack>
								</Stack>
							</Paper>
						))}
					</Stack>
				</AdminSectionCard>
			</Box>

			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" }, gap: 3 }}>
				<AdminSectionCard title={dictionary.dashboard.categories.title} description={dictionary.dashboard.categories.description} action={<Button href="/admin/categories" variant="text">{dictionary.dashboard.categories.action}</Button>}>
					<Stack gap={2}>
						{summary.categories.map((category) => (
							<Paper key={category.key} elevation={0} sx={{ p: 2.25, borderRadius: "22px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
								<Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
									<Box>
										<Typography sx={{ fontWeight: 700 }}>{getAdminCategoryLabel(category.translations, locale) || category.key}</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>/ {category.key} • {category.itemsCount} {dictionary.dashboard.categories.itemsLabel}</Typography>
									</Box>
									<Stack direction="row" gap={1}>
										<AdminStatusChip label={category.isActive ? shared.status.active : shared.status.hidden} tone={category.isActive ? "success" : "neutral"} />
										<AdminStatusChip label={category.visibleInHomeTabs ? shared.status.homeTabs : shared.status.shopOnly} tone={category.visibleInHomeTabs ? "info" : "neutral"} />
									</Stack>
								</Stack>
							</Paper>
						))}
					</Stack>
				</AdminSectionCard>

				<AdminSectionCard title={dictionary.dashboard.orders.title} description={dictionary.dashboard.orders.description}>
					<AdminEmptyState title={dictionary.dashboard.orders.emptyTitle} description={dictionary.dashboard.orders.emptyDescription} />
				</AdminSectionCard>
			</Box>
		</Stack>
	);
};

export default AdminDashboardPage;