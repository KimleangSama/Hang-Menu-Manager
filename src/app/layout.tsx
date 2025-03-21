import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from 'nextjs-toploader';
import IdleHandler from "@/components/idle-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hang Menu",
  description: "Empowering businesses with a digital menu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#6082B6"
          crawl={false}
          showSpinner={false}
          shadow={false}
        />
        <IdleHandler />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
