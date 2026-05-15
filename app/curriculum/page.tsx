import { Metadata } from "next";
import { tracks } from "@/lib/curriculum";
import { generateCourseJsonLd } from "@/lib/seo";
import CurriculumPage from "./CurriculumPage";

export const metadata: Metadata = {
  title: "Curriculum — 8 Tracks. One Path.",
  description:
    "The complete LearnBlockchain curriculum: 8 tracks, 40+ lessons, 12 real shipped projects. From blockchain foundations to zero-knowledge proof systems.",
  openGraph: {
    title: "LearnBlockchain Curriculum",
    description:
      "The complete LearnBlockchain curriculum: 8 tracks, 40+ lessons, 12 real shipped projects.",
  },
};

export default function Page() {
  const jsonLd = generateCourseJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CurriculumPage tracks={tracks} />
    </>
  );
}
