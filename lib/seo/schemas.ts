import { Track, Lesson } from "../curriculum";

export function organizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chainvidya.com";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "ChainVidya",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
    },
    description: "Modern Web3 engineering education platform. Problem-first learning. Real shipped projects. No hype.",
    founder: {
      "@type": "Person",
      name: "Atharva Baodhankar",
      url: "https://atharvabaodhankar.me",
      sameAs: [
        "https://github.com/atharvabaodhankar",
        "https://linkedin.com/in/atharva-baodhankar",
      ],
    },
    sameAs: [
      "https://github.com/chainvidya",
      "https://twitter.com/chainvidya",
    ],
  };
}

export function websiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chainvidya.com";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ChainVidya",
    description: "Modern Web3 engineering education.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function courseSchema(track: Track) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chainvidya.com";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/learn/${track.slug}/#course`,
    name: `${track.name} — ChainVidya`,
    description: track.description,
    url: `${siteUrl}/learn/${track.slug}`,
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    instructor: {
      "@type": "Person",
      name: "Atharva Baodhankar",
      url: "https://atharvabaodhankar.me",
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      category: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    educationalLevel: track.difficulty,
    inLanguage: "en",
    coursePrerequisites: track.prerequisites.map(
      (p) => `${siteUrl}/learn/track-${p}`
    ),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${track.estimatedHours}H`,
    },
    numberOfCredits: track.lessonCount,
    teaches: track.modules.flatMap((m) => m.lessons.map((l) => l.title)),
  };
}

export function lessonSchema(
  lesson: Lesson,
  trackName: string,
  trackSlug: string,
  url: string,
  datePublished?: string,
  dateModified?: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chainvidya.com";
  const published = datePublished || "2026-06-04T00:00:00.000Z";
  const modified = dateModified || published;

  return {
    "@context": "https://schema.org",
    "@type": ["LearningResource", "Article"],
    "@id": `${url}/#lesson`,
    name: lesson.title,
    headline: lesson.title,
    description: lesson.description,
    url,
    author: {
      "@type": "Person",
      name: "Atharva Baodhankar",
      url: "https://atharvabaodhankar.me",
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    datePublished: published,
    dateModified: modified,
    inLanguage: "en",
    isPartOf: {
      "@type": "Course",
      "@id": `${siteUrl}/learn/${trackSlug}/#course`,
    },
    educationalLevel: "intermediate", // Default fallback if not specified on Lesson
    educationalUse: "instruction",
    learningResourceType: "lesson",
    keywords: lesson.tags.join(", "),
    timeRequired: `PT${lesson.estimatedMinutes}M`,
    teaches: lesson.title,
    isAccessibleForFree: true,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
