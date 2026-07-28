import { notFound } from "next/navigation";

import { OrderDownloadsPageView } from "@/components/order-downloads-page-view";
import { getOrderDownloadsByToken } from "@/server/downloads/order-downloads.service";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedOrderDownloadsPageProps = {
  params: Promise<{ lang: string; token: string }>;
};

const LocalizedOrderDownloadsPage = async ({
  params,
}: LocalizedOrderDownloadsPageProps) => {
  const { lang, token } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

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
