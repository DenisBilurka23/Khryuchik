import type { Metadata } from "next";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Alert, Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { deleteAdminCustomerAction } from "@/app/(admin)/admin/actions";
import { DeleteCustomerButton, EditCustomerButton } from "@/components/admin-customers-page-view";
import { AdminPageHero, AdminSectionCard, AdminStatusChip } from "@/components/admin-page-shared";
import { getAdminCustomerFormErrorMessage } from "@/server/admin/customer-form-state";
import { getAdminCustomers } from "@/server/admin/catalog.service";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import { formatAdminDate } from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => {
	const locale = await resolveLocale("admin");
	const tCustomers = await getTranslations({
		locale,
		namespace: "adminPage.customers",
	});

	return createAdminMetadata(
		tCustomers("title"),
		tCustomers("description"),
		locale,
	);
};

type AdminCustomersPageProps = {
	searchParams: Promise<{ deleted?: string; error?: string }>;
};

const AdminCustomersPage = async ({ searchParams }: AdminCustomersPageProps) => {
	const [{ deleted, error }, locale] = await Promise.all([
		searchParams,
		resolveLocale("admin"),
	]);
	const [customers, session, tCustomers, tCustomerForm, tShared] = await Promise.all([
		getAdminCustomers(),
		requireAdminPageAccess("/admin/customers"),
		getTranslations({ locale, namespace: "adminPage.customers" }),
		getTranslations({ locale, namespace: "adminPage.customers.form" }),
		getTranslations({ locale, namespace: "adminPage.shared" }),
	]);
	const sharedStatus = {
		admin: tShared("status.admin"),
		user: tShared("status.user"),
	};
	const sharedPlaceholders = {
		noName: tShared("placeholders.noName"),
		emptyValue: tShared("placeholders.emptyValue"),
	};
	const customerFormErrorMessages = {
		notFound: tCustomerForm("errorMessages.notFound"),
		storageUnavailable: tCustomerForm("errorMessages.storageUnavailable"),
		emailTaken: tCustomerForm("errorMessages.emailTaken"),
		emailManagedByGoogle: tCustomerForm("errorMessages.emailManagedByGoogle"),
		cannotDeleteSelf: tCustomerForm("errorMessages.cannotDeleteSelf"),
		cannotDemoteSelf: tCustomerForm("errorMessages.cannotDemoteSelf"),
		lastAdmin: tCustomerForm("errorMessages.lastAdmin"),
		saveFailed: tCustomerForm("errorMessages.saveFailed"),
		deleteFailed: tCustomerForm("errorMessages.deleteFailed"),
		unexpected: tCustomerForm("errorMessages.unexpected"),
	};

	return (
		<Stack gap={3}>
			<AdminPageHero eyebrow={tCustomers("eyebrow")} title={tCustomers("title")} description={tCustomers("description")} />

			{deleted === "1" ? <Alert severity="success">{tCustomers("deletedMessage")}</Alert> : null}
			{error ? <Alert severity="error">{getAdminCustomerFormErrorMessage(error, customerFormErrorMessages)}</Alert> : null}

			<AdminSectionCard title={tCustomers("sectionTitle")} description={`${tCustomers("sectionDescription")}: ${customers.length}`}>
				<Box sx={{ overflowX: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{tCustomers("columns.user")}</TableCell>
								<TableCell>{tCustomers("columns.phone")}</TableCell>
								<TableCell>{tCustomers("columns.role")}</TableCell>
								<TableCell>{tCustomers("columns.created")}</TableCell>
								<TableCell align="right">{tCustomers("columns.action")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{customers.map((customer) => (
								<TableRow key={customer.id} hover>
									<TableCell>
										<Stack gap={0.5}>
											<Typography fontWeight={700}>{customer.name || sharedPlaceholders.noName}</Typography>
											<Typography variant="body2" color="text.secondary">{customer.email}</Typography>
										</Stack>
									</TableCell>
									<TableCell>{customer.phone || sharedPlaceholders.emptyValue}</TableCell>
									<TableCell>
										<AdminStatusChip label={customer.isAdmin ? sharedStatus.admin : sharedStatus.user} tone={customer.isAdmin ? "accent" : "neutral"} />
									</TableCell>
									<TableCell>{formatAdminDate(customer.createdAt, locale)}</TableCell>
									<TableCell align="right">
										<Stack direction="row" gap={0.5} justifyContent="flex-end">
											<EditCustomerButton
												href={`/admin/customers/${customer.id}/edit`}
												size="small"
											/>
											<DeleteCustomerButton
												userId={customer.id}
												action={deleteAdminCustomerAction}
												icon={<DeleteOutlineOutlinedIcon key="delete-customer-icon" />}
												iconOnly
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