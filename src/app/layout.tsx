import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solotrip Mate",
  description: "Find your perfect travel companion",
};

import { InviteModeNotice } from "@/components/layout/InviteModeNotice";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppProvider } from "@/components/providers/AppProvider";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pb-20 lg:pb-0 min-h-screen bg-background font-sans antialiased flex flex-col">
        <AppProvider>
          <Navbar />
          <InviteModeNotice />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
