import { Metadata } from "next";
import AutopsiesPage from "./AutopsiesPage";

export const metadata: Metadata = {
  title: "Architecture Autopsies — Dissecting Real Web3 Failures",
  description:
    "We don't just build systems. We dissect why they fail in production. Explore real-world autopsies of key Web3 apps, tracing their evolution from naive designs to robust infrastructures.",
  openGraph: {
    title: "Architecture Autopsies — LearnBlockchain",
    description:
      "Explore real-world Web3 production failures and system design autopsies including ChainElect, ProofChain, Socio3 V1, Socio3 V2, and ChainCure.",
  },
};

export default function Page() {
  return <AutopsiesPage />;
}
