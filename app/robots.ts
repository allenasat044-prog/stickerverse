import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/collections"],
    },
    sitemap: "https://stickerverse-ruddy.vercel.app/sitemap.xml",
  };
}
