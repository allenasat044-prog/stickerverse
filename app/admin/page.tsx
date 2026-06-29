"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { createClient } from "@/lib/supabase";
import { Shield, Users, Image, Flag, Ban, Trash2, LogIn, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, profile } = useApp();
  const [tab, setTab] = useState<"stats" | "users" | "stickers">("stats");
  const [users, setUsers] = useState<any[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [banned, setBanned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!profile?.is_admin) { setLoading(false); return; }
    async function load() {
      const { data: u } = await supabase.from("profiles").select("*").limit(50);
      const { data: s } = await supabase.from("stickers").select("*, profiles(*)").limit(50);
      setUsers(u || []);
      setStickers(s || []);
      setLoading(false);
    }
    load();
  }, [profile]);

  const handleDeleteSticker = async (id: string) => {
    await supabase.from("stickers").delete().eq("id", id);
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
      <Shield size={48} style={{ color: "var(--primary)" }} />
      <h2 className="text-xl font-bold">Admin Access Only</h2>
      <button onClick={() => router.push('/auth/signin')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium mt-2" style={{ background: "var(--primary)", color: "#fff" }}>
        <LogIn size={16} /> Sign In
      </button>
    </div>
  );

  if (!profile?.is_admin) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <Shield size={48} style={{ color: "var(--primary)" }} />
      <h2 className="text-xl font-bold">Admin Access Only</h2>
      <p style={{ color: "var(--muted)" }}>You don&apos;t have permission to view this page.</p>
    </div>
  );

  const totalDownloads = stickers.reduce((s, st) => s + (st.download_count || 0), 0);
  const platformStats = [
    { label: "Total Users", value: users.length, icon: Users, color: "var(--primary)" },
    { label: "Total Stickers", value: stickers.length, icon: Image, color: "var(--accent)" },
    { label: "Total Downloads", value: totalDownloads.toLocaleString(), icon: BarChart3, color: "#F59E0B" },
    { label: "Flagged", value: flagged.size, icon: Flag, color: "#EF4444" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
          <Shield size={20} style={{ color: "var(--primary-light)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Manage users, stickers, and platform health.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit mb-8" style={{ background: "var(--card)" }}>
        {([["stats", BarChart3, "Stats"], ["users", Users, "Users"], ["stickers", Image, "Stickers"]] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition" style={{ background: tab === key ? "var(--primary)" : "transparent", color: tab === key ? "#fff" : "var(--muted)" }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {platformStats.map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}22` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                {["User", "Followers", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", background: banned.has(u.id) ? "rgba(239,68,68,0.05)" : "transparent" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt={u.username} className="w-8 h-8 rounded-full" />
                      <span className="font-medium">@{u.username}</span>
                      {u.is_admin && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.2)", color: "var(--primary-light)" }}>Admin</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.follower_count || 0}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: banned.has(u.id) ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: banned.has(u.id) ? "#EF4444" : "#10B981" }}>
                      {banned.has(u.id) ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setBanned(prev => { const n = new Set(prev); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                      <Ban size={12} /> {banned.has(u.id) ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "stickers" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stickers.map(s => (
            <div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: `1px solid ${flagged.has(s.id) ? "#EF4444" : "var(--border)"}` }}>
              <div className="relative h-32 flex items-center justify-center" style={{ background: "var(--bg)" }}>
                <img src={s.image_url} alt={s.title} className="h-full w-full object-contain p-3" />
                {flagged.has(s.id) && <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}><Flag size={24} color="#EF4444" /></div>}
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{s.title}</p>
                <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{s.category} · {(s.download_count || 0).toLocaleString()} downloads</p>
                <div className="flex gap-2">
                  <button onClick={() => setFlagged(prev => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg" style={{ background: flagged.has(s.id) ? "rgba(239,68,68,0.2)" : "var(--bg)", color: flagged.has(s.id) ? "#EF4444" : "var(--muted)", border: "1px solid var(--border)" }}>
                    <Flag size={11} /> {flagged.has(s.id) ? "Unflag" : "Flag"}
                  </button>
                  <button onClick={() => handleDeleteSticker(s.id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                    <Trash2 size={11} /> Remove
                  </button>
                  <Link href={`/sticker/${s.id}`} className="flex-1 flex items-center justify-center text-xs py-1.5 rounded-lg" style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}>View</Link>
                </div>
              </div>
            </div>
          ))}
          {stickers.length === 0 && <p className="text-center py-12 col-span-3" style={{ color: "var(--muted)" }}>No stickers yet.</p>}
        </div>
      )}
    </div>
  );
}
