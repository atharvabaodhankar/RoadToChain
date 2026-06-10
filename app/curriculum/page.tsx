import { Metadata } from "next";
import { tracks } from "@/lib/curriculum";
import { generateCourseJsonLd } from "@/lib/seo";
import CurriculumPage from "./CurriculumPage";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Curriculum — 8 Tracks. One Path.",
  description:
    "The complete RoadToChain curriculum: 8 tracks, 40+ lessons, 12 real shipped projects. From blockchain foundations to zero-knowledge proof systems.",
  openGraph: {
    title: "RoadToChain Curriculum",
    description:
      "The complete RoadToChain curriculum: 8 tracks, 40+ lessons, 12 real shipped projects.",
  },
};

export default function Page() {
  const jsonLd = generateCourseJsonLd();
  return (
    <>
      <JsonLd schema={jsonLd} />
      <CurriculumPage tracks={tracks} />
    </>
  );
}
