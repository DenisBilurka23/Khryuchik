import { OrderDownloadsPageView } from "@/components/order-downloads-page-view";
import { defaultLocale } from "@/i18n/config";
import { getOrderDownloadsByToken } from "@/server/downloads/order-downloads.service";

type OrderDownloadsPageProps = {
  params: Promise<{ token: string }>;
};

const OrderDownloadsPage = async ({ params }: OrderDownloadsPageProps) => {
  const { token } = await params;
  const bundle = await getOrderDownloadsByToken(token);

  return (
    <OrderDownloadsPageView
      locale={defaultLocale}
      orderId={bundle?.orderId}
      downloads={bundle?.downloads}
    />
  );
};

export default OrderDownloadsPage;
