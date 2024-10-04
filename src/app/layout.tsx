import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { AppProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pingu",
  description: `
    Pingu - A fast, secure, and user-friendly messaging app that lets you stay connected with friends, family, and teams. 
    Enjoy real-time messaging, media sharing, and group chat features, all with privacy and security at the forefront.
  `
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={cn("min-h-screen bg-background text-foreground antialiased", inter.className)}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
