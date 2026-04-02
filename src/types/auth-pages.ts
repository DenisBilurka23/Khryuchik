export type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export type RegisterPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export type ForgotPasswordPageProps = {
  searchParams: Promise<Record<string, never>>;
};

export type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export type LocalizedLoginPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
};

export type LocalizedRegisterPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
};

export type LocalizedForgotPasswordPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, never>>;
};

export type LocalizedResetPasswordPageProps = {
  params: Promise<{ lang: string; token: string }>;
};

export type LocalizedAccountPageProps = {
  params: Promise<{ lang: string }>;
};