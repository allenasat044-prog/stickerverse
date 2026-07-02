import { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/server/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();
  const { data: stickers } = await supabase.from("stickers").select("id, created_at");
  const { data: profiles } = await supabase.from("profiles").select("username, created_at");

  const baseUrl = "https://stickerverse-ruddy.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/upload`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const stickerPages = (stickers || []).map(s => ({
    url: `${baseUrl}/sticker/${s.id}`,
    lastModified: new Date(s.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const profilePages = (profiles || []).filter(p => p.username).map(p => ({
    url: `${baseUrl}/user/${encodeURIComponent(p.username)}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...stickerPages, ...profilePages];
}
