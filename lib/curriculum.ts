export type Lesson = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  hasDiagram: boolean;
  hasMistake: boolean;
  hasProject: boolean;
  estimatedMinutes: number;
  isRealProject?: boolean;
};

export type Module = {
  id: string;
  number: string;
  name: string;
  description: string;
  lessons: Lesson[];
};

export type Track = {
  id: number;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  prerequisites: number[];
  estimatedHours: number;
  moduleCount: number;
  lessonCount: number;
  heroProject: { name: string; description: string };
  isSignature: boolean;
  modules: Module[];
};

export const tracks: Track[] = [
  {
    id: 0,
    slug: "track-0",
    number: "T0",
    name: "Blockchain Foundations",
    tagline: "Build REAL blockchain intuition.",
    description: "Understand what blockchain physically is, where data exists, how networks work, why wallets exist, and why gas exists — before writing a single line of code.",
    color: "#7c3aed",
    difficulty: "beginner",
    prerequisites: [],
    estimatedHours: 6,
    moduleCount: 4,
    lessonCount: 14,
    heroProject: {
      name: "Visual Blockchain Simulator",
      description: "Students build a transaction flow simulator, block visualizer, node propagation animation, and gas simulation system — using vanilla JS + SVG."
    },
    isSignature: false,
    modules: [
      {
        id: "m0-1",
        number: "M0.1",
        name: "Why Blockchain Exists",
        description: "Start with the problem, not the technology. Centralized trust failure, the double-spend problem, and when NOT to use blockchain.",
        lessons: [
          {
            slug: "trust-problem",
            title: "The trust problem — why do we need banks?",
            description: "Double-spend problem. Why digital money failed before Bitcoin. The human cost of centralized trust.",
            tags: ["trust", "economics", "history"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "centralized-vs-decentralized",
            title: "Centralized vs decentralized systems",
            description: "Single point of failure. Censorship. Downtime. Why decentralization solves specific problems.",
            tags: ["decentralization", "security"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 8
          },
          {
            slug: "what-blockchain-invented",
            title: "What blockchain actually invented",
            description: "Not just a database. A consensus mechanism for untrusted parties. The Nakamoto breakthrough.",
            tags: ["consensus", "cryptography"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "where-not-to-use-blockchain",
            title: "Where blockchain SHOULD NOT be used",
            description: "The most important lesson in T0. If a database works, use a database. Blockchain is a trust primitive.",
            tags: ["architecture", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m0-2",
        number: "M0.2",
        name: "How Blockchain Actually Works",
        description: "What is a block. What is a chain. How consensus works. What actually happens during a transaction — visually.",
        lessons: [
          {
            slug: "what-is-a-block",
            title: "What is a block — data structure deep dive",
            description: "Previous hash, merkle root, timestamp, nonce, transactions. Why the previous hash chains blocks together.",
            tags: ["blocks", "hashing", "interactive"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "transactions-visually",
            title: "Transactions explained visually",
            description: "From, to, value, data, signature. What happens when you press send. The mempool.",
            tags: ["transactions", "mempool"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "consensus-strangers-agree",
            title: "Consensus — how strangers agree",
            description: "Byzantine fault tolerance for humans. Why miners/validators exist. The economic incentive design.",
            tags: ["consensus", "economics"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "pow-vs-pos",
            title: "PoW vs PoS — why Ethereum switched",
            description: "Energy cost of mining. Proof of Stake economics. Validators, slashing, finality.",
            tags: ["consensus", "ethereum"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          }
        ]
      },
      {
        id: "m0-3",
        number: "M0.3",
        name: "Networks & Storage",
        description: "Mainnet vs testnet. Ethereum vs Polygon vs L2s. RPC explained. Where blockchain data actually lives.",
        lessons: [
          {
            slug: "data-location",
            title: "Where does blockchain data actually live?",
            description: "Nodes. Full nodes vs light nodes vs archive nodes. Why 'the blockchain' is millions of computers.",
            tags: ["nodes", "storage"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "mainnet-vs-testnet",
            title: "Mainnet vs testnet — NOT the same thing",
            description: "Different chain IDs, RPCs, contract addresses. Why testnet ETH has no value.",
            tags: ["networks", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "why-sepolia-eth-is-worthless",
            title: "Why Sepolia ETH is worthless — testnet economics",
            description: "Testnet coins have no economic value. Understanding why they are strictly for testing.",
            tags: ["networks", "testnet", "economics"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 8
          },
          {
            slug: "who-creates-faucet-tokens",
            title: "Who creates faucet tokens and where do they come from?",
            description: "Faucets as infrastructure gateways. How testnet coins are minted and distributed.",
            tags: ["networks", "faucets", "security"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "transaction-anatomy",
            title: "Anatomy of a transaction",
            description: "EVM transaction payload, fields, signatures, gas fees, and network propagation.",
            tags: ["gas", "transactions", "interactive"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "what-rpc-actually-does",
            title: "What RPC actually does — your app's phone line to the blockchain",
            description: "JSON-RPC spec. eth_call, eth_blockNumber. Why you need Alchemy or QuickNode.",
            tags: ["rpc", "infrastructure", "interactive"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "ethereum-vs-polygon",
            title: "Ethereum vs Polygon vs Base — when to deploy where",
            description: "Gas costs, finality, ecosystem, liquidity. How L2s work conceptually.",
            tags: ["networks", "L2"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          }
        ]
      },
      {
        id: "m0-4",
        number: "M0.4",
        name: "Wallets & Identity",
        description: "Private keys, public keys, seed phrases, signing — the cryptographic identity system.",
        lessons: [
          {
            slug: "keys-and-addresses",
            title: "Private keys, public keys, addresses",
            description: "Asymmetric cryptography for humans. Your private key IS your identity.",
            tags: ["cryptography", "keys"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "wallets-dont-store-coins",
            title: "Wallets don't store coins — the biggest mental hurdle",
            description: "Coins live on the global ledger. Your wallet is just a bundle of signing credentials.",
            tags: ["wallets", "security", "interactive"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "what-metamask-does",
            title: "What MetaMask actually does — and doesn't do",
            description: "It's a key manager, not a vault. Coins live on-chain, not in MetaMask. UX challenges.",
            tags: ["wallets", "ux", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "seed-phrases-ux",
            title: "Seed phrases — brilliant security, terrible UX",
            description: "BIP-39 mnemonic. HD wallet derivation paths. Why 12 words = full account control.",
            tags: ["security", "ux"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "how-signing-actually-works",
            title: "How signing actually works — cryptographic verification",
            description: "ECDSA signatures. Private keys sign, public keys verify. Why signing does not move gas.",
            tags: ["signatures", "cryptography"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          }
        ]
      },
      {
        id: "m0-5",
        number: "M0.5",
        name: "Gas & Transactions",
        description: "What gas actually is, EVM opcode pricing, base fees, priority fees, and transaction failure modes.",
        lessons: [
          {
            slug: "why-gas-exists",
            title: "Why gas exists and how it's calculated",
            description: "EVM opcodes cost computation. Base fee + priority fee. EIP-1559 explained.",
            tags: ["gas", "EVM", "transactions"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "base-fee-priority-fee",
            title: "Base fee + priority fee — EIP-1559 explained",
            description: "How gas pricing actually works post-London upgrade. Why base fee burns. Why priority fee goes to validators.",
            tags: ["gas", "economics"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "failed-transaction-gas",
            title: "Why you pay gas even when the transaction fails",
            description: "EVM still executed. The gas meter ran. Analogous to a taxi meter running.",
            tags: ["gas", "debugging", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "polygon-cheaper",
            title: "Why Polygon is cheaper than Ethereum",
            description: "Block space supply and demand. L1 vs L2 economics. Why gas price is not fixed.",
            tags: ["gas", "networks"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          }
        ]
      }
    ]
  },
  {
    id: 1,
    slug: "track-1",
    number: "T1",
    name: "Solidity & Smart Contract Engineering",
    tagline: "Write contracts that don't get hacked.",
    description: "Understand storage, events, security patterns, and why OpenZeppelin exists. Every lesson uses real contract code from shipped projects.",
    color: "#3b82f6",
    difficulty: "intermediate",
    prerequisites: [0],
    estimatedHours: 10,
    moduleCount: 5,
    lessonCount: 18,
    heroProject: {
      name: "Evolutionary Voting System",
      description: "Intentionally starts with a broken architecture (voter data stored on-chain), hits gas failures in practice, and evolves through optimization to a production-grade contract."
    },
    isSignature: false,
    modules: [
      {
        id: "m1-1",
        number: "M1.1",
        name: "Solidity Fundamentals",
        description: "Types, functions, visibility, storage vs memory. The correct mental models.",
        lessons: [
          {
            slug: "solidity-types-gas",
            title: "Solidity types and why they cost gas",
            description: "uint256, mapping, struct. Storage slot packing rules.",
            tags: ["types", "gas"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "storage-memory-calldata",
            title: "Storage vs memory vs calldata",
            description: "Three data locations. Why using storage when you meant memory costs 100x more.",
            tags: ["storage", "gas", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "how-evm-executes-code",
            title: "How the EVM executes code — the virtual stack machine",
            description: "Deep dive into the Ethereum Virtual Machine: stack depth, memory allocations, persistent storage slots, and instruction execution cycles.",
            tags: ["EVM", "bytecode", "execution"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "mappings-vs-arrays",
            title: "Mappings vs arrays — when to use which",
            description: "O(1) lookup vs iteration cost. Loop boundaries on mappings.",
            tags: ["data-structures", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "how-i-broke-my-first-voting-system",
            title: "How I broke my first voting system — a gas disaster",
            description: "A flagship case study in Solidity anti-patterns: on-chain string storage, array traversals, and hitting the Block Gas Limit.",
            tags: ["architecture", "security", "gas", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 16
          },
          {
            slug: "events-logging",
            title: "Events — the blockchain's logging system",
            description: "Why events exist. How subgraphs read them. Cost difference between emit and store.",
            tags: ["events", "indexing"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          }
        ]
      },
      {
        id: "m1-2",
        number: "M1.2",
        name: "Smart Contract Architecture",
        description: "Modifiers, ownership, role systems, access control. Structured production setups.",
        lessons: [
          {
            slug: "modifiers-access-control",
            title: "Modifiers and access control basics",
            description: "onlyOwner, custom errors vs require/revert.",
            tags: ["architecture", "security"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "openzeppelin-access-control",
            title: "OpenZeppelin Access Control",
            description: "Roles as bytes32. grantRole, revokeRole, hasRole. Security audit trails.",
            tags: ["access-control", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "multi-admin-chaincure",
            title: "Multi-admin systems — the ChainCure pattern",
            description: "Granular admin approvals. Real contract walkthrough from a shipped project.",
            tags: ["architecture", "real-code", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m1-3",
        number: "M1.3",
        name: "Deployment & Blockchain State",
        description: "Compiling, bytecode, ABI, and network verification.",
        lessons: [
          {
            slug: "what-deployment-actually-means",
            title: "What deployment actually means — validator execution",
            description: "Bytecode compilation, constructor execution, contract address creation, and validators storing contract state.",
            tags: ["bytecode", "deployment", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "abi-as-translator",
            title: "ABI as translator — mapping frontend to bytecode payloads",
            description: "JSON interfaces, function selectors, encoding args, and translating frontend calls to raw hex payloads.",
            tags: ["abi", "frontend"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "hardhat-local-dev",
            title: "Hardhat — local development environment",
            description: "Local node, deploy scripts, testing, compiler configurations.",
            tags: ["hardhat", "toolchain", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "deploying-polygon-amoy",
            title: "Deploying to Polygon Amoy testnet",
            description: "Config, secrets, verification, and script templates.",
            tags: ["hardhat", "deployment", "project"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m1-4",
        number: "M1.4",
        name: "Token Standards",
        description: "ERC-20, ERC-721, soulbound tokens, and decentralized metadata rules.",
        lessons: [
          {
            slug: "erc20-fungible-tokens",
            title: "ERC-20 — fungible tokens",
            description: "Approvals, allowances, and the transferFrom flow.",
            tags: ["erc20", "tokens", "project"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 13
          },
          {
            slug: "erc721-nfts",
            title: "ERC-721 — NFTs from first principles",
            description: "Metadata URIs, tokenId mapping, and minting rules.",
            tags: ["erc721", "nfts", "project"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 14
          },
          {
            slug: "soulbound-tokens-erc5192",
            title: "ERC-5192 — soulbound (non-transferable) NFTs",
            description: "Locked states. Why ZKredential used soulbound tokens.",
            tags: ["sbt", "erc5192", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "ipfs-metadata-correct",
            title: "IPFS metadata — the correct pattern",
            description: "Permanent CIDs vs brittle API links. Pinata integration.",
            tags: ["ipfs", "metadata", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 13
          }
        ]
      },
      {
        id: "m1-5",
        number: "M1.5",
        name: "Contract Security",
        description: "Reentrancy, arithmetic bugs, origin authentication, and static analysis tools.",
        lessons: [
          {
            slug: "reentrancy-dao-hack",
            title: "Reentrancy — the $60M DAO hack explained",
            description: "Checks-Effects-Interactions, reentrancy guards.",
            tags: ["security", "reentrancy", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "arithmetic-bugs",
            title: "Integer overflow and underflow",
            description: "Solidity 0.8 safe math vs legacy bugs.",
            tags: ["security", "math"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "tx-origin-auth",
            title: "tx.origin vs msg.sender — the phishing vector",
            description: "How tx.origin attacks work and how to prevent them.",
            tags: ["security", "auth", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "track-2",
    number: "T2",
    name: "Full Stack Web3",
    tagline: "Connect deployed contracts to real UIs.",
    description: "ethers.js v6, viem, wagmi, IPFS, wallet integration — with the production differences explained that no tutorial ever covers.",
    color: "#14b8a6",
    difficulty: "intermediate",
    prerequisites: [0, 1],
    estimatedHours: 9,
    moduleCount: 4,
    lessonCount: 16,
    heroProject: {
      name: "Socio3 Classic",
      description: "Traditional Web3 social app: MetaMask wallet connection, IPFS content storage, smart contract interactions, decentralized metadata."
    },
    isSignature: false,
    modules: [
      {
        id: "m2-1",
        number: "M2.1",
        name: "ethers.js v6 & viem",
        description: "The two libraries every Web3 frontend uses. Reads, writes, and migrations.",
        lessons: [
          {
            slug: "ethers-v6-migration",
            title: "ethers.js v6 — what changed from v5",
            description: "Provider, Signer, and Contract API updates.",
            tags: ["ethers", "frontend", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "reading-contracts-ethcall",
            title: "Reading from contracts — eth_call",
            description: "Views, ABI decoding, and Multicall batching.",
            tags: ["reading", "multicall", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "writing-contracts-flow",
            title: "Writing to contracts — transaction flow",
            description: " receipts, pending states, and error parsing.",
            tags: ["writing", "transactions", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          }
        ]
      },
      {
        id: "m2-2",
        number: "M2.2",
        name: "wagmi + Wallet Connection",
        description: "The standard React hooks library for Web3. UI state machines and configs.",
        lessons: [
          {
            slug: "wagmi-setup",
            title: "wagmi setup — WagmiConfig and chains",
            description: "Configuring transport layers and Polygon networks.",
            tags: ["wagmi", "react", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "wallet-hooks",
            title: "useAccount, useConnect, useDisconnect",
            description: "Onboarding users, checking networks, chain switching.",
            tags: ["wallets", "react", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "read-write-hooks",
            title: "useReadContract and useWriteContract",
            description: "Executing contract interactions inside React rendering loops.",
            tags: ["react", "wagmi"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m2-3",
        number: "M2.3",
        name: "IPFS & Decentralized Storage",
        description: "CIDs, Pinata uploads, and hybrid database storage architectures.",
        lessons: [
          {
            slug: "ipfs-content-addressing",
            title: "Why IPFS exists — content vs location addressing",
            description: "How CIDs guarantee data integrity globally.",
            tags: ["ipfs", "storage", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "pinata-react-upload",
            title: "Pinata — uploading from React",
            description: "Configuring API keys, gateways, and secure uploads.",
            tags: ["pinata", "storage", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "hybrid-storage-pattern",
            title: "The hybrid storage pattern",
            description: "Store hashes on-chain, files in IPFS, metadata in DB.",
            tags: ["architecture", "storage", "diagram", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m2-4",
        number: "M2.4",
        name: "Event Indexing & The Graph",
        description: "GraphQL APIs, subgraphs, AssemblyScript, and high-performance querying.",
        lessons: [
          {
            slug: "why-live-queries-break",
            title: "Why live event queries break at scale",
            description: "RPC limits, historical lookups, eth_getLogs blocks.",
            tags: ["indexing", "rpc", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "how-the-graph-works",
            title: "How The Graph works internally",
            description: "Subgraphs, mapping handlers, and GraphQL.",
            tags: ["the-graph", "indexing", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "writing-subgraph",
            title: "Writing and deploying a subgraph",
            description: "Creating models, mappings, schemas, and queries.",
            tags: ["the-graph", "graphql", "project"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 16
          }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "track-3",
    number: "T3",
    name: "Blockchain System Design",
    tagline: "How production systems are actually designed.",
    description: "Actors, flows, trust boundaries, storage decisions. How Uniswap, OpenSea, and rollups actually work.",
    color: "#22c55e",
    difficulty: "advanced",
    prerequisites: [2],
    estimatedHours: 8,
    moduleCount: 4,
    lessonCount: 15,
    heroProject: {
      name: "ProofChain",
      description: "Production-grade proof-of-existence system: file hashing on the frontend, IPFS storage, on-chain hash registry, event indexing, hybrid architecture."
    },
    isSignature: false,
    modules: [
      {
        id: "m3-1",
        number: "M3.1",
        name: "System Design Thinking",
        description: "Actor modeling, boundaries, and selecting the correct stack.",
        lessons: [
          {
            slug: "actor-modeling",
            title: "Actor modeling — who does what",
            description: "Permissions, trust models, and multi-signature bounds.",
            tags: ["system-design", "roles", "diagram", "real-code"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "blockchain-is-not-your-database",
            title: "Blockchain is NOT your database — hybrid design rules",
            description: "Crucial system design architectures: ProofChain, Firebase caching, IPFS hashing, event indexing, and resolving query issues.",
            tags: ["system-design", "architecture", "database"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 15
          },
          {
            slug: "onchain-boundaries",
            title: "What goes on-chain vs off-chain",
            description: "Proofs vs data. Gas optimization boundaries.",
            tags: ["architecture", "gas", "diagram", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m3-2",
        number: "M3.2",
        name: "Famous Protocol Breakdowns",
        description: "Uniswap AMMs, OpenSea Seaport, Rollups, and AA Bundlers.",
        lessons: [
          {
            slug: "uniswap-amm-math",
            title: "How Uniswap works — AMM from first principles",
            description: "Constant product formula, slippage, liquidity pools.",
            tags: ["uniswap", "amm", "math", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "opensea-seaport-orders",
            title: "How OpenSea works — NFT marketplace architecture",
            description: "Off-chain signatures, Seaport settlement contracts.",
            tags: ["opensea", "marketplace", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "scaling-rollups",
            title: "How rollups work — L2 scaling",
            description: "Optimistic vs Zero Knowledge, sequencers, fraud proofs.",
            tags: ["rollups", "scaling", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m3-3",
        number: "M3.3",
        name: "Hybrid Web2 + Web3 Architecture",
        description: "Sign-In With Ethereum, secure APIs, and fallback resilient setups.",
        lessons: [
          {
            slug: "hybrid-request-flows",
            title: "The hybrid architecture pattern",
            description: "Next.js backend, contract reads, cache layers, and DB states.",
            tags: ["architecture", "database", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "siwe-auth",
            title: "Sign-In With Ethereum (SIWE)",
            description: "EIP-4361 standard. Signing off-chain for JWT generation.",
            tags: ["auth", "siwe", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m3-4",
        number: "M3.4",
        name: "ChainCure Deep Dive",
        description: " Pharmaceutical counterfeits, 5-actor models, state transitions, QR public scans.",
        lessons: [
          {
            slug: "pharmaceutical-problem",
            title: "The counterfeit drug problem — why blockchain?",
            description: "Trust boundaries, ledger requirements, and transparency.",
            tags: ["pharmacy", "supply-chain"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "drug-lifecycle-state",
            title: "Drug lifecycle state machine",
            description: "Created -> Transferred -> Verified on-chain contracts.",
            tags: ["contracts", "states", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      }
    ]
  },
  {
    id: 4,
    slug: "track-4",
    number: "T4",
    name: "Modern Web3 UX & Account Abstraction",
    tagline: "How production apps onboard real users.",
    description: "No MetaMask required. No seed phrases. No gas friction. Built from shipping erc4337-kit, ZKredential, and ProofOfExistence.",
    color: "#f59e0b",
    difficulty: "advanced",
    prerequisites: [2],
    estimatedHours: 9,
    moduleCount: 4,
    lessonCount: 16,
    heroProject: {
      name: "Socio3 Evolution",
      description: "Takes the Socio3 Classic app from T2 and evolves it: MetaMask popups become Google login, manual network switching disappears, users pay zero gas."
    },
    isSignature: true,
    modules: [
      {
        id: "m4-1",
        number: "M4.1",
        name: "Account Abstraction Foundations",
        description: "Why MetaMask UX fails, ERC-4337, alt-mempools, UserOps, Smart Accounts vs EOAs.",
        lessons: [
          {
            slug: "why-metamask-ux-fails",
            title: "Why MetaMask UX fails real users",
            description: "Seed phrases, popups, network mismatching, conversion barriers.",
            tags: ["ux", "wallets", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "why-web3-mobile-onboarding-sucks",
            title: "Why Web3 mobile onboarding sucks — and the Privy solution",
            description: "In-app browser issues, deep linking wallet failures, and how embedded wallets + social logins provide the ultimate mobile onboarding flow.",
            tags: ["ux", "mobile", "wallets", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "erc4337-abstractions",
            title: "ERC-4337 — account abstraction without protocol change",
            description: "EntryPoint contracts, UserOperations, and alternative mempools.",
            tags: ["erc4337", "account-abstraction", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "smart-accounts-vs-eoas",
            title: "Smart accounts vs EOAs",
            description: "Custom gas limits, batching, session keys, multi-sigs.",
            tags: ["smart-accounts", "eoas", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "useroperation-anatomy",
            title: "UserOperation anatomy",
            description: "Sender, nonce, gas limits, paymasterAndData. What each field does.",
            tags: ["userop", "erc4337", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m4-2",
        number: "M4.2",
        name: "Bundlers & Paymasters",
        description: "Alt mempool routing, gas sponsorship (verifying/deposit), and Pimlico configs.",
        lessons: [
          {
            slug: "how-bundlers-work",
            title: "How bundlers work",
            description: "UserOp validation, Alt mempool routing, bundler economics.",
            tags: ["bundlers", "infrastructure", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "verifying-paymasters",
            title: "Verifying paymaster — sponsor specific users",
            description: "Gas sponsorship signatures, anti-replay rules.",
            tags: ["paymasters", "gas", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m4-3",
        number: "M4.3",
        name: "Embedded Wallets & Social Logins",
        description: "Google logins, Privy setup, Permissionless.js, embedded signers, and async race hooks.",
        lessons: [
          {
            slug: "embedded-wallets-why",
            title: "Why embedded wallets exist",
            description: "Social login onboarding, Privy silently generated keys.",
            tags: ["wallets", "social-login"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "privy-setup-react",
            title: "Privy setup and configuration",
            description: "App IDs, providers, and social login flow overrides.",
            tags: ["privy", "react", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          }
        ]
      },
      {
        id: "m4-4",
        number: "M4.4",
        name: "Session Keys & NPM Publishing",
        description: "Granular action permissions, mobile deep links, and publishing custom developer kits.",
        lessons: [
          {
            slug: "session-keys-ux",
            title: "Session keys — persist actions without signing every time",
            description: "Time-bound, target-scoped smart account keys.",
            tags: ["ux", "security"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "erc4337-kit-package",
            title: "erc4337-kit — the npm package",
            description: "How to ship custom React components as reusable npm modules.",
            tags: ["npm", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      }
    ]
  },
  {
    id: 5,
    slug: "track-5",
    number: "T5",
    name: "Zero Knowledge & Privacy Engineering",
    tagline: "Prove you know something without revealing it.",
    description: "zkSNARKs, Circom, Groth16, Poseidon — explained from first principles with a real deployed proof system behind every lesson.",
    color: "#ec4899",
    difficulty: "advanced",
    prerequisites: [1, 2],
    estimatedHours: 8,
    moduleCount: 3,
    lessonCount: 12,
    heroProject: {
      name: "ZK Credential Verifier",
      description: "Based on ZKredential — MIT hackathon top-15. Circom circuits, Groth16 proofs, Poseidon hashing, ERC-5192 Sbound NFTs, Polygon Amoy."
    },
    isSignature: true,
    modules: [
      {
        id: "m5-1",
        number: "M5.1",
        name: "ZK Foundations",
        description: "Snarks, Starks, trusted setup, interactive caves, and on-chain selective disclosure.",
        lessons: [
          {
            slug: "what-zk-means",
            title: "What zero-knowledge actually means",
            description: "Interactive cave analogy. Soundness, completeness, zero-knowledge.",
            tags: ["zk", "cryptography", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "identity-privacy-problem",
            title: "Why privacy matters in on-chain identity",
            description: "Public ledgers vs credential privacy. Selective disclosures.",
            tags: ["identity", "privacy"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          }
        ]
      },
      {
        id: "m5-2",
        number: "M5.2",
        name: "Circom & zkSNARKs",
        description: "Circom signals, constraints, Poseidon hash optimization, witnesses, and Solidity Verifiers.",
        lessons: [
          {
            slug: "circom-language-basics",
            title: "Circom language basics",
            description: "Signals, custom components, linear constraints.",
            tags: ["circom", "zk", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "poseidon-vs-sha256",
            title: "Poseidon hashing vs SHA-256 in ZK circuits",
            description: "ZK-friendly math. Why SHA-256 constraint counts explode inside SNARKs.",
            tags: ["zk", "math", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "witness-generation",
            title: "Witness generation and proof creation",
            description: "Witness, inputs, snarkjs commands, and proof sizes.",
            tags: ["witness", "snarkjs", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "verifier-sol-export",
            title: "Verifier.sol — auto-generated on-chain verifier",
            description: "snarkjs verifier export, verifyProof() executions.",
            tags: ["solidity", "verifier", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m5-3",
        number: "M5.3",
        name: "Selective Disclosure Systems",
        description: "Credential circuits, ZKredential workflows, soulbound NFTs, and employer portals.",
        lessons: [
          {
            slug: "zk-credential-circuits",
            title: "Designing a ZK credential circuit",
            description: "Threshold parameters. Private CGPA, public threshold checks.",
            tags: ["circom", "zkredential", "real-code", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "soulbound-erc5192-credentials",
            title: "Soulbound credential NFT — ERC-721 + ERC-5192",
            description: "Locking assets. Deployed CredentialRegistryNFT contracts.",
            tags: ["erc5192", "nfts", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      }
    ]
  },
  {
    id: 6,
    slug: "track-6",
    number: "T6",
    name: "Security & Production Engineering",
    tagline: "Real security for real systems.",
    description: "Replay protection, distributed trust, timelocks, secret sharing, rate limiting, fallback infrastructure. Not just reentrancy guards.",
    color: "#f97316",
    difficulty: "expert",
    prerequisites: [3, 4],
    estimatedHours: 7,
    moduleCount: 3,
    lessonCount: 11,
    heroProject: {
      name: "ZeroLeak",
      description: "Exam paper leak prevention system: PDF encrypted in-browser with AES-256-GCM, encryption key split using Shamir Secret Sharing, smart contract timelock."
    },
    isSignature: false,
    modules: [
      {
        id: "m6-1",
        number: "M6.1",
        name: "Cryptographic Security Patterns",
        description: "Replays, nonces, domain separations, AES encryption, and secret sharing.",
        lessons: [
          {
            slug: "replay-attacks-nonces",
            title: "Replay attacks — signing the same message twice",
            description: "Capture and replay hazards. Nonce-based cryptographic guards.",
            tags: ["security", "signatures", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "aes-browser-crypto",
            title: "AES-256-GCM — symmetric encryption in-browser",
            description: "Web Crypto API. Encrypting PDFs client-side before IPFS uploading.",
            tags: ["encryption", "web-crypto", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "shamir-secret-sharing",
            title: "Shamir Secret Sharing — distributed trust",
            description: "K-of-N threshold keys. Removing single-source targets.",
            tags: ["cryptography", "secrets", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m6-2",
        number: "M6.2",
        name: "Application-Level Security",
        description: "Smart contract rate limiting, Sybil resistance, ProxyShield WAF setups.",
        lessons: [
          {
            slug: "rate-limiting-contracts",
            title: "Rate limiting — protecting on-chain and off-chain resources",
            description: "Token buckets in solidity, front-running shields.",
            tags: ["security", "contracts", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "proxyshield-waf",
            title: "ProxyShield — WAF + API gateway architecture",
            description: "Honeypots, reverse proxies, and threat dashboards.",
            tags: ["security", "waf", "diagram", "real-code"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m6-3",
        number: "M6.3",
        name: "Production Reliability",
        description: "Fallback RPC circuits, gas escalations, contract upgrades, and audit logs.",
        lessons: [
          {
            slug: "fallback-rpc-resilience",
            title: "Fallback RPC architecture",
            description: "Alchemy + QuickNode failover scripts, circuit breakers.",
            tags: ["infrastructure", "resilience", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "contract-upgrades-uups",
            title: "Smart contract upgrade patterns",
            description: "UUPS vs Transparent proxies. Upgradability risks.",
            tags: ["upgrades", "proxy"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      }
    ]
  },
  {
    id: 7,
    slug: "track-7",
    number: "T7",
    name: "Real-World Blockchain Systems",
    tagline: "Why blockchain should exist in a system.",
    description: "Fake drugs. Exam leaks. Civil material fraud. Academic credential privacy. Real problems solved with real systems.",
    color: "#06b6d4",
    difficulty: "expert",
    prerequisites: [5, 6],
    estimatedHours: 6,
    moduleCount: 3,
    lessonCount: 10,
    heroProject: {
      name: "ChainCure + CiviChain",
      description: "ChainCure: pharmaceutical anti-counterfeiting with 5-actor supply chain, QR verification. CiviChain: civil material authentication."
    },
    isSignature: false,
    modules: [
      {
        id: "m7-1",
        number: "M7.1",
        name: "Problem-First System Design",
        description: "Problem mapping frameworks, ChainCure counterfeit models, ZeroLeak cryptographics.",
        lessons: [
          {
            slug: "problem-solution-mapping",
            title: "Problem -> solution mapping framework",
            description: "Trust boundaries, consensus costs, immutable values.",
            tags: ["system-design", "framework", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "chaincure-counterfeit-problem",
            title: "ChainCure — pharmaceutical problem deep dive",
            description: "Tracing drug packages, multi-party tracking trust.",
            tags: ["chaincure", "supply-chain", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m7-2",
        number: "M7.2",
        name: "Cryptographic Trust Architecture",
        description: "Zero-trust modeling, audit trails, and multi-party coordination systems.",
        lessons: [
          {
            slug: "zerotrust-systems-first",
            title: "Zero-trust architecture from first principles",
            description: "Assume hostile actors, enforce rules via math.",
            tags: ["security", "zero-trust", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "immutable-audit-trails",
            title: "Audit trails — immutable history on-chain",
            description: "Event logging vs database transaction tracking.",
            tags: ["audit-trail", "events", "real-code"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          }
        ]
      },
      {
        id: "m7-3",
        number: "M7.3",
        name: "Production Case Studies",
        description: "Overengineering traps, gas fees under load, and account abstraction bridges.",
        lessons: [
          {
            slug: "failed-blockchain-projects",
            title: "Failed blockchain projects — what went wrong",
            description: "Analyzing standard anti-patterns and overengineering.",
            tags: ["case-study", "failures", "mistake"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "scalability-tradeoffs-prod",
            title: "Scalability tradeoffs in production",
            description: "Throughput, block sizes, and L2 migrative costs.",
            tags: ["scaling", "performance"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          }
        ]
      }
    ]
  }
];
