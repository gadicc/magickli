import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata, Viewport } from "next";

import theme from "@/theme";
import MyAppBar from "./MyAppBar";
import ClientProviders from "./clientProviders";
import "@/db";

const APP_NAME = "Magick.ly";
const APP_DEFAULT_TITLE = "Magick.ly";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Your Magick Toolkit";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  /*
  icons: {
    icon: "/favicons/android-chrome-512x512.png",
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  */
  verification: {
    google: "guHt3hzkAJ0hYCli_eD_e28PDoClPOQyvuAiJvGFo9k",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <ClientProviders>
              <React.Suspense fallback={null}>
                <MyAppBar />
              </React.Suspense>
              {props.children}
            </ClientProviders>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
