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
  isWIP?: boolean;
  modules: Module[];
};

export const tracks: Track[] = [
  {
    id: 0,
    slug: "track-0",
    number: "T0",
    name: "Blockchain Foundations",
    tagline: "Blockchain Foundations — Start with the physical reality of nodes, RPCs, and gas.",
    description: "Figure out where data lives, how RPCs connect your app, and why gas isn't arbitrary—before writing a single line of Solidity.",
    color: "#7c3aed",
    difficulty: "beginner",
    prerequisites: [],
    estimatedHours: 7,
    moduleCount: 5,
    lessonCount: 22,
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
            slug: "mainnet-vs-testnet",
            title: "Mainnet vs testnet — NOT the same thing",
            description: "Why ETH costs $3,000 but Sepolia ETH is free. Chain IDs, faucets, token economics, and why Polygon is cheap. The value mental model every beginner needs.",
            tags: ["networks", "economics", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "rpc-explained",
            title: "RPC explained — your app's phone line to the blockchain",
            description: "ABI as translator, RPC as phone line, EVM as execution environment. The three invisible layers between your code and the blockchain.",
            tags: ["rpc", "infrastructure", "abi", "evm"],
            hasDiagram: true,
            hasMistake: true,
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
            slug: "why-web3-needs-wallets",
            title: "Why Web3 needs wallets — identity without a server",
            description: "Why a faucet asks for an address, why an address requires a wallet, and why a wallet is not a bank account. The rubber stamp vs library card mental model.",
            tags: ["wallets", "identity", "faucets", "beginner"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
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
          },
          {
            slug: "transaction-anatomy",
            title: "Anatomy of a transaction [Optional Deep Dive]",
            description: "EVM transaction payload, fields, signatures, gas fees, and network propagation.",
            tags: ["gas", "transactions", "interactive"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
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
    tagline: "Solidity & Smart Contract Engineering — Code your first smart contracts (ChainLock & ChainTask).",
    description: "Understand storage slots, events, security patterns, and access control. Every lesson uses real code from shipped projects, not simple syntax templates.",
    color: "#3b82f6",
    difficulty: "beginner",
    prerequisites: [0],
    estimatedHours: 13,
    moduleCount: 5,
    lessonCount: 22,
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
        description: "Understand how smart contracts think, store state variables, manage volatile memory, and coordinate event indexers.",
        lessons: [
          {
            slug: "variables-and-state",
            title: "Variables and State",
            description: "State variables, local variables, visibility, and smart contract storage behaviors.",
            tags: ["variables", "state", "visibility"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "storage-vs-memory",
            title: "Storage vs Memory",
            description: "Storage, memory, and calldata. Why copying arrays behaves differently and costs different gas.",
            tags: ["storage", "memory", "calldata"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "arrays-and-mappings",
            title: "Arrays and Mappings",
            description: "Understanding O(1) lookup mappings versus dynamic iteration arrays.",
            tags: ["arrays", "mappings", "iteration"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "structs-and-data-modeling",
            title: "Structs and Data Modeling",
            description: "Modeling users, custom nested struct arrays, and on-chain database schemas.",
            tags: ["structs", "data-modeling", "gas"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "events-explained",
            title: "Events Explained",
            description: "Why smart contracts emit events instead of storing searchable parameters in blockchain state.",
            tags: ["events", "logs", "indexing"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          }
        ]
      },
      {
        id: "m1-2",
        number: "M1.2",
        name: "Ownership & Smart Contract Control",
        description: "Understand authorization patterns, modifier decorators, roles-based permissions, and smart contract immutability.",
        lessons: [
          {
            slug: "what-onlyowner-actually-does",
            title: "What onlyOwner Actually Does",
            description: "msg.sender checks, owner access privileges, and transferOwnership sequences.",
            tags: ["ownership", "authorization", "security"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "modifiers-explained",
            title: "Modifiers Explained",
            description: "Reusable validation logic, modifier ordering, and parameter pass-through execution.",
            tags: ["modifiers", "logic", "validation"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "role-based-access-control",
            title: "Role-Based Access Control",
            description: "Multi-admin governance, role registries, and OpenZeppelin AccessControl patterns.",
            tags: ["access-control", "roles", "openzeppelin"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "why-people-trust-smart-contracts",
            title: "Why People Trust Smart Contracts",
            description: "How immutable code and public verification eliminate the need for centralized administrators.",
            tags: ["immutability", "transparency", "trust"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          }
        ]
      },
      {
        id: "m1-3",
        number: "M1.3",
        name: "Deployment & Blockchain State",
        description: "Compiling bytecode, deterministic addresses, RPC switchboards, and the low-level virtual stack machine.",
        lessons: [
          {
            slug: "what-deployment-actually-means",
            title: "What deployment actually means — validator execution",
            description: "Bytecode compilation, constructor execution, contract address creation, and validators storing contract state.",
            tags: ["bytecode", "deployment", "constructors"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "abi-as-translator",
            title: "ABI as translator — mapping frontend to bytecode payloads",
            description: "JSON interfaces, function selectors, encoding args, and translating frontend calls to raw hex payloads.",
            tags: ["abi", "encoding", "selectors"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11

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
            slug: "contract-lifecycle",
            title: "Contract Lifecycle",
            description: "Tracing a contract from local Solidity compile to permanent validator replication.",
            tags: ["lifecycle", "compilation", "state"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          }
        ]
      },
      {
        id: "m1-4",
        number: "M1.4",
        name: "Evolutionary Voting System",
        description: "Build, break, analyze, and optimize an evolutionary production-grade voting architecture.",
        lessons: [
          {
            slug: "building-first-voting-system",
            title: "Building First Voting System",
            description: "Designing a naive Solidity voting engine using simple arrays and state allocations.",
            tags: ["architecture", "voting", "project"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 12
          },
          {
            slug: "how-i-broke-my-first-voting-system",
            title: "How I broke my first voting system — a gas disaster",
            description: "A flagship case study in Solidity anti-patterns: on-chain string storage, array traversals, and hitting the Block Gas Limit.",
            tags: ["gas", "reverts", "mistake", "loops"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 16
          },
          {
            slug: "blockchain-is-not-your-database",
            title: "Blockchain is NOT your database — hybrid design rules",
            description: "Crucial system design architectures: ProofChain, Firebase caching, IPFS hashing, event indexing, and resolving query issues.",
            tags: ["hybrid", "storage", "ipfs", "database"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 15
          },
          {
            slug: "how-i-designed-apis-for-web3",
            title: "How I designed APIs for Web3 — the ownership model",
            description: "Why the frontend can't call IPFS directly, how an Express proxy becomes a secure access layer, and the three-tier ownership model: Blockchain → IPFS → Backend → Frontend.",
            tags: ["api", "backend", "ipfs", "security", "architecture"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          },
          {
            slug: "optimizing-smart-contract-storage",
            title: "Optimizing Smart Contract Storage",
            description: "Refactoring state layout, slot packing, O(1) mappings, and lightweight event index architectures.",
            tags: ["gas", "packing", "optimization"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 14
          }
        ]
      },
      {
        id: "m1-5",
        number: "M1.5",
        name: "Security & Production Reality",
        description: "Understand reentrancy execution states, signature replays, tx.origin authentication exploits, and post-deployment audits.",
        lessons: [
          {
            slug: "reentrancy-explained",
            title: "Reentrancy Explained",
            description: "Understanding checks-effects-interactions and recursive call vulnerabilities.",
            tags: ["security", "reentrancy", "hacks"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          },
          {
            slug: "replay-attacks-explained",
            title: "Replay Attacks Explained",
            description: "Offline signature validation risks, transaction reuse, and nonce validation checks.",
            tags: ["security", "signatures", "replays"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "common-beginner-security-mistakes",
            title: "Common Beginner Security Mistakes",
            description: "Origin authentication exploits, missing validations, and unsafe state assumptions.",
            tags: ["security", "origin", "auth", "mistakes"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "production-reality-smart-contracts",
            title: "Production Reality of Smart Contracts",
            description: "Managing audits, monitoring deployments, proxy patterns, and emergency timelocks.",
            tags: ["audits", "upgrades", "monitoring"],
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
    id: 2,
    slug: "track-2",
    number: "T2",
    name: "Full Stack Web3",
    tagline: "Full Stack Web3 — Ship your first complete voting dApp (ChainElect) backed by Supabase.",
    description: "Start with a naive React and MetaMask prototype, watch it fail in production, and rewrite it. We'll solve real-world problems: scaling reads, caching IPFS, and indexing events.",
    color: "#14b8a6",
    difficulty: "beginner",
    prerequisites: [0, 1],
    estimatedHours: 12,
    moduleCount: 5,
    lessonCount: 15,
    heroProject: {
      name: "ChainElect — Socio3 Classic → Evolution",
      description: "Start with the naive React+MetaMask+direct-contract architecture. Watch it break at scale. Evolve it through backend introduction, Redis caching, and The Graph indexing until it becomes production-grade."
    },
    isSignature: false,
    modules: [
      {
        id: "m2-1",
        number: "M2.1",
        name: "My First Social dApp",
        description: "The starting architecture: React calls contracts directly, MetaMask is the only auth, Firebase stores metadata. Works at 20 users. Setting up the narrative before the pain.",
        lessons: [
          {
            slug: "my-first-thought-i-only-need-blockchain",
            title: "My first thought: I only need the blockchain",
            description: "The naive starting point — React calling contracts directly, MetaMask as the only backend, and why it actually works at small scale.",
            tags: ["react", "metamask", "contracts", "beginner-mistakes"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 13,
            isRealProject: true
          },
          {
            slug: "connecting-metamask-to-react",
            title: "Connecting MetaMask to React — the real way",
            description: "Network validation, chain switching, event listeners, and disconnection handling. The production-grade wallet connection pattern.",
            tags: ["metamask", "react", "web3js", "wallet-connection"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          },
          {
            slug: "reading-and-writing-contracts",
            title: "Reading and writing to contracts from React",
            description: "The complete flow for reads (view calls), writes (signed transactions), pending states, receipts, and error handling.",
            tags: ["react", "ethers", "contract-reads", "contract-writes"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 15,
            isRealProject: true
          }
        ]
      },
      {
        id: "m2-2",
        number: "M2.2",
        name: "The First Pain: Fetching",
        description: "getAllVoters() worked at 30 voters. At 1,000 it froze the browser. RPC rate limits, eth_getLogs block ceilings, and why event-driven loading is the correct pattern.",
        lessons: [
          {
            slug: "why-fetching-from-blockchain-hurt",
            title: "Why fetching from blockchain hurt — the getAllVoters() disaster",
            description: "What happens when direct contract reads scale from 10 items to 1,000. RPC timeouts, silent failures, and the moment you realize blockchain is not a database.",
            tags: ["rpc", "scaling", "reads", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          },
          {
            slug: "eth-getlogs-limits",
            title: "The hidden limits of eth_getLogs",
            description: "Why event log queries break at scale. Block range limits, RPC node restrictions, and the silent empty array bug.",
            tags: ["events", "eth_getLogs", "rpc", "limits", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "event-driven-data-loading",
            title: "Event-driven data loading — the correct pattern",
            description: "Using contract events as the source of truth: historical replays, real-time WebSocket subscriptions, and the bridge to off-chain indexing.",
            tags: ["events", "react", "realtime", "listeners"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 12
          }
        ]
      },
      {
        id: "m2-3",
        number: "M2.3",
        name: "Why Backend Suddenly Appeared",
        description: "The Pinata API key was in the browser JS bundle. Someone DM'd me the key. This is the story of why every serious Web3 dApp needs a backend — and what the backend's actual job is.",
        lessons: [
          {
            slug: "data-location",
            title: "Where does blockchain data actually live?",
            description: "The 3-layer hybrid architecture. Frontend, backend, and blockchain — what runs where, and why beginners think the blockchain does everything.",
            tags: ["nodes", "storage", "architecture"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "the-day-i-realized-frontend-is-not-enough",
            title: "The day I realized the frontend is not enough",
            description: "Why frontend code is a public document, how API key exposure happens in production, and the four operations that require a backend.",
            tags: ["security", "backend", "api-keys", "frontend-limits", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 13,
            isRealProject: true
          },
          {
            slug: "building-the-express-proxy-layer",
            title: "Building the Express proxy layer for IPFS uploads",
            description: "The complete Node.js/Express backend that proxies IPFS uploads, validates sessions, and keeps API keys server-side only.",
            tags: ["express", "node", "ipfs", "proxy", "backend"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 15,
            isRealProject: true
          }
        ]
      },
      {
        id: "m2-4",
        number: "M2.4",
        name: "Why Redis Suddenly Appeared",
        description: "IPFS gateways took 3–5 seconds per image. The admin panel took 8.3 seconds to load. 60% drop-off. This is why Redis appeared — and why cache invalidation in Web3 is uniquely elegant.",
        lessons: [
          {
            slug: "why-we-added-redis",
            title: "Why we added Redis — IPFS was too slow",
            description: "How direct IPFS gateway loads were killing UX, how Redis dropped load times from 4s to 80ms, and the Web3-specific cache invalidation insight.",
            tags: ["redis", "caching", "ipfs", "performance"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          },
          {
            slug: "how-to-set-up-redis-with-nextjs",
            title: "Setting up Redis caching in Next.js",
            description: "How to initialize Upstash Redis, set up a Next.js API route to cache slow IPFS requests, and build a resilient fallback handler.",
            tags: ["redis", "nextjs", "caching", "performance", "project"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 12
          },
          {
            slug: "cache-invalidation-in-web3",
            title: "Cache invalidation in Web3 — when does truth change?",
            description: "Immutable content-addressed caching vs mutable on-chain state. TTL-based vs event-driven invalidation. The hybrid cache strategy for a voting dApp.",
            tags: ["redis", "caching", "invalidation", "consistency"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 13
          }
        ]
      },
      {
        id: "m2-5",
        number: "M2.5",
        name: "Why Indexing Appeared",
        description: "The PM asked for a leaderboard sorted by votes. There is no ORDER BY in Solidity. This is why The Graph was invented — and how to deploy a subgraph that replaces all direct contract reads.",
        lessons: [
          {
            slug: "why-blockchain-needs-indexers",
            title: "Why blockchain needs indexers — the sort/filter problem",
            description: "The EVM has no query engine. No sorting, filtering, or aggregation. Why fetching everything to sort in JS doesn't scale — and how indexers pre-process events.",
            tags: ["indexing", "the-graph", "events", "query-limits"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          },
          {
            slug: "how-the-graph-works",
            title: "How The Graph works internally",
            description: "Subgraphs, indexing nodes, AssemblyScript handlers, and how The Graph processes every blockchain event into a queryable GraphQL database.",
            tags: ["the-graph", "subgraph", "graphql", "indexing"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "writing-your-first-subgraph",
            title: "Writing and deploying your first subgraph",
            description: "Step-by-step: define entities, write AssemblyScript event handlers, deploy to Subgraph Studio, and query the leaderboard with GraphQL.",
            tags: ["the-graph", "subgraph", "graphql", "assemblyscript", "project"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 18
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
    tagline: "Blockchain System Design — Build decentralized solutions to real-world problems (ProofChain & ChainCure).",
    description: "Figure out where boundaries lie, when to store off-chain, and how to model trust. We'll dissect the real architecture of Uniswap, ProofChain, and Socio3.",
    color: "#22c55e",
    difficulty: "intermediate",
    prerequisites: [2],
    estimatedHours: 9,
    moduleCount: 5,
    lessonCount: 14,
    heroProject: {
      name: "ProofChain",
      description: "Production-grade proof-of-existence system: file hashing on the frontend, IPFS storage, on-chain hash registry, event indexing, hybrid architecture."
    },
    isSignature: false,
    modules: [
      {
        id: "m3-1",
        number: "M3.1",
        name: "Architecture Thinking",
        description: "Actor modeling, boundaries, and why blockchain is not a database.",
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
        name: "Data Flow Design",
        description: "Tracing the lifecycles of on-chain and off-chain data flows.",
        lessons: [
          {
            slug: "how-data-moves-through-systems",
            title: "How data moves through hybrid systems",
            description: "Dissecting the journey of an uploaded image through standard web servers, IPFS, the blockchain log registry, and graph indexers.",
            tags: ["data-flow", "architecture", "ipfs", "indexing"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 14
          },
          {
            slug: "event-driven-architecture",
            title: "Event-driven architecture in Web3",
            description: "How user actions trigger contract events that act as asynchronous pipelines to update off-chain indexers and notification caches.",
            tags: ["events", "indexing", "architecture", "notifications"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "how-uniswap-actually-works",
            title: "How Uniswap actually works — AMM system design",
            description: "Deep dive into the Automated Market Maker (AMM) system architecture, the constant product formula (x * y = k), liquidity pool states, and arbitrage boundaries.",
            tags: ["uniswap", "amm", "system-design", "math", "liquidity"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m3-3",
        number: "M3.3",
        name: "Scalability Thinking",
        description: "Identify performance bottlenecks and cache data correctly in distributed environments.",
        lessons: [
          {
            slug: "why-direct-rpc-dies",
            title: "Why direct RPC queries die at scale",
            description: "Socio3 V1 scaling autopsy: how loading feeds via JSON-RPC works at 10 posts, degrades at 1000, and freezes browsers at 10000.",
            tags: ["rpc", "scalability", "bottlenecks", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 15
          },
          {
            slug: "why-redis-exists",
            title: "Why Redis exists in Web3 systems",
            description: "How direct IPFS gateway lookups cause massive latencies, and why caching immutable CIDs in Redis drops feed render times to 80ms.",
            tags: ["redis", "caching", "ipfs", "performance"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 12
          },
          {
            slug: "why-the-graph-exists",
            title: "Why The Graph exists — indexing deep dive",
            description: "EVM storage contains no ORDER BY or query features. How to compile smart contract events into instantly queryable GraphQL endpoints.",
            tags: ["indexing", "the-graph", "graphql", "queries"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m3-4",
        number: "M3.4",
        name: "Production Infrastructure",
        description: "Backends, API gateways, proxying, rate-limiting, and defensive structures.",
        lessons: [
          {
            slug: "why-backends-exist-in-web3",
            title: "Why backends exist in Web3 — API gateway design",
            description: "Debunking the 'blockchain is my backend' myth. Exposing Express proxy gateways to secure Pinata keys and run off-chain validations.",
            tags: ["backend", "api-gateway", "security", "proxies"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 13
          },
          {
            slug: "rate-limiting-and-abuse",
            title: "Rate limiting and abuse prevention",
            description: "Designing gas faucets that prevent Sybil attacks. Why native gas payouts must be rate-limited and routed strictly to EOA addresses.",
            tags: ["faucets", "rate-limiting", "security", "anti-fraud"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          }
        ]
      },
      {
        id: "m3-5",
        number: "M3.5",
        name: "Architecture Autopsies",
        description: "Dissecting the lifecycle transformations of five production dApps.",
        lessons: [
          {
            slug: "chainelect-autopsy",
            title: "ChainElect autopsy — gas limits and storage bottlenecks",
            description: "A postmortem on ChainElect: how a naive smart contract architecture hit the Block Gas Limit, how on-chain storage traversals fail, and how to pack slots for efficiency.",
            tags: ["autopsy", "chainelect", "gas", "storage", "optimization"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 14
          },
          {
            slug: "socio3-autopsy",
            title: "Socio3 autopsy — from naive RPC to decoupled production stack",
            description: "A postmortem on Socio3: tracing how direct JSON-RPC queries froze the browser at 1,000 posts, and how we rebuilt it using Privy, ERC-4337, The Graph, and Redis.",
            tags: ["autopsy", "socio3", "rpc", "the-graph", "caching", "ux"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 16
          },
          {
            slug: "chaincure-autopsy",
            title: "ChainCure autopsy — role permissions and trust boundaries",
            description: "A postmortem on ChainCure: how a single compromised key halted a pharmaceutical supply chain, and how to design multi-signature role constraints.",
            tags: ["autopsy", "chaincure", "access-control", "multisig", "security"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: true,
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
    name: "The Death of Traditional Web3 UX",
    tagline: "The Death of Traditional Web3 UX — Build next-gen sponsored UX using erc4337-kit & ChainNotesV2.",
    description: "MetaMask is terrible for consumer onboarding. Build modern login flows using social sign-ins, embedded wallets, and gasless smart accounts.",
    color: "#f59e0b",
    difficulty: "advanced",
    prerequisites: [2],
    estimatedHours: 8,
    moduleCount: 5,
    lessonCount: 19,
    heroProject: {
      name: "Socio3 V2",
      description: "Rebuild the Socio3 Classic social network with Privy embedded social authentication, Pimlico gas sponsorship, and useroperation batching."
    },
    isSignature: true,
    modules: [
      {
        id: "m4-1",
        number: "M4.1",
        name: "Why Web3 UX Failed",
        description: "Seed phrases, browser extensions, mobile sandbox deep links, and network switching friction.",
        lessons: [
          {
            slug: "why-metamask-confusion",
            title: "Why MetaMask confused everyone",
            description: "How browser extensions fail, and why non-technical users confuse local key managers with the blockchain networks.",
            tags: ["ux", "metamask", "faucets", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "why-seed-phrases-fail",
            title: "Why seed phrases fail real users",
            description: "Writing down 12 words is conversion suicide. Why users reject the physical security and mental load of custody.",
            tags: ["ux", "security", "friction"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "why-web3-mobile-onboarding-sucks",
            title: "Why Web3 mobile onboarding sucks",
            description: "In-app browser sandboxes, deep link handshake drops, and the user journey of mobile wallets.",
            tags: ["ux", "mobile", "wallets", "mistake"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "why-network-switching-pain",
            title: "Why network switching screws up UX",
            description: "The technical friction of switching networks and chain IDs, and why users shouldn't know what chain they are using.",
            tags: ["ux", "networks", "chain-ids"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "what-privy-does",
            title: "What Privy actually does",
            description: "Securing sharded private keys using Hardware Security Modules (HSMs) without web app custody.",
            tags: ["privy", "security", "mpc"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          }
        ]
      },
      {
        id: "m4-2",
        number: "M4.2",
        name: "Embedded Wallets",
        description: "What Privy is, sharded HSM keys, social login OAuth mapping, and background EOA creation.",
        lessons: [
          {
            slug: "why-privy-exists",
            title: "Why Privy exists",
            description: "The historical shift from external wallets to developer-managed, application-embedded authentication.",
            tags: ["wallets", "privy", "ux"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "eoa-creation-flow",
            title: "EOA creation mechanics",
            description: "How Privy silently generates cryptographically secure local keys and stores them securely inside browser storage.",
            tags: ["wallets", "eoa", "cryptography"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "social-login-integration",
            title: "Social login OAuth integration",
            description: "Integrating Google and Apple social sign-in with Privy and validating JWT tokens in React.",
            tags: ["auth", "react", "oauth", "project"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 13,
            isRealProject: true
          }
        ]
      },
      {
        id: "m4-3",
        number: "M4.3",
        name: "Account Abstraction",
        description: "EOA limits, Smart Accounts, ERC-4337, and the Socio3 V2 architecture.",
        lessons: [
          {
            slug: "why-eoas-are-limiting",
            title: "Why EOAs are limiting",
            description: "Why single private-key accounts cannot handle gas sponsorship, batched transactions, or conditional access keys.",
            tags: ["eoas", "security", "limitations"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "smart-accounts-explained",
            title: "Smart Accounts & Socio3 V2",
            description: "Turning smart contracts into wallets. How Smart Accounts decouple authorization from account state.",
            tags: ["smart-accounts", "socio3", "architecture"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          },
          {
            slug: "erc-4337-explained",
            title: "ERC-4337 explained",
            description: "EntryPoint execution, alternative UserOperations mempools, and the low-level account abstraction standard.",
            tags: ["erc4337", "account-abstraction", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 15
          }
        ]
      },
      {
        id: "m4-4",
        number: "M4.4",
        name: "Paymasters & Gasless UX",
        description: "Bundlers, Paymasters, gas sponsorship, and UserOperation field structures.",
        lessons: [
          {
            slug: "what-pimlico-does",
            title: "What Pimlico actually does",
            description: "Understanding bundlers and paymasters as off-chain execution infrastructure.",
            tags: ["pimlico", "infrastructure", "bundlers"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "gas-sponsorship-mechanics",
            title: "Gas sponsorship mechanics",
            description: "Verifying Paymasters, signing sponsorship payloads, and depositing gas budgets.",
            tags: ["paymasters", "gas", "real-code"],
            hasDiagram: true,
            hasMistake: true,
            hasProject: false,
            estimatedMinutes: 13
          },
          {
            slug: "useroperations-anatomy",
            title: "UserOperations field anatomy",
            description: "Breaking down sender, nonce, callData, paymasterAndData, and gas limits in a UserOp.",
            tags: ["userop", "erc4337", "diagram"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 14
          },
          {
            slug: "how-bundlers-work",
            title: "How bundlers work",
            description: "Listening to alternative mempools and packing UserOps into valid EVM L1/L2 transactions.",
            tags: ["bundlers", "mempool", "fees"],
            hasDiagram: true,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          }
        ]
      },
      {
        id: "m4-5",
        number: "M4.5",
        name: "Production UX",
        description: "Session keys, progressive onboarding, invisible wallets, and consumer web3 adoption.",
        lessons: [
          {
            slug: "session-keys-ux",
            title: "Session keys — clickless interaction",
            description: "Pre-authorizing temporary, target-scoped keys to execute actions without constant wallet popups.",
            tags: ["session-keys", "ux", "security"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 12
          },
          {
            slug: "progressive-onboarding",
            title: "Progressive onboarding in dApps",
            description: "Allowing users to navigate and create draft records before silently initializing their wallet credentials.",
            tags: ["ux", "onboarding", "conversion"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 11
          },
          {
            slug: "invisible-wallets",
            title: "Invisible wallets and term hiding",
            description: "Designing interfaces that replace Web3 terms ('claim', 'mint', 'sign') with familiar consumer actions ('save', 'post', 'like').",
            tags: ["ux", "design", "copywriting"],
            hasDiagram: false,
            hasMistake: false,
            hasProject: false,
            estimatedMinutes: 10
          },
          {
            slug: "consumer-web3-realities",
            title: "Consumer Web3 realities",
            description: "How Socio3 V2, ZKredential, and other production apps scaled to mainstream audiences.",
            tags: ["case-study", "scaling", "real-life"],
            hasDiagram: false,
            hasMistake: true,
            hasProject: true,
            estimatedMinutes: 14,
            isRealProject: true
          }
        ]
      }
    ]
  },
  {
    id: 5,
    slug: "track-5",
    number: "T5",
    name: "Zero Knowledge & Privacy Engineering [WIP]",
    tagline: "Zero Knowledge & Privacy Engineering — Master zkSNARKs with Circom, Soulbound NFTs, and Zkredential.",
    description: "Prove credentials dynamically. Compile Circom circuits, build witness generators, Poseidon hashing, and mint soulbound NFT credentials.",
    color: "#ec4899",
    difficulty: "expert",
    prerequisites: [1, 2],
    estimatedHours: 8,
    moduleCount: 3,
    lessonCount: 12,
    heroProject: {
      name: "ZK Credential Verifier",
      description: "Based on ZKredential — MIT hackathon top-15. Circom circuits, Groth16 proofs, Poseidon hashing, ERC-5192 Sbound NFTs, Polygon Amoy."
    },
    isSignature: true,
    isWIP: true,
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
    tagline: "Security & Production Engineering — Protect protocols and distribute paper via ZeroLeak.",
    description: "Prevent replay attacks, distribute trust using Shamir Secret Sharing, design timelocks, and build backup RPC infrastructure so your app survives mainnet.",
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
    tagline: "Real-World Blockchain Systems — Orchestrate indexers, node clusters, and production networks.",
    description: "Dissect fully deployed production systems. Fake drugs, exam leaks, and credential privacy—solving real problems with real systems.",
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
