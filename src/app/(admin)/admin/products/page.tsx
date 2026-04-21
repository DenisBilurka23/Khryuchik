import type { Metadata } from "next";
import { Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import { AdminPageHero, AdminSectionCard, AdminStatusChip } from "@/components/admin-page-shared";
import { getAdminProducts } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { getAdminAvailabilityLabel, getAdminProductTypeLabel } from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => {
	const { dictionary } = await getAdminPageContext();

	return createAdminMetadata(
		dictionary.products.title,
		dictionary.products.description,
	);
};

const AdminProductsPage = async () => {
	const [{ dictionary }, products] = await Promise.all([
		getAdminPageContext(),
		getAdminProducts(),
	]);
	const shared = dictionary.shared;

	return (
		<Stack gap={3}>
			<AdminPageHero eyebrow={dictionary.products.eyebrow} title={dictionary.products.title} description={dictionary.products.description} actions={<Button href="/admin/products/new" variant="contained">{dictionary.products.newProduct}</Button>} />

			<AdminSectionCard title={dictionary.products.sectionTitle} description={`${dictionary.products.sectionDescription}: ${products.length}`}>
				<Box sx={{ overflowX: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{dictionary.products.columns.product}</TableCell>
								<TableCell>{dictionary.products.columns.sku}</TableCell>
								<TableCell>{dictionary.products.columns.type}</TableCell>
								<TableCell>{dictionary.products.columns.category}</TableCell>
								<TableCell>{dictionary.products.columns.price}</TableCell>
								<TableCell>{dictionary.products.columns.status}</TableCell>
								<TableCell>{dictionary.products.columns.sortOrder}</TableCell>
								<TableCell align="right">{dictionary.products.columns.action}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{products.map((product) => (
								<TableRow key={product.productId} hover>
									<TableCell>
										<Stack gap={0.5}>
											<Typography fontWeight={700}>{product.title}</Typography>
											<Typography variant="body2" color="text.secondary">{product.slug}</Typography>
										</Stack>
									</TableCell>
									<TableCell>{product.sku || shared.placeholders.emptyValue}</TableCell>
									<TableCell>{getAdminProductTypeLabel(product.type, shared.status.productTypes)}</TableCell>
									<TableCell>{product.category}</TableCell>
									<TableCell>{product.priceLabel}</TableCell>
									<TableCell>
										<Stack direction="row" gap={1} flexWrap="wrap">
											<AdminStatusChip label={product.isActive ? shared.status.active : shared.status.hidden} tone={product.isActive ? "success" : "neutral"} />
											<AdminStatusChip label={getAdminAvailabilityLabel(product.availability, shared.status.availability)} tone={product.availability === "in_stock" ? "success" : product.availability === "preorder" ? "info" : "warning"} />
										</Stack>
									</TableCell>
									<TableCell>{product.sortOrder}</TableCell>
									<TableCell align="right">
										<Button href={`/admin/products/${product.productId}/edit`} variant="outlined">{shared.actions.edit}</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</AdminSectionCard>
		</Stack>
	);
};

export default AdminProductsPage;