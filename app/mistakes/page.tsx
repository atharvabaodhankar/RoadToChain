import { Metadata } from "next";
import MistakesPage from "./MistakesPage";
import JsonLd from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mistakes I Made — The Things Nobody Tells You",
  description:
    "Real mistakes from shipping ZKredential, ChainCure, erc4337-kit, and more. First-person stories about blockchain engineering failures and what I learned.",
  openGraph: {
    title: "Mistakes I Made — RoadToChain",
    description: "Real mistakes from shipping Web3 projects. First-person stories about blockchain engineering failures.",
  },
};

const mistakesFaq = [
  {
    question: "Is blockchain a good database for storing user profiles and text?",
    answer: "No. Permanent state storage is the most expensive operation in the EVM (SSTORE costs 20,000 gas per 32-byte slot). For large text or media, use off-chain decentralized storage like IPFS and store only the 32-byte content hash (CID) on-chain."
  },
  {
    question: "Why did my Solidity voting loop fail in production but pass local tests?",
    answer: "Solidity tally loops over an array of user addresses will run out of block gas limits if the array size grows too large. Never write loops that grow dynamically with the number of users. Use O(1) mappings or update states incrementally."
  },
  {
    question: "Why is fetching data from the blockchain slow at scale?",
    answer: "The EVM has no native query engine for sorting, filtering, or pagination. Fetching items directly from RPC nodes times out at scale. To solve this, deploy a subgraph with The Graph to index contract events into a queryable GraphQL database."
  }
];

export default function Page() {
  return (
    <>
      <JsonLd schema={faqSchema(mistakesFaq)} />
      <MistakesPage />
    </>
  );
}
