import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "StickerVerse — Share & Discover Stickers",
  description: "The best place to upload, discover, and download stickers made by creators worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
