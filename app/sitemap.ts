import { MetadataRoute } from "next";
import { tracks } from "@/lib/curriculum";
import { getAllLessonPaths } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/curriculum`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mistakes`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/architecture-autopsies`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Dynamic tracks
  const trackPages = tracks.map((track) => ({
    url: `${siteUrl}/learn/${track.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic lessons
  const lessonPaths = getAllLessonPaths();
  const lessonPages = lessonPaths.map((p) => ({
    url: `${siteUrl}/learn/${p.track}/${p.module}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...trackPages, ...lessonPages];
}
