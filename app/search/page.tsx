"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import StickerCard from "@/components/ui/StickerCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { CATEGORIES } from "@/mocks/data";
import { Search } from "lucide-react";
export const metadata = { title: "Browse Stickers", description: "Search and discover thousands of stickers across anime, gaming, memes and more." };

function SearchContent() {
  const searchParams = useSearchParams();
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from("stickers").select("*, profiles(*)").limit(24);
      if (category) query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);
      const { data } = await query;
      setStickers(data || []);
      setLoading(false);
    }
    load();
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <p className="font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => setCategory("")} className="text-left px-3 py-2 rounded-lg text-sm transition" style={{ background: !category ? "var(--primary)" : "transparent", color: !category ? "#fff" : "var(--muted)" }}>All</button>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c === category ? "" : c)} className="text-left px-3 py-2 rounded-lg text-sm transition" style={{ background: category === c ? "var(--primary)" : "transparent", color: category === c ? "#fff" : "var(--muted)" }}>{c}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <Search size={16} style={{ color: "var(--muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stickers by name..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--text)" }} />
          </div>
          {loading ? <GridSkeleton count={8} /> : stickers.length === 0 ? (
            <div className="text-center py-20" style={{ color: "var(--muted)" }}>
              <p className="text-lg">No stickers found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{stickers.length} sticker{stickers.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {stickers.map(s => <StickerCard key={s.id} sticker={s} uploader={s.profiles} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<GridSkeleton count={8} />}><SearchContent /></Suspense>;
}
