import Link from "next/link";
import { Sparkles, Home, Search, Upload } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 relative">
        <div className="text-8xl font-black" style={{ color: "var(--border)" }}>404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={48} style={{ color: "var(--primary-light)" }} />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">This sticker got lost</h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "var(--muted)" }}>
        The page you're looking for doesn't exist or has been removed. Let's get you back on track.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:opacity-90" style={{ background: "var(--primary)", color: "#fff" }}>
          <Home size={15} /> Go Home
        </Link>
        <Link href="/search" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:opacity-80" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <Search size={15} /> Browse Stickers
        </Link>
        <Link href="/upload" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:opacity-80" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <Upload size={15} /> Upload
        </Link>
      </div>
    </div>
  );
}
