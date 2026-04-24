import type { Metadata } from "next";
import "./globals.css";




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
