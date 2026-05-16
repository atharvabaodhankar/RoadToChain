import { Metadata } from "next";
import MistakesPage from "./MistakesPage";

export const metadata: Metadata = {
  title: "Mistakes I Made — The Things Nobody Tells You",
  description:
    "Real mistakes from shipping ZKredential, ChainCure, erc4337-kit, and more. First-person stories about blockchain engineering failures and what I learned.",
  openGraph: {
    title: "Mistakes I Made — LearnBlockchain",
    description: "Real mistakes from shipping Web3 projects. First-person stories about blockchain engineering failures.",
  },
};

export default function Page() {
  return <MistakesPage />;
}
