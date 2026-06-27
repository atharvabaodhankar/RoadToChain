import { MetadataRoute } from "next";
import { tracks } from "@/lib/curriculum";
import { getAllLessonPaths } from "@/lib/content";

// Site launched date — used for content dating
const SITE_LAUNCH = new Date("2026-06-04T00:00:00.000Z");
const NOW = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roadtochain.tech";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/curriculum`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/mistakes`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/architecture-autopsies`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  const trackPages: MetadataRoute.Sitemap = tracks.map((track) => ({
    url: `${baseUrl}/learn/${track.slug}`,
    lastModified: NOW,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const lessonPaths = getAllLessonPaths();
  const lessonPages: MetadataRoute.Sitemap = lessonPaths.map((p) => ({
    url: `${baseUrl}/learn/${p.track}/${p.module}/${p.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...trackPages, ...lessonPages];
}
