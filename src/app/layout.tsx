import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});




export const metadata: Metadata = {
  title: "AGORA — Decentralised Social Media",
  description:
    "A decentralised social platform built on provenance transparency, feminist data privacy, and genuine free speech.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
