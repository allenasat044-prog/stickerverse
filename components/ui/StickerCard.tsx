"use client";
import Link from "next/link";
import { Download } from "lucide-react";

interface Props {
  sticker: any;
  uploader: any;
}

export default function StickerCard({ sticker, uploader }: Props) {
  if (!sticker) return null;
  const count = sticker.download_count ?? sticker.downloadCount ?? 0;
  const title = sticker.title;
  const imageUrl = sticker.image_url ?? sticker.imageUrl ?? "";
  const category = sticker.category;
  const username = uploader?.username ?? "unknown";
  const avatarUrl = uploader?.avatar_url ?? uploader?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="sticker-card rounded-2xl overflow-hidden group cursor-pointer" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <Link href={`/sticker/${sticker.id}`}>
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-cyan-900/20" style={{ height: 180 }}>
          <img src={imageUrl} alt={title} className="sticker-img w-full h-full object-contain p-4" />
          {category && <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.7)", color: "#fff" }}>{category}</span>}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/sticker/${sticker.id}`}>
          <p className="font-semibold text-sm truncate hover:opacity-80">{title}</p>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <Link href={`/user/${username}`} className="flex items-center gap-1.5 hover:opacity-80">
            <img src={avatarUrl} alt={username} className="w-5 h-5 rounded-full" />
            <span className="text-xs" style={{ color: "var(--muted)" }}>@{username}</span>
          </Link>
          <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg" style={{ background: "var(--primary)", color: "#fff" }}>
            <Download size={12} />
            {count.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {(sticker.tags || []).slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
