"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, Upload, Menu, X, Sparkles, LogIn, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, profile, signOut } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) router.push(`/search?q=${encodeURIComponent(searchVal)}`);
  };

  return (
    <nav style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0" style={{ color: "var(--primary-light)" }}>
          <Sparkles size={22} />
          <span className="hidden sm:block">StickerVerse</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <Search size={16} style={{ color: "var(--muted)" }} />
          <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search stickers..." className="bg-transparent outline-none text-sm flex-1" style={{ color: "var(--text)" }} />
        </form>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link href="/search" className="text-sm px-3 py-1.5 rounded-lg hover:opacity-80 transition" style={{ color: "var(--muted)" }}>Browse</Link>
          <Link href="/upload" className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-medium transition hover:opacity-90" style={{ background: "var(--primary)", color: "#fff" }}>
            <Upload size={15} /> Upload
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="p-2 rounded-lg hover:opacity-80" style={{ color: "var(--accent)" }}><LayoutDashboard size={18} /></Link>
              {profile?.is_admin && <Link href="/admin" className="p-2 rounded-lg hover:opacity-80" style={{ color: "var(--accent)" }}><Shield size={18} /></Link>}
              <Link href={`/user/${profile?.username || user.id}`}>
                <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-8 h-8 rounded-full border-2 object-cover" style={{ borderColor: "var(--primary)" }} />
              </Link>
              <button onClick={signOut} className="p-2 rounded-lg hover:opacity-80" style={{ color: "var(--muted)" }}><LogOut size={18} /></button>
            </div>
          ) : (
            <Link href="/auth/signin" className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-medium transition hover:opacity-90" style={{ background: "var(--accent)", color: "#000" }}>
              <LogIn size={15} /> Sign In
            </Link>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-auto p-2 rounded-lg" style={{ color: "var(--text)" }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <form onSubmit={handleSearch}>
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search stickers..." className="mt-3 w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </form>
          <Link href="/search" className="text-sm py-2" style={{ color: "var(--muted)" }} onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link href="/upload" className="text-sm py-2 text-center rounded-xl font-medium" style={{ background: "var(--primary)", color: "#fff" }} onClick={() => setMenuOpen(false)}>Upload Sticker</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm py-2" style={{ color: "var(--accent)" }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-sm py-2 text-left" style={{ color: "var(--muted)" }}>Sign Out</button>
            </>
          ) : (
            <Link href="/auth/signin" className="text-sm py-2 text-center rounded-xl font-medium" style={{ background: "var(--accent)", color: "#000" }} onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
