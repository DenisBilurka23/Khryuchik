import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { deleteAdminOrderAction } from "@/app/(admin)/admin/actions";
import {
  AdminOrderDeleteButton,
  AdminOrderRefundButton,
  AdminOrderStatusSelect,
} from "@/components/admin-orders-page-view";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
} from "@/components/admin-page-shared";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { getAdminCustomerEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { resolveLocale } from "@/server/i18n/request-locale";
import { formatAdminDate } from "@/utils/admin";
import {
  formatCurrency,
  formatOrderNumber,
  formatPersonName,
  hasLivePrintifyOrder,
  isRefundableOrder,
} from "@/utils";
import type { AdminPageDictionary } from "@/i18n/types";

type ViewAdminCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: ViewAdminCustomerPageProps): Promise<Metadata> => {
  const [locale, { id }] = await Promise.all([resolveLocale("admin"), params]);
  const tCustomerView = await getTranslations({
    locale,
    namespace: "adminPage.customers.view",
  });

  return createAdminMetadata(
    `${tCustomerView("title")}: ${id}`,
    tCustomerView("description"),
    locale,
  );
};

type OrderColumns = AdminPageDictionary["orders"]["columns"];

const ViewAdminCustomerPage = async ({
  params,
}: ViewAdminCustomerPageProps) => {
  const [{ id }, locale] = await Promise.all([params, resolveLocale("admin")]);

  await requireAdminPageAccess("/admin/customers");

  const customer = await getAdminCustomerEditorData(id);
  if (!customer) {
    notFound();
  }

  const [orders, tCustomerView, tOrders] = await Promise.all([
    findOrdersForUser(customer.id, customer.email || undefined),
    getTranslations({ locale, namespace: "adminPage.customers.view" }),
    getTranslations({ locale, namespace: "adminPage.orders" }),
  ]);

  const columns = tOrders.raw("columns") as OrderColumns;
  const paymentMethodLabels = tOrders.raw("paymentMethodLabels") as Record<
    string,
    string
  >;
  const paymentStatusLabels = tOrders.raw("paymentStatusLabels") as Record<
    string,
    string
  >;

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tCustomerView("eyebrow")}
        title={`${tCustomerView("title")}: ${formatPersonName(customer.firstName, customer.lastName) || customer.email}`}
        description={tCustomerView("description")}
      />

      <Stack direction="row" gap={1.5} flexWrap="wrap">
        <Link href="/admin/customers" style={{ textDecoration: "none" }}>
          <Button component="span" variant="outlined">
            {tCustomerView("backToList")}
          </Button>
        </Link>
        <Link
          href={`/admin/customers/${customer.id}/edit`}
          style={{ textDecoration: "none" }}
        >
          <Button
            component="span"
            variant="contained"
            startIcon={<EditOutlinedIcon />}
          >
            {tCustomerView("editAction")}
          </Button>
        </Link>
      </Stack>

      <AdminSectionCard
        title={tCustomerView("profileTitle")}
        description={tCustomerView("profileDescription")}
      >
        <Stack gap={1.5}>
          <Typography>
            <strong>{tCustomerView("fields.firstName")}: </strong>
            {customer.firstName || "—"}
          </Typography>
          <Typography>
            <strong>{tCustomerView("fields.lastName")}: </strong>
            {customer.lastName || "—"}
          </Typography>
          <Typography>
            <strong>{tCustomerView("fields.email")}: </strong>
            {customer.email || "—"}
          </Typography>
          <Typography>
            <strong>{tCustomerView("fields.phone")}: </strong>
            {customer.phone || "—"}
          </Typography>
          <Typography>
            <strong>{tCustomerView("fields.role")}: </strong>
            {customer.isAdmin
              ? tCustomerView("roles.admin")
              : tCustomerView("roles.user")}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {tCustomerView("fields.createdAt")}:{" "}
            {formatAdminDate(customer.createdAt, locale)}
          </Typography>
        </Stack>
      </AdminSectionCard>

      <AdminSectionCard
        title={tCustomerView("ordersTitle")}
        description={`${tCustomerView("ordersDescription")}: ${orders.length}`}
      >
        {orders.length === 0 ? (
          <AdminEmptyState
            title={tCustomerView("noOrdersTitle")}
            description={tCustomerView("noOrdersDescription")}
          />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{columns.order}</TableCell>
                  <TableCell>{columns.createdAt}</TableCell>
                  <TableCell align="right">{columns.total}</TableCell>
                  <TableCell>{columns.payment}</TableCell>
                  <TableCell>{columns.status}</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {formatOrderNumber(order.id)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString(locale)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(order.total, locale, order.currency)}
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography variant="body2">
                          {paymentMethodLabels[order.payment.method] ??
                            order.payment.method}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {paymentStatusLabels[order.payment.status] ??
                            order.payment.status}
                        </Typography>
                        {order.payment.refundedAmount !== undefined && (
                          <Typography variant="caption" color="text.secondary">
                            {tOrders("refundedAmountLabel", {
                              amount: formatCurrency(
                                order.payment.refundedAmount,
                                locale,
                                order.currency,
                              ),
                            })}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <AdminOrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {isRefundableOrder(order) && (
                        <AdminOrderRefundButton
                          orderId={order.id}
                          amount={formatCurrency(
                            order.total,
                            locale,
                            order.currency,
                          )}
                        />
                      )}
                      <AdminOrderDeleteButton
                        orderId={order.id}
                        action={deleteAdminOrderAction}
                        disabledReason={
                          hasLivePrintifyOrder(order)
                            ? tOrders("delete.blockedByPrintify")
                            : undefined
                        }
                        icon={
                          <DeleteOutlineOutlinedIcon key="delete-order-icon" />
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AdminSectionCard>
    </Stack>
  );
};

export default ViewAdminCustomerPage;
