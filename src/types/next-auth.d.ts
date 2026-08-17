import type { JWT as DefaultJWT } from "next-auth/jwt";

import type { AuthProvider, UserShippingAddress } from "@/types/users";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      image?: string | null;
      phone: string;
      isAdmin: boolean;
      authProviders: AuthProvider[];
      shippingAddresses: UserShippingAddress[];
      selectedShippingAddressId: string | null;
    };
  }

  interface User {
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    isAdmin?: boolean;
    authProviders?: AuthProvider[];
    shippingAddresses?: UserShippingAddress[];
    selectedShippingAddressId?: string | null;
  }
}
