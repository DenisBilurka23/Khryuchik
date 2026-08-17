import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { sendWelcomeEmail } from "@/server/email/welcome";
import { SignInErrorCode } from "@/types/auth";
import { resolveLocale } from "@/server/i18n/request-locale";
import { formatPersonName } from "@/utils";
import {
  authenticateCredentialsUser,
  getAccountUserByEmail,
  syncGoogleUser,
} from "@/server/users/services/users.service";

export const isGoogleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const result = await authenticateCredentialsUser(email, password);

        if (result.ok) {
          return result.user;
        }

        if (result.reason === SignInErrorCode.EmailNotVerified) {
          throw new Error(SignInErrorCode.EmailNotVerified);
        }

        return null;
      },
    }),
    ...(isGoogleAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
              params: {
                prompt: "select_account",
              },
            },
            profile: (profile) => ({
              id: profile.sub,
              email: profile.email,
              image: profile.picture,
              firstName: profile.given_name?.trim() ?? "",
              lastName: profile.family_name?.trim() ?? "",
            }),
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const { isNewUser } = await syncGoogleUser({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      });

      if (isNewUser) {
        const locale = await resolveLocale("storefront");
        void sendWelcomeEmail(
          user.email,
          formatPersonName(user.firstName, user.lastName),
          locale,
        );
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const accountUser = await getAccountUserByEmail(user.email);

        if (accountUser) {
          token.userId = accountUser.id;
          token.email = accountUser.email;
          token.firstName = accountUser.firstName;
          token.lastName = accountUser.lastName;
          token.phone = accountUser.phone;
          token.isAdmin = accountUser.isAdmin;
          token.authProviders = accountUser.authProviders;
          token.picture = accountUser.image ?? undefined;
          token.shippingAddresses = accountUser.shippingAddresses;
          token.selectedShippingAddressId =
            accountUser.selectedShippingAddressId;
        }
      }

      if (trigger === "update" && session?.user) {
        token.email = session.user.email ?? token.email;
        token.firstName = session.user.firstName ?? token.firstName;
        token.lastName = session.user.lastName ?? token.lastName;
        token.phone = session.user.phone ?? token.phone;
        token.isAdmin = session.user.isAdmin ?? token.isAdmin;
        token.authProviders = session.user.authProviders ?? token.authProviders;
        token.picture = session.user.image ?? token.picture;
        token.shippingAddresses =
          session.user.shippingAddresses ?? token.shippingAddresses;
        token.selectedShippingAddressId =
          session.user.selectedShippingAddressId ??
          token.selectedShippingAddressId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        session.user.firstName =
          typeof token.firstName === "string" ? token.firstName : "";
        session.user.lastName =
          typeof token.lastName === "string" ? token.lastName : "";
        session.user.phone = typeof token.phone === "string" ? token.phone : "";
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.authProviders = Array.isArray(token.authProviders)
          ? token.authProviders.filter(
              (provider): provider is "google" | "credentials" =>
                provider === "google" || provider === "credentials",
            )
          : [];
        session.user.image =
          typeof token.picture === "string"
            ? token.picture
            : session.user.image;
        session.user.shippingAddresses = Array.isArray(token.shippingAddresses)
          ? token.shippingAddresses
          : [];
        session.user.selectedShippingAddressId =
          typeof token.selectedShippingAddressId === "string"
            ? token.selectedShippingAddressId
            : null;
      }

      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
