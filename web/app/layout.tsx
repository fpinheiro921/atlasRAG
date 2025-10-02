import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Atlas - Science-Based Nutrition & Fitness",
  description: "Systematic, science-backed nutrition management for sustainable fat loss and metabolic recovery",
  manifest: "/manifest.json",
  themeColor: "#020617",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:wght@700;900&family=Roboto+Flex:wght@400;500;600;700&display=optional&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </body>
    </html>
  );
}
