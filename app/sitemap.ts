import { MetadataRoute } from "next";
import { tracks } from "@/lib/curriculum";
import { getAllLessonPaths } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chainvidya.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/curriculum`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mistakes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/architecture-autopsies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const trackPages: MetadataRoute.Sitemap = tracks.map((track) => ({
    url: `${baseUrl}/learn/${track.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const lessonPaths = getAllLessonPaths();
  const lessonPages: MetadataRoute.Sitemap = lessonPaths.map((p) => ({
    url: `${baseUrl}/learn/${p.track}/${p.module}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...trackPages, ...lessonPages];
}
