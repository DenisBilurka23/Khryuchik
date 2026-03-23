import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

import { bodyFont, displayFont } from "../fonts";
import "../globals.css";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default DefaultLayout;
