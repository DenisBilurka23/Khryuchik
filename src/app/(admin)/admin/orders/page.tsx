import type { Metadata } from "next";
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

import { deleteAdminOrderAction } from "@/app/(admin)/admin/actions";
import {
  AdminOrderDeleteButton,
  AdminOrderPaymentConfirmButton,
  AdminOrderPrintifyCancelButton,
  AdminOrderProductionButton,
  AdminOrderRefundButton,
  AdminOrderStatusSelect,
} from "@/components/admin-orders-page-view";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
} from "@/components/admin-page-shared";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import { findOrders } from "@/server/orders/repositories/orders.repository";
import type { AdminPageDictionary } from "@/i18n/types";
import {
  formatCurrency,
  formatCustomerName,
  formatOrderNumber,
  hasLivePrintifyOrder,
  isRefundableOrder,
} from "@/utils";

type OrderColumns = AdminPageDictionary["orders"]["columns"];

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tOrders = await getTranslations({
    locale,
    namespace: "adminPage.orders",
  });

  return createAdminMetadata(tOrders("title"), tOrders("description"), locale);
};

const AdminOrdersPage = async () => {
  const locale = await resolveLocale("admin");
  const tOrders = await getTranslations({
    locale,
    namespace: "adminPage.orders",
  });
  const orders = await findOrders();

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
        eyebrow={tOrders("eyebrow")}
        title={tOrders("title")}
        description={tOrders("description")}
      />

      <AdminSectionCard
        title={tOrders("sectionTitle")}
        description={tOrders("sectionDescription")}
      >
        {orders.length === 0 ? (
          <AdminEmptyState
            title={tOrders("emptyTitle")}
            description={tOrders("emptyDescription")}
            action={
              <Button href="/checkout" variant="outlined">
                {tOrders("action")}
              </Button>
            }
          />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{columns.order}</TableCell>
                  <TableCell>{columns.createdAt}</TableCell>
                  <TableCell>{columns.customer}</TableCell>
                  <TableCell>{columns.country}</TableCell>
                  <TableCell align="right">{columns.total}</TableCell>
                  <TableCell>{columns.payment}</TableCell>
                  <TableCell>{columns.status}</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>
                        {formatOrderNumber(order.id)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString(locale)}
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography>
                          {formatCustomerName(order.customer)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customer.email ?? order.customer.phone ?? ""}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{order.country}</TableCell>
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
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        {order.payment.status === "pending" &&
                          order.payment.method !== "stripe" && (
                            <AdminOrderPaymentConfirmButton
                              orderId={order.id}
                            />
                          )}
                        {order.printifyOrder &&
                          !order.printifyOrder.sentToProductionAt &&
                          !order.printifyOrder.cancelledAt && (
                            <AdminOrderProductionButton
                              orderId={order.id}
                              lastError={order.printifyOrder.lastError}
                            />
                          )}
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
                        {order.printifyOrder?.printifyOrderId &&
                          !order.printifyOrder.sentToProductionAt &&
                          !order.printifyOrder.cancelledAt && (
                            <AdminOrderPrintifyCancelButton
                              orderId={order.id}
                              cancelError={order.printifyOrder.cancelError}
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
                      </Stack>
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

export default AdminOrdersPage;
