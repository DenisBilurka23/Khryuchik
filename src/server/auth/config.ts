import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { authenticateCredentialsUser, getAccountUserByEmail, syncGoogleUser } from "@/server/users/services/users.service";

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

        return authenticateCredentialsUser(email, password);
      },
    }),
    ...(isGoogleAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

      await syncGoogleUser({
        email: user.email,
        name: user.name,
        image: user.image,
      });

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const accountUser = await getAccountUserByEmail(user.email);

        if (accountUser) {
          token.userId = accountUser.id;
          token.email = accountUser.email;
          token.name = accountUser.name;
          token.phone = accountUser.phone;
          token.isAdmin = accountUser.isAdmin;
          token.authProviders = accountUser.authProviders;
          token.picture = accountUser.image ?? undefined;
        }
      }

      if (trigger === "update" && session?.user) {
        token.email = session.user.email ?? token.email;
        token.name = session.user.name ?? token.name;
        token.phone = session.user.phone ?? token.phone;
        token.isAdmin = session.user.isAdmin ?? token.isAdmin;
        token.authProviders = session.user.authProviders ?? token.authProviders;
        token.picture = session.user.image ?? token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.phone = typeof token.phone === "string" ? token.phone : "";
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.authProviders = Array.isArray(token.authProviders)
          ? token.authProviders.filter(
              (provider): provider is "google" | "credentials" =>
                provider === "google" || provider === "credentials",
            )
          : [];
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
      }

      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);