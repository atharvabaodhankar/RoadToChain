import { Track } from "./curriculum";

export function generateCourseJsonLd() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnBlockchain";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteDesc = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Modern Web3 engineering for the next generation of builders. No hype. Real systems.";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${siteName} — Modern Web3 Engineering`,
    "description": siteDesc,
    "provider": {
      "@type": "Organization",
      "name": siteName,
      "sameAs": siteUrl
    }
  };
}

export function generateTrackJsonLd(track: Track) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  return {
    "@context": "https://schema.org",
    "@type": "CourseInstance",
    "courseMode": "online",
    "name": track.name,
    "description": track.description,
    "url": `${siteUrl}/learn/${track.slug}`
  };
}
