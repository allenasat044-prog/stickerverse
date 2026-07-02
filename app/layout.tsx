import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "StickerVerse — Share & Discover Stickers",
    template: "%s | StickerVerse",
  },
  description: "The internet's favourite sticker community. Upload your art, discover stickers from creators worldwide, and build your collection.",
  keywords: ["stickers", "sticker pack", "download stickers", "anime stickers", "gaming stickers", "free stickers"],
  authors: [{ name: "StickerVerse" }],
  creator: "StickerVerse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stickerverse-ruddy.vercel.app",
    siteName: "StickerVerse",
    title: "StickerVerse — Share & Discover Stickers",
    description: "The internet's favourite sticker community. Upload, discover, and vibe.",
    images: [{
      url: "https://stickerverse-ruddy.vercel.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "StickerVerse",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StickerVerse — Share & Discover Stickers",
    description: "The internet's favourite sticker community. Upload, discover, and vibe.",
    images: ["https://stickerverse-ruddy.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
