import '@mantine/core/styles.css';
import '@/globals.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';

import { theme } from '../theme';

import '@mantine/notifications/styles.css';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'UNC Club Water Polo',
  description: "UNC Men's Water Polo",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="light" />

        <link href="https://fonts.cdnfonts.com/css/ransom-note" rel="stylesheet" />

        <link href="https://fonts.cdnfonts.com/css/ransom-note" rel="stylesheet" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Text:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        {/* <AuthProvider> */}
        <MantineProvider theme={theme}>
          <Notifications />
          <Header />
          {children}
          <Footer />
        </MantineProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
