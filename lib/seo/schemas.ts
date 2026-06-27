import { Track, Lesson } from "../curriculum";

const SITE_URL = "https://roadtochain.tech";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
}

export function organizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "RoadToChain",
    alternateName: "Road To Chain",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      "Modern Web3 engineering education platform. Problem-first learning. 8 tracks covering blockchain, Solidity, ERC-4337, ZK proofs, DeFi and more. Built from real shipped projects. No hype.",
    founder: {
      "@type": "Person",
      name: "Atharva Baodhankar",
      url: "https://atharvabaodhankar.me",
      sameAs: [
        "https://github.com/atharvabaodhankar",
        "https://linkedin.com/in/atharva-baodhankar",
        "https://twitter.com/atharvabaodhankar",
      ],
    },
    sameAs: [
      "https://github.com/roadtochain",
      "https://twitter.com/roadtochain",
    ],
    knowsAbout: [
      "Blockchain Technology",
      "Ethereum",
      "Solidity",
      "Smart Contracts",
      "Zero Knowledge Proofs",
      "Account Abstraction",
      "DeFi",
      "Web3 Development",
    ],
  };
}

export function websiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "RoadToChain",
    alternateName: "Road To Chain — Web3 Engineering Education",
    description:
      "Free Web3 engineering education. 8 tracks from blockchain fundamentals to ZK proofs. No hype, real systems.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/curriculum?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function educationalOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#educational-org`,
    name: "RoadToChain",
    url: siteUrl,
    description:
      "Online Web3 engineering school offering free structured courses on blockchain development, Solidity, account abstraction, ZK proofs and DeFi.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web3 Engineering Courses",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Blockchain Foundations" } },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "Solidity & Smart Contracts" } },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "ERC-4337 Account Abstraction" } },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "ZK Proofs with Circom" } },
        { "@type": "Offer", itemOffered: { "@type": "Course", name: "DeFi Protocol Engineering" } },
      ],
    },
  };
}

export function courseSchema(track: Track) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/learn/${track.slug}/#course`,
    name: `${track.name}`,
    headline: `${track.name} \u2014 RoadToChain`,
    description: track.description,
    url: `${siteUrl}/learn/${track.slug}`,
    image: `${siteUrl}/api/og?title=${encodeURIComponent(track.name)}&track=${encodeURIComponent("Track " + track.number)}`,
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    instructor: {
      "@type": "Person",
      name: "Atharva Baodhankar",
      url: "https://atharvabaodhankar.me",
      sameAs: [
        "https://github.com/atharvabaodhankar",
        "https://twitter.com/atharvabaodhankar",
      ],
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      category: "Free",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
      inLanguage: "en",
    },
    numberOfCredits: track.lessonCount,
    teaches: track.modules.flatMap((m) => m.lessons.map((l) => l.title)),
    about: {
      "@type": "Thing",
      name: "Web3 Development",
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
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
  const siteUrl = getSiteUrl();
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
    image: `${siteUrl}/api/og?title=${encodeURIComponent(lesson.title)}&track=${encodeURIComponent(trackName)}`,
    author: {
      "@type": "Person",
      name: "Atharva Baodhankar",
      url: "https://atharvabaodhankar.me",
      sameAs: [
        "https://github.com/atharvabaodhankar",
        "https://twitter.com/atharvabaodhankar",
      ],
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
      name: trackName,
    },
    educationalLevel: "intermediate",
    educationalUse: "instruction",
    learningResourceType: "lesson",
    keywords: lesson.tags.join(", "),
    timeRequired: `PT${lesson.estimatedMinutes}M`,
    teaches: lesson.title,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by-nc/4.0/",
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
