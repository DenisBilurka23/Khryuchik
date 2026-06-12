import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

import type { AuthProvider, UserShippingAddress } from "@/types/users";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      phone: string;
      isAdmin: boolean;
      authProviders: AuthProvider[];
      shippingAddresses: UserShippingAddress[];
      selectedShippingAddressId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    phone?: string;
    isAdmin?: boolean;
    authProviders?: AuthProvider[];
    shippingAddresses?: UserShippingAddress[];
    selectedShippingAddressId?: string | null;
  }
}