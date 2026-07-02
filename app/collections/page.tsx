"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import StickerCard from "@/components/ui/StickerCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { Heart, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export const metadata = { title: "My Collection", description: "View all your saved stickers on StickerVerse." };

export default function CollectionsPage() {
  const { user } = useApp();
  const [stickers, setStickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function load() {
      const { data } = await supabase
        .from("collections")
        .select("sticker_id, stickers(*, profiles(*))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      setStickers(data?.map((d: any) => d.stickers).filter(Boolean) || []);
      setLoading(false);
    }
    load();
  }, [user]);

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <Heart size={48} style={{ color: "var(--primary)" }} />
      <h2 className="text-xl font-bold">Sign in to view your collection</h2>
      <button onClick={() => router.push('/auth/signin')} className="px-6 py-3 rounded-xl font-medium" style={{ background: "var(--primary)", color: "#fff" }}>
        <LogIn size={16} className="inline mr-2" />Sign In
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={24} style={{ color: "var(--primary-light)" }} />
        <h1 className="text-2xl font-bold">My Collection</h1>
        {!loading && <span className="text-sm px-3 py-1 rounded-full" style={{ background: "var(--card)", color: "var(--muted)", border: "1px solid var(--border)" }}>{stickers.length} saved</span>}
      </div>

      {loading ? <GridSkeleton count={8} /> : stickers.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Heart size={48} className="opacity-20" />
          <p className="text-lg font-medium">No stickers saved yet</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Browse stickers and click "Save to Collection" to add them here.</p>
          <button onClick={() => router.push('/search')} className="px-5 py-2.5 rounded-xl font-medium text-sm" style={{ background: "var(--primary)", color: "#fff" }}>Browse Stickers</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stickers.map(s => <StickerCard key={s.id} sticker={s} uploader={s.profiles} />)}
        </div>
      )}
    </div>
  );
}
