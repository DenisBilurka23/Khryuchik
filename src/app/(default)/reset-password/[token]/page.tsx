import { ResetPasswordPageView } from "@/components/reset-password-page-view";
import type { ResetPasswordPageProps } from "@/types/auth-pages";

const ResetPasswordPage = async ({ params }: ResetPasswordPageProps) => {
  const { token } = await params;

  return <ResetPasswordPageView token={token} loginHref="/login" />;
};

export default ResetPasswordPage;
