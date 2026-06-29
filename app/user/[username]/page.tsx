"use client";
import { use, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import StickerCard from "@/components/ui/StickerCard";
import { UserPlus, UserCheck, Users, Grid3X3 } from "lucide-react";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { user, toggleFollow, isFollowing } = useApp();
  const [profile, setProfile] = useState<any>(null);
  const [stickers, setStickers] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [tab, setTab] = useState<"stickers" | "followers" | "following">("stickers");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
     const { data: p } = await supabase.from("profiles").select("*").eq("username", decodeURIComponent(username)).single();
      if (!p) { setLoading(false); return; }
      setProfile(p);
      const { data: s } = await supabase.from("stickers").select("*, profiles(*)").eq("uploader_id", p.id);
      setStickers(s || []);
      const { data: frs } = await supabase.from("follows").select("profiles!follows_follower_id_fkey(*)").eq("following_id", p.id);
      setFollowers(frs?.map((f: any) => f.profiles) || []);
      const { data: fing } = await supabase.from("follows").select("profiles!follows_following_id_fkey(*)").eq("follower_id", p.id);
      setFollowing(fing?.map((f: any) => f.profiles) || []);
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12"><div className="h-40 rounded-3xl animate-pulse" style={{ background: "var(--card)" }} /></div>;
  if (!profile) return <div className="text-center py-20" style={{ color: "var(--muted)" }}>User not found.</div>;

  const isFollowingUser = isFollowing(profile.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-3xl p-8 mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`} alt={profile.username} className="w-24 h-24 rounded-full border-4" style={{ borderColor: "var(--primary)" }} />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">@{profile.username}</h1>
            <p className="text-sm mt-1 mb-4" style={{ color: "var(--muted)" }}>{profile.bio || "No bio yet."}</p>
            <div className="flex gap-6 justify-center sm:justify-start mb-4">
              {[["Stickers", stickers.length], ["Followers", followers.length], ["Following", following.length]].map(([label, val]) => (
                <div key={label} className="text-center">
                  <p className="font-bold text-lg">{val}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
                </div>
              ))}
            </div>
            {user && user.id !== profile.id && (
              <button onClick={() => toggleFollow(profile.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition hover:opacity-90" style={{ background: isFollowingUser ? "var(--bg)" : "var(--primary)", color: "#fff", border: isFollowingUser ? "1px solid var(--border)" : "none" }}>
                {isFollowingUser ? <><UserCheck size={15} /> Following</> : <><UserPlus size={15} /> Follow</>}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit mb-6" style={{ background: "var(--card)" }}>
        {([["stickers", Grid3X3, "Stickers"], ["followers", Users, "Followers"], ["following", UserPlus, "Following"]] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition" style={{ background: tab === key ? "var(--primary)" : "transparent", color: tab === key ? "#fff" : "var(--muted)" }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === "stickers" && (
        stickers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stickers.map(s => <StickerCard key={s.id} sticker={s} uploader={profile} />)}
          </div>
        ) : <p className="text-center py-12" style={{ color: "var(--muted)" }}>No stickers uploaded yet.</p>
      )}

      {(tab === "followers" || tab === "following") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(tab === "followers" ? followers : following).map((u: any) => u && (
            <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt={u.username} className="w-11 h-11 rounded-full border-2" style={{ borderColor: "var(--primary)" }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">@{u.username}</p>
                <p className="text-xs truncate" style={{ color: "var(--muted)" }}>{u.bio}</p>
              </div>
              <a href={`/user/${u.username}`} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "var(--primary)", color: "#fff" }}>View</a>
            </div>
          ))}
          {(tab === "followers" ? followers : following).length === 0 && (
            <p className="text-center py-8 col-span-2" style={{ color: "var(--muted)" }}>No {tab} yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
