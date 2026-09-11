import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { ThemeScript } from "@/components/ThemeScript";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DeveloperBar from "@/components/DeveloperBar";

export const metadata: Metadata = {
  title: "NutriAI",
  description: "AI-powered nutrition and meal planning assistant",
  icons: { icon: "/NutriAI-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <head>
          <ThemeScript />
        </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {process.env.NEXT_PUBLIC_SHOW_DEV_BAR === "1" && <DeveloperBar />}
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
