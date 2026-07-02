import { createServerSupabaseClient } from "@/lib/server/supabase";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: sticker } = await supabase
    .from("stickers")
    .select("*, profiles(username)")
    .eq("id", id)
    .single();

  if (!sticker) return { title: "Sticker Not Found" };

  return {
    title: sticker.title,
    description: sticker.description || `Download ${sticker.title} sticker by @${sticker.profiles?.username} on StickerVerse.`,
    openGraph: {
      title: `${sticker.title} — StickerVerse`,
      description: sticker.description || `Download this sticker by @${sticker.profiles?.username}`,
      images: [{ url: sticker.image_url, width: 800, height: 800, alt: sticker.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${sticker.title} — StickerVerse`,
      description: sticker.description || `Download this sticker by @${sticker.profiles?.username}`,
      images: [sticker.image_url],
    },
  };
}

export { default } from "./page";
