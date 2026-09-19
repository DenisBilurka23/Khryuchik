import { OrderDownloadsPageView } from "@/components/order-downloads-page-view";
import { getOrderDownloadsByToken } from "@/server/downloads/order-downloads.service";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedOrderDownloadsPageProps = {
  params: Promise<{ lang: string; token: string }>;
};

const LocalizedOrderDownloadsPage = async ({
  params,
}: LocalizedOrderDownloadsPageProps) => {
  const { lang, token } = await params;

  await requireActiveLocale(lang);

  const bundle = await getOrderDownloadsByToken(token);

  return (
    <OrderDownloadsPageView
      locale={lang}
      orderId={bundle?.orderId}
      downloads={bundle?.downloads}
    />
  );
};

export default LocalizedOrderDownloadsPage;
