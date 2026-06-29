import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }} className="mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-2" style={{ color: "var(--primary-light)" }}>
            <Sparkles size={20} /> StickerVerse
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>The internet's favourite sticker community. Upload, discover, and vibe.</p>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: "var(--muted)" }}>Explore</p>
          <div className="flex flex-col gap-2">
            {["Browse", "Upload", "Search", "Dashboard"].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm hover:opacity-80 transition" style={{ color: "var(--text)" }}>{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: "var(--muted)" }}>Categories</p>
          <div className="flex flex-wrap gap-2">
            {["Anime", "Gaming", "Memes", "Cute", "Abstract"].map(c => (
              <Link key={c} href={`/search?category=${c}`} className="text-xs px-2 py-1 rounded-lg hover:opacity-80 transition" style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}>{c}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center py-4 text-xs" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        © 2025 StickerVerse — Built by SHANKS
      </div>
    </footer>
  );
}
