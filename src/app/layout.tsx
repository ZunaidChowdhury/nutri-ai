import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "NutriAI",
  description: "AI-powered nutrition and meal planning assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
