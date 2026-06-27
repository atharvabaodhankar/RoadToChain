import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roadtochain.tech";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
      {
        // Allow major AI crawlers for better discoverability
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Claude-Web",
          "PerplexityBot",
          "GoogleOther",
          "Applebot",
          "DuckDuckBot",
          "Bingbot",
          "Slurp",
        ],
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
