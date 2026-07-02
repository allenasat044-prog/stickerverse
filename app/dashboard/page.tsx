"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { createClient } from "@/lib/supabase";
import { Download, Users, Image, Trash2, Edit, Settings, BarChart3, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useApp();
  const [tab, setTab] = useState<"overview" | "stickers" | "settings">("overview");
  const [stickers, setStickers] = useState<any[]>([]);
  const [followers, setFollowers] = useState(0);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (profile) { setBio(profile.bio || ""); setUsername(profile.username || ""); }
  }, [profile]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function load() {
      const { data } = await supabase
        .from("stickers")
        .select("*")
        .eq("uploader_id", user!.id)
        .order("created_at", { ascending: false });
      setStickers(data || []);
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user!.id);
      setFollowers(count || 0);
      setLoading(false);
    }
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from("stickers").delete().eq("id", id);
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ bio, username }).eq("id", user.id);
    await refreshProfile();
    setSaving(false);
  };

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-5xl">🔒</div>
      <h2 className="text-xl font-bold">Sign in to access your Dashboard</h2>
      <button onClick={() => router.push('/auth/signin')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium mt-2" style={{ background: "var(--primary)", color: "#fff" }}>
        <LogIn size={16} /> Sign In
      </button>
    </div>
  );

  const totalDownloads = stickers.reduce((sum, s) => sum + (s.download_count || 0), 0);
  const stats = [
    { label: "Stickers Uploaded", value: stickers.length, icon: Image, color: "var(--primary)" },
    { label: "Total Downloads", value: totalDownloads.toLocaleString(), icon: Download, color: "var(--accent)" },
    { label: "Followers", value: followers.toLocaleString(), icon: Users, color: "#F59E0B" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-14 h-14 rounded-full border-2 object-cover" style={{ borderColor: "var(--primary)" }} />
        <div>
          <h1 className="text-2xl font-bold">Welcome back, @{profile?.username} 👋</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Here&apos;s how your stickers are performing.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit mb-8" style={{ background: "var(--card)" }}>
        {([["overview", BarChart3, "Overview"], ["stickers", Image, "My Stickers"], ["settings", Settings, "Settings"]] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition" style={{ background: tab === key ? "var(--primary)" : "transparent", color: tab === key ? "#fff" : "var(--muted)" }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl p-6 flex items-center gap-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="font-semibold mb-4">Top Performing Stickers</h3>
            <div className="space-y-3">
              {stickers.sort((a, b) => b.download_count - a.download_count).slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <img src={s.image_url} alt={s.title} className="w-10 h-10 rounded-lg object-contain" style={{ background: "var(--bg)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{s.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm" style={{ color: "var(--accent)" }}>
                    <Download size={13} />{(s.download_count || 0).toLocaleString()}
                  </div>
                </div>
              ))}
              {stickers.length === 0 && <p className="text-sm text-center py-4" style={{ color: "var(--muted)" }}>No stickers yet. <Link href="/upload" style={{ color: "var(--primary-light)" }}>Upload one!</Link></p>}
            </div>
          </div>
        </div>
      )}

      {tab === "stickers" && (
        <div className="space-y-3">
          {loading && <div className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--card)" }} />}
          {!loading && stickers.length === 0 && (
            <div className="text-center py-16" style={{ color: "var(--muted)" }}>
              <p>You haven&apos;t uploaded anything yet.</p>
              <Link href="/upload" className="inline-block mt-3 px-5 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--primary)", color: "#fff" }}>Upload your first sticker</Link>
            </div>
          )}
          {stickers.map(s => (
            <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <img src={s.image_url} alt={s.title} className="w-14 h-14 rounded-xl object-contain" style={{ background: "var(--bg)" }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.category} · {new Date(s.created_at).toLocaleDateString()}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{(s.download_count || 0).toLocaleString()} downloads</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/sticker/${s.id}`} className="p-2 rounded-lg hover:opacity-80 transition" style={{ background: "var(--bg)", color: "var(--muted)" }}><Edit size={15} /></Link>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:opacity-80 transition" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="max-w-lg space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="avatar" className="w-16 h-16 rounded-full border-2 object-cover" style={{ borderColor: "var(--primary)" }} />
            <div>
              <p className="font-medium">Profile Picture</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Synced from your OAuth provider</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }} />
          </div>
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-50" style={{ background: "var(--primary)", color: "#fff" }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
