import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

import { api } from "../utils/api";

import "../styles/globals.css";
import "@radix-ui/themes/styles.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Theme>
          <div className={GeistSans.className}>
            <Component {...pageProps} />
          </div>
        </Theme>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
