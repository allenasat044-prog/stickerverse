"use client";
import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Download, Heart, UserPlus, UserCheck, Calendar, Tag } from "lucide-react";

export default function StickerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, toggleFollow, isFollowing } = useApp();
  const [sticker, setSticker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("stickers")
        .select("*, profiles(*)")
        .eq("id", id)
        .single();
      setSticker(data);
      setLoading(false);
    }
    load();
  }, [id]);

 const handleDownload = async () => {
    if (!sticker) return;
    await supabase.from("stickers").update({ download_count: (sticker.download_count || 0) + 1 }).eq("id", sticker.id);
    setSticker((prev: any) => ({ ...prev, download_count: (prev.download_count || 0) + 1 }));
    const response = await fetch(sticker.image_url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sticker.title || "sticker"}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {[1,2].map(i => <div key={i} className="h-80 rounded-3xl animate-pulse" style={{ background: "var(--card)" }} />)}
    </div>
  );

  if (!sticker) return <div className="text-center py-20" style={{ color: "var(--muted)" }}>Sticker not found.</div>;

  const uploader = sticker.profiles;
  const following = uploader ? isFollowing(uploader.id) : false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="rounded-3xl overflow-hidden flex items-center justify-center p-8" style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1628)", border: "1px solid var(--border)", minHeight: 340 }}>
          <img src={sticker.image_url} alt={sticker.title} className="max-w-full max-h-72 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs px-3 py-1 rounded-full mb-3 inline-block" style={{ background: "rgba(124,58,237,0.2)", color: "var(--primary-light)", border: "1px solid rgba(124,58,237,0.3)" }}>{sticker.category}</span>
            <h1 className="text-3xl font-bold mt-2">{sticker.title}</h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{sticker.description}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <Download size={15} style={{ color: "var(--accent)" }} />
              <span>{(sticker.download_count || 0).toLocaleString()} downloads</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <Calendar size={15} style={{ color: "var(--accent)" }} />
              <span>{new Date(sticker.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(sticker.tags || []).map((tag: string) => (
              <Link key={tag} href={`/search?tag=${tag}`} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full hover:opacity-80 transition" style={{ background: "var(--card)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                <Tag size={10} />#{tag}
              </Link>
            ))}
          </div>

          {uploader && (
            <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <Link href={`/user/${encodeURIComponent(uploader.username)}`}>
                <img src={uploader.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uploader.id}`} alt={uploader.username} className="w-12 h-12 rounded-full border-2" style={{ borderColor: "var(--primary)" }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/user/${encodeURIComponent(uploader.username)}`} className="font-semibold hover:opacity-80">@{uploader.username}</Link>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>{uploader.bio}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{(uploader.follower_count || 0).toLocaleString()} followers</p>
              </div>
              {user && user.id !== uploader.id && (
                <button onClick={() => toggleFollow(uploader.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition hover:opacity-80" style={{ background: following ? "var(--bg)" : "var(--primary)", color: "#fff", border: following ? "1px solid var(--border)" : "none" }}>
                  {following ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
                </button>
              )}
            </div>
          )}

          <button onClick={handleDownload} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold transition hover:opacity-90" style={{ background: "var(--primary)", color: "#fff" }}>
            <Download size={22} /> Download Sticker
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition hover:opacity-80" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
            <Heart size={16} /> Save to Collection
          </button>
        </div>
      </div>
    </div>
  );
}
