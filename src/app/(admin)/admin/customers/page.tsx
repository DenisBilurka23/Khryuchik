import type { Metadata } from "next";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Alert, Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import { deleteAdminCustomerAction } from "@/app/(admin)/admin/actions";
import { DeleteCustomerButton, EditCustomerButton } from "@/components/admin-customers-page-view";
import { AdminPageHero, AdminSectionCard, AdminStatusChip } from "@/components/admin-page-shared";
import { getAdminCustomerFormErrorMessage } from "@/server/admin/customer-form-state";
import { getAdminCustomers } from "@/server/admin/catalog.service";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { formatAdminDate } from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => {
	const { dictionary } = await getAdminPageContext();

	return createAdminMetadata(
		dictionary.customers.title,
		dictionary.customers.description,
	);
};

type AdminCustomersPageProps = {
	searchParams: Promise<{ deleted?: string; error?: string }>;
};

const AdminCustomersPage = async ({ searchParams }: AdminCustomersPageProps) => {
	const [{ deleted, error }, { dictionary, locale }, customers, session] = await Promise.all([
		searchParams,
		getAdminPageContext(),
		getAdminCustomers(),
		requireAdminPageAccess("/admin/customers"),
	]);
	const shared = dictionary.shared;

	return (
		<Stack gap={3}>
			<AdminPageHero eyebrow={dictionary.customers.eyebrow} title={dictionary.customers.title} description={dictionary.customers.description} />

			{deleted === "1" ? <Alert severity="success">{dictionary.customers.deletedMessage}</Alert> : null}
			{error ? <Alert severity="error">{getAdminCustomerFormErrorMessage(error, dictionary.customers.form)}</Alert> : null}

			<AdminSectionCard title={dictionary.customers.sectionTitle} description={`${dictionary.customers.sectionDescription}: ${customers.length}`}>
				<Box sx={{ overflowX: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{dictionary.customers.columns.user}</TableCell>
								<TableCell>{dictionary.customers.columns.phone}</TableCell>
								<TableCell>{dictionary.customers.columns.role}</TableCell>
								<TableCell>{dictionary.customers.columns.created}</TableCell>
								<TableCell align="right">{dictionary.customers.columns.action}</TableCell>
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
									<TableCell>{formatAdminDate(customer.createdAt, locale)}</TableCell>
									<TableCell align="right">
										<Stack direction="row" gap={0.5} justifyContent="flex-end">
											<EditCustomerButton
												href={`/admin/customers/${customer.id}/edit`}
												label={shared.actions.edit}
												size="small"
											/>
											<DeleteCustomerButton
												userId={customer.id}
												label={dictionary.customers.form.deleteButton}
												action={deleteAdminCustomerAction}
												dialogTitle={dictionary.customers.form.deleteDialogTitle}
												dialogDescription={dictionary.customers.form.deleteDialogDescription}
												confirmLabel={dictionary.customers.form.confirmDeleteButton}
												cancelLabel={dictionary.customers.form.cancelDeleteButton}
												icon={<DeleteOutlineOutlinedIcon key="delete-customer-icon" />}
												iconOnly
												tooltip={dictionary.customers.form.deleteButton}
												ariaLabel={dictionary.customers.form.deleteButton}
												size="small"
												disabled={session.user.id === customer.id}
											/>
										</Stack>
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

export default AdminCustomersPage;