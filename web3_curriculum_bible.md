
**learn.atharvabaodhankar.me**

Complete Curriculum Bible

v1.0 · Final · 8 Tracks · 40+ Modules · 12 Real Projects · Zero Hype


*Built from real confusion. Shipped projects. Production mistakes. Honest engineering.*


# **01  CORE VISION & PHILOSOPHY**


## **What This Platform Is NOT**
- Tutorial spam or copy-paste coding education
- Crypto hype or "create a token in 5 minutes" content
- Boring documentation portals
- Syntax-first, concept-never teaching

## **What This Platform IS**
A production-grade Web3 engineering curriculum built from real confusion, shipped projects, architecture mistakes, debugging sessions, and genuine beginner struggles.

Goal: Teach Web3 like a developer explaining systems to another confused developer.

## **The Core Problem We Solve**
Current blockchain education is scattered. One tutorial teaches wallets. Another teaches Solidity. Another covers ERC-4337. But nobody explains how everything connects, why these technologies exist, or what production systems actually look like.

**Most tutorials teach:**

commands and APIs.

**This platform teaches:**

mental models and systems.

## **Platform Inspiration**
The platform should feel like Stripe Docs, Linear, Vercel, Framer, and roadmap.sh — NOT GeeksForGeeks, Tutorialspoint, or boring documentation portals.


# **02  EDUCATIONAL PHILOSOPHY**


## **The Problem-First Learning Model**
Every single lesson on this platform follows this exact structure, in this exact order:

1. Problem — What real-world issue are we solving?
1. Layman Explanation — Analogy a non-developer can understand
1. Technical Explanation — The actual engineering explanation
1. Real-world Usage — How production apps handle this
1. Reality Check — What breaks, what costs, what fails at scale
1. Mistakes I Made — Personal stories from real shipped projects
1. Mini Challenge — A small hands-on exercise
1. Hero Project Integration — How this lesson feeds the track capstone

## **The Three Core Learning Systems**

### **1. Hero Project System**
Each track revolves around ONE major real-world project. Lessons are ingredients. The project is the final meal. Students should never feel "why am I learning this?" — every lesson contributes directly toward a deployable, production-grade application.

### **2. Reality Check System**
Every lesson includes a dedicated Reality Check component that explains how this concept behaves in real production systems — covering tradeoffs, costs, failure modes, and scalability concerns.

**⚡ REALITY CHECK:**  This Solidity pattern works locally in Ganache. In production: storage costs explode, indexing becomes necessary, and transaction failures become common. Never design for local — design for mainnet.

### **3. Mistakes I Made System**
Every module integrates real mistakes and confusions faced while building ZKredential, ChainCure, ZeroLeak, erc4337-kit, and other shipped projects. NOT hidden — integrated directly into lessons as first-class content.

**⚠ MISTAKE I MADE:**  I broke my first blockchain voting system by storing huge voter data directly on-chain. Some transactions worked. Some randomly failed. The code was fine. The architecture was broken. Blockchain is not a general-purpose database.


# **03  DIAGRAM DESIGN SYSTEM**


All diagrams across the platform share a unified visual language. Every SVG diagram must feel like it belongs to the same family — the way GeeksForGeeks has a recognizable diagram style.

## **Color Palette — Diagram System**

**Background:**

Primary bg:   #09090b   (near black)

Card bg:      #111113   (elevated surface)

Border:       rgba(255,255,255,0.08)

**Node Colors by Track:**

T0 Foundations:     #7c3aed  (violet)

T1 Smart Contracts: #3b82f6  (blue)

T2 Full Stack:      #14b8a6  (teal)

T3 System Design:   #22c55e  (green)

T4 Modern UX:       #f59e0b  (amber)

T5 ZK & Privacy:    #ec4899  (pink)

T6 Security:        #f97316  (orange)

T7 Real Systems:    #06b6d4  (cyan)

## **Typography in Diagrams**
Labels:       Geist Mono, 11–12px, color: #a1a1aa

Node titles:  Geist, 13px, bold, color: #fafafa

Arrows:       1px stroke, color: rgba(255,255,255,0.2)

Arrow heads:  filled, 6px, same color as stroke

## **Diagram Types & Prompts**

### **Type 1: Architecture Flow Diagram**
Use for: system actor flows, request lifecycles, ChainCure supply chain, ZKredential data flow.

**Prompt template for AI generation:**

Create an SVG architecture diagram on a #09090b background.

Show [N] actors as rounded rectangles (rx=8).

Actor fill: #111113, border: rgba(255,255,255,0.12), 1px.

Actor label: Geist Mono, 12px, #a1a1aa, uppercase.

Actor title: Geist, 14px, bold, #fafafa.

Arrows: 1px, rgba(255,255,255,0.2), with small filled arrowhead.

Arrow labels: 11px, #52525b, Geist Mono.

Track accent color for active/highlighted nodes: [track color].

No drop shadows. No gradients on nodes. Clean and minimal.

### **Type 2: State Machine Diagram**
Use for: transaction lifecycle, drug state transitions, ZK proof flow.

**Prompt template:**

Create an SVG state machine on #09090b background.

States as circles, diameter 64px.

Active state fill: [track color], inactive: #18181b.

State label: Geist, 12px, #fafafa, centered.

Transitions: curved arrows, 1px, rgba(255,255,255,0.15).

Transition labels: 10px, Geist Mono, #52525b.

Initial state marker: small filled dot, #7c3aed.

### **Type 3: Comparison Table Diagram**
Use for: MetaMask vs Privy, ethers v5 vs v6, testnet vs mainnet.

**Prompt template:**

Create an SVG comparison diagram on #09090b background.

Two columns side by side, separated by 1px rgba(255,255,255,0.08) line.

Column headers: 13px, Geist, bold, #fafafa.

Left column header accent: #ef4444 (bad/old pattern).

Right column header accent: #22c55e (good/modern pattern).

Rows: 11px, Geist Mono, alternating #111113 and #18181b fills.

Row text: #a1a1aa for left, #d4d4d8 for right.

### **Type 4: Concept Explainer Diagram**
Use for: what a block is, how hashing works, private/public key relationship.

**Prompt template:**

Create an SVG explainer diagram on #09090b background.

Central concept box: #111113 fill, 2px solid [track color] border, rx=12.

Surrounding nodes: smaller boxes, #18181b fill, 1px border rgba(255,255,255,0.08).

Connecting lines: dashed, 1px, rgba(255,255,255,0.12).

All text: Geist or Geist Mono. No decorative elements.

One highlight glow: box-shadow equivalent using filter:drop-shadow on key node.

## **Diagram Consistency Rules**
- NEVER use white or light backgrounds in any diagram
- NEVER use rainbow or gradient fills on nodes
- ALWAYS use the track accent color for that track's diagrams only
- ALWAYS use Geist / Geist Mono as the font family
- ALWAYS keep arrows thin (1px) and understated
- NEVER add decorative borders, drop shadows, or glow effects except one intentional highlight
- Every diagram must be readable at 800px wide minimum


# **04  CURRICULUM MAP & PREREQUISITES**


## **Track Dependency Graph**

T0 Foundations

`    `↓

T1 Smart Contracts

`    `↓

T2 Full Stack Web3

`    `↓  ↓  ↓

`  `T3  T4  T5    ← parallel specializations (pick any order after T2)

`    `↓  ↓

`  `T6  T7        ← expert tracks (require T3 + T4 or T5)

## **Track Overview**

**T0 — Blockchain Foundations**

`  `4 modules · 14 lessons · Beginner · No prereqs · ~6 hours

`  `Hero Project: Visual Blockchain + Transaction Flow Simulator

**T1 — Solidity & Smart Contract Engineering**

`  `5 modules · 18 lessons · Intermediate · Prereq: T0 · ~10 hours

`  `Hero Project: Evolutionary Voting System (bad → good → production architecture)

**T2 — Full Stack Web3**

`  `4 modules · 16 lessons · Intermediate · Prereq: T0 + T1 · ~9 hours

`  `Hero Project: Socio3 Classic — traditional Web3 dApp with MetaMask + IPFS

**T3 — Blockchain System Design**

`  `4 modules · 15 lessons · Advanced · Prereq: T2 · ~8 hours

`  `Hero Project: ProofChain — file hashing + IPFS + blockchain proof layer + indexing

**T4 — Modern Web3 UX & Account Abstraction  ★ SIGNATURE**

`  `4 modules · 16 lessons · Advanced · Prereq: T2 · ~9 hours

`  `Hero Project: Socio3 Evolution — MetaMask → Google login → gasless smart accounts

**T5 — Zero Knowledge & Privacy Engineering  ★ SIGNATURE**

`  `3 modules · 12 lessons · Advanced · Prereq: T1 + T2 · ~8 hours

`  `Hero Project: ZK Credential Verifier (based on ZKredential — Velora 1.0 top-15)

**T6 — Security & Production Engineering**

`  `3 modules · 11 lessons · Expert · Prereq: T3 + T4 · ~7 hours

`  `Hero Project: ZeroLeak — AES-256 + Shamir Secret Sharing + blockchain timelock

**T7 — Real-World Blockchain Systems**

`  `3 modules · 10 lessons · Expert · Prereq: T5 + T6 · ~6 hours

`  `Hero Projects: ChainCure + CiviChain — real deployed production systems


# **05  FULL TRACK & MODULE BREAKDOWN**

# **T0  Blockchain Foundations**
*Build REAL blockchain intuition. Understand what blockchain physically is, where data exists, how networks work, why wallets exist, and why gas exists — before writing a single line of code.*

**4 modules · 14 lessons · Beginner · No prerequisites · ~6 hours**

**★ HERO PROJECT: Visual Blockchain Simulator  —**  Students build a transaction flow simulator, block visualizer, node propagation animation, and gas simulation system — using vanilla JS + SVG. No contract code yet.


### **M0.1 — Why Blockchain Exists**
Start with the problem, not the technology. The double-spend problem. Centralized trust failure. Why Bitcoin was invented.

**01  The trust problem — why do we need banks?**  [diagram]\
`     `Double-spend problem. Why digital money failed before Bitcoin. The human cost of centralized trust.

**02  Centralized vs decentralized systems**  [diagram]\
`     `Single point of failure. Censorship. Downtime. Why decentralization solves specific problems — and creates new ones.

**03  What blockchain actually invented**\
`     `Not just a database. A consensus mechanism for untrusted parties. The Nakamoto breakthrough.

**04  Where blockchain SHOULD NOT be used**  [mistake]\
`     `The most important lesson in T0. If a database works, use a database. Blockchain is a trust primitive.

**⚠ MISTAKE I MADE:**  I suggested blockchain for a simple school attendance system in year 1. A Google Sheet would have worked better. Blockchain adds cost and complexity — only use it when trust between untrusted parties is the actual problem.


### **M0.2 — How Blockchain Actually Works**
What is a block. What is a chain. How consensus works. What actually happens during a transaction — visually.

**01  What is a block — data structure deep dive**  [diagram · interactive]\
`     `Previous hash, merkle root, timestamp, nonce, transactions. Why the previous hash chains blocks together.

**02  Transactions explained visually**  [diagram]\
`     `From, to, value, data, signature. What happens when you press send. The mempool.

**03  Consensus — how strangers agree**  [diagram]\
`     `Byzantine fault tolerance for humans. Why miners/validators exist. The economic incentive design.

**04  PoW vs PoS — why Ethereum switched**\
`     `Energy cost of mining. Proof of Stake economics. Validators, slashing, finality. Why it matters for developers.

**⚡ REALITY CHECK:**  Understanding consensus is not just academic. As a developer, consensus determines your transaction finality time, your chain's security assumptions, and whether a block can be reorganized after you read it.


### **M0.3 — Networks & Storage**
Mainnet vs testnet. Ethereum vs Polygon vs Solana. RPC explained. Where blockchain data actually lives.

**01  Where does blockchain data actually live?**  [diagram]\
`     `Nodes. Full nodes vs light nodes vs archive nodes. Why "the blockchain" is millions of computers.

**02  Mainnet vs testnet — NOT the same thing**  [mistake]\
`     `Different chain IDs, RPCs, contract addresses. Why testnet ETH has no value. Why code that works on Sepolia breaks on mainnet.

**03  RPC explained — your app's phone line to the blockchain**  [diagram · interactive]\
`     `JSON-RPC spec. eth\_call, eth\_blockNumber. Why you need Alchemy or QuickNode. What happens without a node.

**04  Ethereum vs Polygon vs Base — when to deploy where**\
`     `Gas costs, finality, ecosystem, liquidity. How L2s work conceptually. Why this platform uses Polygon Amoy.

**⚠ MISTAKE I MADE:**  Confused testnet and mainnet for 3 weeks. Different RPC URLs. Different chain IDs. Different contract addresses. Different faucets. They behave similarly but are completely separate networks. Burned time deploying to wrong network and wondering why nothing worked.


### **M0.4 — Wallets & Identity**
Wallets are NOT actually wallets. Private keys, public keys, seed phrases, signing — the cryptographic identity system.

**01  Private keys, public keys, addresses**  [diagram]\
`     `Asymmetric cryptography for humans. Your private key IS your identity. Losing it means losing everything. Forever.

**02  What MetaMask actually does — and doesn't do**  [mistake]\
`     `It's a key manager, not a wallet. Coins live on-chain, not in MetaMask. Why browser extensions are poor production UX.

**03  Seed phrases — brilliant security, terrible UX**  [diagram]\
`     `BIP-39 mnemonic. HD wallet derivation paths. Why 12 words = full account control. Why this kills onboarding.

**04  Signing a transaction — prove identity without revealing key**  [diagram]\
`     `ECDSA signatures. Sign a message, verify on-chain. Why signing ≠ sending. The foundation of Web3 auth.

**⚠ MISTAKE I MADE:**  Thought MetaMask was the blockchain. Asked a friend "is MetaMask down?" when a transaction failed. MetaMask is just a key manager — the blockchain is completely separate. This confusion lasted embarrassingly long.


### **M0.5 — Gas & Transactions**
What gas actually is, why it exists, why you pay even when transactions fail, and who receives your gas fees.

**01  What gas actually is — EVM opcode pricing**  [diagram]\
`     `Every EVM operation costs computation. Gas is the unit of that computation. Not arbitrary — it's a resource metering system.

**02  Base fee + priority fee — EIP-1559 explained**  [diagram]\
`     `How gas pricing actually works post-London upgrade. Why base fee burns. Why priority fee goes to validators.

**03  Why you pay gas even when the transaction fails**  [mistake]\
`     `EVM still executed. Validators still processed. The gas meter ran. Analogous to a taxi meter running even if you don't reach destination.

**04  Why Polygon is cheaper than Ethereum**\
`     `Block space supply and demand. L1 vs L2 economics. Why gas price is not fixed. How rollups reduce costs.

**⚠ MISTAKE I MADE:**  Hardcoded a gas limit of 21000 for a contract call. That's only enough for simple ETH transfers. Contract calls need more. Transaction reverted every time with out-of-gas error. Let ethers.js estimate gas — don't hardcode it.


# **T1  Solidity & Smart Contract Engineering**
*Write contracts that don't get hacked. Understand storage, events, security patterns, and why OpenZeppelin exists. Every lesson uses real contract code from shipped projects.*

**5 modules · 18 lessons · Intermediate · Prereq: T0 · ~10 hours**

**★ HERO PROJECT: Evolutionary Voting System  —**  Intentionally starts with a broken architecture (voter data stored on-chain), hits gas failures in practice, and evolves through optimization to a production-grade contract. Students experience the engineering journey, not just the final answer.


### **M1.1 — Solidity Fundamentals**
Types, functions, visibility, storage vs memory. The mental model for writing contracts correctly from day one.

**01  Solidity types and why they cost gas**  [diagram]\
`     `uint256, address, bytes32, string, bool. Why smaller types don't always save gas. Storage slot packing rules.

**02  Storage vs memory vs calldata**  [mistake]\
`     `Three data locations. Why using storage when you meant memory costs 100x more gas. The mistake every beginner makes.

**03  Mappings vs arrays — when to use which**  [real code]\
`     `O(1) lookup vs iteration cost. Why you can't loop a mapping. The ChainCure role mapping pattern.

**04  Events — the blockchain's logging system**  [diagram]\
`     `Why events exist. How The Graph indexes them. The cost difference between emit and store. Why frontends use events, not storage reads.

**⚠ MISTAKE I MADE:**  Stored voter names, descriptions, and full proposal text directly on-chain in the voting contract. Every transaction that modified the contract cost enormous gas. Some transactions hit the block gas limit and failed randomly. Moved all text to IPFS. Stored only hashes on-chain. Problem solved.


### **M1.2 — Smart Contract Architecture**
Events, modifiers, ownership, role systems, access control. How to structure contracts that are maintainable and secure.

**01  Modifiers and access control basics**\
`     `onlyOwner, onlyRole, require vs revert vs custom errors. Writing clean, readable guard logic.

**02  OpenZeppelin Access Control**  [real code]\
`     `Roles as bytes32. grantRole, revokeRole, hasRole. Why you should never hand-roll access control. Security audit trails.

**03  Multi-admin systems — the ChainCure pattern**  [real code · diagram]\
`     `isAdmin mapping, admin approval flows, decentralized role assignment. Real contract walkthrough from a shipped project.

**04  Ownable vs AccessControl — when to use which**\
`     `Single owner vs granular roles. Why ChainCure uses AccessControl. Tradeoffs in flexibility vs simplicity.


### **M1.3 — Deployment & Blockchain State**
What deployment actually means. Bytecode. ABI. How React talks to blockchain. The questions beginners are too afraid to ask.

**01  What deployment actually means**  [diagram]\
`     `Compiling to bytecode. Sending a creation transaction. The contract address derivation. Immutability post-deployment.

**02  ABI — the contract's API specification**\
`     `JSON interface. Function selectors. Why frontend needs ABI. Why ABI must match the deployed bytecode exactly.

**03  Hardhat — local development environment**  [mistake]\
`     `Local chain, deployment scripts, testing, compiler configuration. Why Ganache vs Hardhat. The toolchain stack.

**04  Deploying to Polygon Amoy testnet**  [project]\
`     `hardhat.config.js, .env secrets, deploy scripts, Polygonscan verification. Saving ABI for frontend consumption.

**⚠ MISTAKE I MADE:**  Spent 2 hours debugging why my frontend couldn't call my contract. The ABI in the frontend was from an earlier compiled version. Always copy the fresh ABI from Hardhat artifacts after every recompile. Keep them in sync.


### **M1.4 — Token Standards**
ERC-20, ERC-721, ERC-5192. What standards are, why they exist, and how to build tokens that work with every wallet and marketplace.

**01  ERC-20 — fungible tokens**  [project]\
`     `transfer, approve, allowance. Why the approve+transferFrom pattern exists. Infinite approval risks. Building with OpenZeppelin.

**02  ERC-721 — NFTs from first principles**  [project]\
`     `tokenId, ownerOf, transferFrom. Metadata URI. Why an NFT is just a unique token ID with an owner mapping.

**03  ERC-5192 — soulbound (non-transferable) NFTs**  [real code]\
`     `The locked() function. Why ZKredential used soulbound NFTs for credentials. When transferability is a security flaw.

**04  IPFS metadata — the correct pattern**  [mistake]\
`     `tokenURI pointing to IPFS. Why on-chain metadata is expensive. Pinata upload flow. What happens when NFT metadata host dies.

**⚠ MISTAKE I MADE:**  First NFT project stored all metadata on-chain as a JSON string. Transaction cost was enormous. Moved to IPFS with Pinata. Store only the CID on-chain. Standard industry pattern that saves 90%+ gas on metadata.


### **M1.5 — Contract Security**
Reentrancy, integer overflow, tx.origin attacks, front-running. The vulnerabilities that drained millions — and how to prevent them.

**01  Reentrancy — the $60M DAO hack explained**  [diagram]\
`     `How the attack works step by step. Checks-Effects-Interactions pattern. ReentrancyGuard from OpenZeppelin.

**02  Integer overflow and underflow**\
`     `Pre-Solidity 0.8 math bugs. SafeMath. Why 0.8+ fixed this but you still need to understand it for older contracts.

**03  tx.origin vs msg.sender — the phishing vector**  [mistake]\
`     `How tx.origin attacks work. Why msg.sender is always correct for auth. Real exploit walkthrough.

**04  Security checklist for every contract**  [real code]\
`     `Pre-deploy checklist. Slither static analysis. Hardhat test coverage targets. The ZKredential contract security review process.


# **T2  Full Stack Web3**
*Connect deployed contracts to real UIs. ethers.js v6, viem, wagmi, IPFS, wallet integration — with the production differences explained that no tutorial ever covers.*

**4 modules · 16 lessons · Intermediate · Prereq: T0 + T1 · ~9 hours**

**★ HERO PROJECT: Socio3 Classic  —**  Traditional Web3 social app: MetaMask wallet connection, IPFS content storage, smart contract interactions, decentralized metadata. Teaches the classic Web3 architecture before T4 evolves it into a modern app.


### **M2.1 — ethers.js v6 & viem**
The two libraries every Web3 frontend uses. What changed from v5. Why viem exists. When to use which one.

**01  ethers.js v6 — what changed from v5**  [mistake]\
`     `Provider, Signer, Contract API changes. Why half of YouTube tutorials are broken. The migration trap every beginner falls into.

**02  Reading from contracts — eth\_call**  [real code]\
`     `contract.read(), public getters, ABI decoding. Why reads are free. Multicall for batching.

**03  Writing to contracts — transaction flow**  [diagram]\
`     `contract.write(), waiting for receipts, handling pending/confirmed/failed states in UI. The 5 transaction states.

**04  viem — type-safe modern alternative**\
`     `Why wagmi v2 uses viem under the hood. Tree-shaking. Type safety. When to prefer viem over ethers.

**⚠ MISTAKE I MADE:**  Followed a YouTube tutorial that used ethers.js v5. Spent 4 hours debugging. getDefaultProvider is gone. The Contract constructor changed. Signer API changed. Always check the package version before copying Web3 code.


### **M2.2 — wagmi + Wallet Connection**
The standard React hooks library for Web3. Wallet connection, chain switching, read/write hooks.

**01  wagmi setup — WagmiConfig and chains**  [real code]\
`     `Config object, chain definitions, transports. Setting up Polygon Amoy. The provider hierarchy.

**02  useAccount, useConnect, useDisconnect**  [real code]\
`     `Core wallet hooks. RainbowKit vs custom connect UI. ChainCure wallet integration walkthrough.

**03  useReadContract and useWriteContract**\
`     `Replacing raw ethers calls. Type-safe ABI usage. Loading and error states from hooks.

**04  Transaction states in UI — the full model**  [diagram]\
`     `idle → pending → confirming → confirmed → error. How to build Web3 buttons that handle all 5 states.


### **M2.3 — IPFS & Decentralized Storage**
Why on-chain storage is expensive. IPFS content addressing. Pinata uploads. The hybrid storage pattern every production app uses.

**01  Why IPFS exists — content vs location addressing**  [diagram]\
`     `CIDs. Why https:// links die. Why IPFS hashes are permanent if pinned. Content addressing as a concept.

**02  Pinata — uploading from React**  [real code]\
`     `API key setup, upload function, getting CID back, building the gateway URL. Real upload code from ChainCure.

**03  The hybrid storage pattern**  [diagram · mistake]\
`     `Store hash on-chain. Store data on IPFS. Store app state in a database. This is how 99% of production Web3 apps work.

**⚡ REALITY CHECK:**  Production apps never store large data on-chain. Blockchain stores proofs, ownership, and rules. IPFS stores files. Databases store application state. Understanding this distinction is the most important architectural insight in Web3 development.


### **M2.4 — Event Indexing & The Graph**
Why querying events live breaks production apps. How indexers work. Building a subgraph. The Graph vs custom indexers.

**01  Why live event queries break at scale**  [mistake]\
`     `getLogs limits, RPC rate limits, slow historical queries. Why you can't build a good UI on raw eth\_getLogs.

**02  How The Graph works internally**  [diagram]\
`     `Subgraph manifest, schema, AssemblyScript handlers. How the indexer listens to events and builds a queryable GraphQL database.

**03  Writing and deploying a subgraph**  [project]\
`     `schema.graphql, subgraph.yaml, event handlers. Deploy to The Graph Studio. Query with GraphQL.

**04  Custom indexer vs The Graph — tradeoffs**\
`     `Supabase + event listener as a lightweight alternative. Decentralization vs operational simplicity. When to choose each.

**⚠ MISTAKE I MADE:**  Built a token dashboard that called eth\_getLogs for the last 50,000 blocks on every page load. Public RPC rate-limited the app within hours. The Graph solved this. Index once, query infinitely.


# **T3  Blockchain System Design**
*How production systems are actually designed. Actors, flows, trust boundaries, storage decisions. How Uniswap, OpenSea, and rollups actually work.*

**4 modules · 15 lessons · Advanced · Prereq: T2 · ~8 hours**

**★ HERO PROJECT: ProofChain  —**  Production-grade proof-of-existence system: file hashing on the frontend, IPFS storage, on-chain hash registry, event indexing, hybrid architecture. Teaches how to design a complete system from scratch.


### **M3.1 — System Design Thinking for Blockchain**
The framework for designing any blockchain system. Actors, trust, storage decisions, off-chain vs on-chain boundaries.

**01  Actor modeling — who does what**  [diagram · real code]\
`     `Define every actor. Their permissions. Their trust level. The ChainCure 5-actor model as the teaching example.

**02  What goes on-chain vs off-chain**  [diagram · mistake]\
`     `On-chain: ownership, rules, proofs. Off-chain: data, UX, metadata. The decision framework.

**03  When NOT to use blockchain**\
`     `The most important lesson in T3. If a database works, use a database. Blockchain is a trust primitive for specific problems.


### **M3.2 — How Famous Protocols Work**
Uniswap, OpenSea, rollups, and bundlers — architecture teardowns. Not how to use them but how they're actually built.

**01  How Uniswap works — AMM from first principles**  [diagram]\
`     `x\*y=k constant product formula. Liquidity pools. Price impact. Slippage. V2 vs V3 concentrated liquidity.

**02  How OpenSea works — NFT marketplace architecture**  [diagram]\
`     `Seaport protocol. Off-chain orderbook + on-chain settlement. How royalties work. Why gas is paid by the buyer.

**03  How rollups work — L2 scaling**  [diagram]\
`     `Optimistic vs ZK rollups. Sequencers. Fraud proofs. Why Polygon, Base, Arbitrum exist and when to deploy where.

**04  How bundlers work — ERC-4337 infrastructure**  [diagram]\
`     `The alternative mempool. UserOperation validation. Bundler economics. Why Pimlico exists as a service.


### **M3.3 — Hybrid Web2 + Web3 Architecture**
How real production apps are built. Not pure dApps. Hybrid systems that use blockchain only for what it's good at.

**01  The hybrid architecture pattern**  [diagram]\
`     `Next.js backend + smart contract + IPFS + Supabase. Who handles what. Request flow end to end.

**02  Sign-In With Ethereum (SIWE)**  [real code]\
`     `Off-chain signing for gasless auth. JWT from wallet signature. How Privy implements this internally.

**03  Backend + blockchain trust model**  [mistake]\
`     `When to trust the backend. When to verify on-chain. Why frontend-only Web3 apps have security holes.

**04  Fallback RPCs and production resilience**  [real code]\
`     `Alchemy down scenario. QuickNode as fallback. Circuit breaker pattern. Rate limit handling.


### **M3.4 — ChainCure Architecture Deep Dive**
The most complete real-world blockchain system design case study in this curriculum. From problem to deployed system.

**01  The counterfeit drug problem — why blockchain?**\
`     `Why a database doesn't solve this. Why you need an immutable multi-party ledger. The trust boundary analysis.

**02  5-actor trust model design**  [diagram · real code]\
`     `Admin, Manufacturer, Distributor, Pharmacy, Public. Roles enforced on-chain. Permission boundaries.

**03  Drug lifecycle state machine**  [diagram]\
`     `Created → Transferred → Distributed → At Pharmacy → Verified. State transitions enforced in the contract.

**04  QR deep-link public verification**  [diagram · real code]\
`     `QR → URL → React page → contract read → verification result. Public trust without requiring a wallet.


# **T4  Modern Web3 UX & Account Abstraction  ★ SIGNATURE TRACK**
*How production Web3 apps actually onboard real users. No MetaMask required. No seed phrases. No gas friction. Built from shipping erc4337-kit, ZKredential, and ProofOfExistence.*

**4 modules · 16 lessons · Advanced · Prereq: T2 · ~9 hours**

**★ HERO PROJECT: Socio3 Evolution  —**  Takes the Socio3 Classic app from T2 and evolves it: MetaMask popups become Google login, manual network switching disappears, users pay zero gas, extension dependency is eliminated. Students experience the transformation firsthand.


### **M4.1 — Account Abstraction Foundations**
Why MetaMask UX fails real users. ERC-4337 from first principles. Smart accounts vs EOAs.

**01  Why MetaMask UX fails at consumer scale**  [mistake]\
`     `Extension dependency. Mobile impossibility. Seed phrase onboarding. Network switching friction. Conversion rate data.

**02  ERC-4337 — account abstraction without protocol change**  [diagram]\
`     `UserOperations. Alt mempool. EntryPoint contract. How ERC-4337 adds smart account capabilities to any EVM chain.

**03  Smart accounts vs EOAs**  [diagram]\
`     `EOA limitations: no custom logic, no batch txs, no gas sponsorship. Smart account capabilities. SimpleAccount from eth-infinitism.

**04  UserOperation anatomy**  [diagram]\
`     `sender, nonce, callData, callGasLimit, verificationGasLimit, paymasterAndData. What each field does and why.

**⚠ MISTAKE I MADE:**  Lost a hackathon because my ERC-4337 implementation was wrong. The UserOperation gas fields were incorrect. The paymasterAndData encoding was wrong. Spent 3 days debugging. Built erc4337-kit afterwards so others skip this pain.


### **M4.2 — Bundlers & Paymasters**
The infrastructure layer of account abstraction. Pimlico, bundler economics, gas sponsorship, verifying vs deposit paymasters.

**01  How bundlers work**  [diagram]\
`     `The alt mempool. UserOp validation rules. Bundler profitability model. Why Pimlico as a service.

**02  Verifying paymaster — sponsor specific users**  [real code]\
`     `Whitelist-based sponsorship. How to sign paymaster data off-chain. Security: replay protection in paymaster signatures.

**03  Deposit paymaster — prepaid gas**\
`     `Token-based gas payment. How Pimlico's ERC-20 paymaster works. When to use deposit vs verifying.

**04  Pimlico integration — end to end**  [real code · project]\
`     `Pimlico API, sponsorUserOperation, bundler endpoint. Full working gasless transaction from scratch.

**⚡ REALITY CHECK:**  Pimlico and similar services make ERC-4337 practical. Running your own bundler is an advanced infrastructure challenge. For most production apps, use a bundler service and focus on product — not bundler ops.


### **M4.3 — Embedded Wallets — Privy & Social Login**
Eliminate seed phrases. Google login to wallet. Embedded wallet UX. How Privy works under the hood.

**01  Why embedded wallets exist**\
`     `The seed phrase problem. Mobile Web3 UX. Social login as onboarding. The Privy + embedded wallet model.

**02  Privy setup and configuration**  [real code]\
`     `App ID, PrivyProvider, usePrivy hook. Login with Google flow. How Privy creates an embedded wallet silently.

**03  Combining Privy + Pimlico + ERC-4337**  [real code · diagram]\
`     `The full modern stack: Privy for auth, embedded wallet as signer, Permissionless.js for smart account, Pimlico for bundler.

**04  Debugging embedded wallet issues**  [real code · mistake]\
`     `Wallet detection race conditions. useRef guards for infinite re-renders. The ProofOfExistence debugging session — live case study.

**⚠ MISTAKE I MADE:**  Built an infinite re-render loop because I checked wallet state inside useEffect without proper dependency control. The wallet initializes asynchronously. Used useRef to guard against running wallet setup more than once. This took 6 hours to debug.


### **M4.4 — Production UX Patterns**
Session keys, mobile UX, error handling, transaction state management. How to build Web3 apps that feel like Web2.

**01  Session keys — persist actions without signing every time**\
`     `Time-limited smart account sessions. How Privy session keys work. The UX improvement over per-tx signing.

**02  Mobile Web3 UX**\
`     `WalletConnect for mobile. Deep links. App clips. Why mobile is harder and how to handle it.

**03  Error handling in production**\
`     `UserOperation reverts. Paymaster rejection. Bundler errors. Friendly error messages vs raw blockchain errors.

**04  erc4337-kit — the npm package**  [real code]\
`     `What the package does. How it was built. How to use it in any project. Lessons from publishing to npm.


# **T5  Zero Knowledge & Privacy Engineering  ★ SIGNATURE TRACK**
*Prove you know something without revealing what you know. zkSNARKs, Circom, Groth16, Poseidon — explained from first principles with a real deployed proof system behind every lesson.*

**3 modules · 12 lessons · Advanced · Prereq: T1 + T2 · ~8 hours**

**★ HERO PROJECT: ZK Credential Verifier  —**  Based on ZKredential — top-15 finalist at Velora 1.0 hackathon at MIT Academy of Engineering. Students build a complete privacy-preserving credential system: Circom circuits, Groth16 proofs, Poseidon hashing, ERC-5192 soulbound NFTs, deployed on Polygon Amoy.


### **M5.1 — ZK Foundations**
What zero-knowledge proofs actually are. Why privacy matters in identity systems. Proof systems explained visually without mathematics first.

**01  What zero-knowledge actually means**  [diagram]\
`     `The cave analogy. Completeness, soundness, zero-knowledge — the three properties. Why "I know a secret" can be proven without revealing it.

**02  Why privacy matters in on-chain identity**\
`     `Public blockchain + private credentials = problem. Why you can't store CGPA on-chain. The selective disclosure solution.

**03  Proof systems overview — SNARKs, STARKs, Groth16**  [diagram]\
`     `Different proof systems and their tradeoffs. Why we use Groth16 for credential verification. Trusted setup requirements.

**04  ZK in production — where it's actually used**\
`     `Zcash, Tornado Cash, Polygon zkEVM, zkSync. Real applications of zero-knowledge proofs today.


### **M5.2 — Circom & zkSNARKs**
Circuits. Constraints. Witness generation. Groth16. Poseidon hashing. The technical stack for building ZK systems.

**01  Circom language basics**  [real code]\
`     `Signals, components, constraints. How circuits are different from regular programs. Writing your first circuit.

**02  R1CS and constraint systems**  [diagram]\
`     `Rank-1 Constraint Systems. How Circom compiles to R1CS. What 904 constraints means in ZKredential.

**03  Poseidon hashing — why not SHA-256**  [mistake]\
`     `ZK-friendly hash functions. Why SHA-256 is expensive in circuits. Poseidon constraint count vs SHA-256.

**04  Witness generation and proof creation**  [real code]\
`     `Private inputs, public inputs, witness. snarkjs prove. What a Groth16 proof actually contains (~1KB).

**05  Trusted setup — Powers of Tau**\
`     `Why Groth16 needs a trusted setup. Powers of Tau ceremony. ptau files. What "toxic waste" means.

**06  Verifier.sol — auto-generated on-chain verifier**  [real code]\
`     `snarkjs export verifier. How the Solidity verifier works. Calling verifyProof() from your contract.

**⚠ MISTAKE I MADE:**  Used SHA-256 inside a Circom circuit in my first attempt. The constraint count exploded to tens of thousands. Proof generation took minutes. Switched to Poseidon. Constraint count dropped 10x. Proof time: seconds. Nobody tells you this until you waste 2 days.


### **M5.3 — Selective Disclosure & Credential Systems**
ZKredential complete walkthrough. Private inputs, public inputs, threshold proofs, soulbound NFT credentials.

**01  Designing a ZK credential circuit**  [real code · diagram]\
`     `Private: studentId, CGPA, degreeCode. Public: certificateHash, minimumCGPA. The circuit that proves CGPA >= threshold.

**02  ZKredential complete system architecture**  [diagram · real code]\
`     `Institution mints NFT → Student generates proof → Anyone verifies. Three-actor system. Data flow end to end.

**03  Soulbound credential NFT — ERC-721 + ERC-5192**  [real code]\
`     `Why credentials must be non-transferable. locked() function. CredentialRegistryNFT.sol walkthrough.

**04  Frontend — QR generation, proof submission, verification**  [real code · project]\
`     `Next.js frontend. MetaMask integration. Generate QR for sharing. Verify tab for employers. Mobile-friendly.

**⚡ REALITY CHECK:**  ZK credentials are the future of on-chain identity. Institutions like universities can issue verifiable credentials that students own and control, without exposing private data to public blockchains. ZKredential is a working proof of this concept — deployed and verified on Polygon Amoy.


# **T6  Security & Production Engineering**
*Real security for real systems. Replay protection, distributed trust, timelocks, secret sharing, rate limiting, fallback infrastructure. Not just reentrancy guards.*

**3 modules · 11 lessons · Expert · Prereq: T3 + T4 · ~7 hours**

**★ HERO PROJECT: ZeroLeak  —**  Exam paper leak prevention system: PDF encrypted in-browser with AES-256-GCM, encryption key split across 5 nodes using Shamir Secret Sharing, smart contract timelock enforces unlock timestamp. Zero-trust architecture — no single entity can access the paper before the exam.


### **M6.1 — Cryptographic Security Patterns**
Replay attacks, nonce systems, AES-256-GCM, Shamir Secret Sharing, timelocks. The advanced cryptographic toolkit.

**01  Replay attacks — signing the same message twice**  [mistake]\
`     `How replay attacks work on signed messages. Nonce-based protection. Domain separation. Why nonces are not optional.

**02  AES-256-GCM — symmetric encryption in-browser**  [real code]\
`     `Web Crypto API. Encrypt before upload. How ZeroLeak encrypts PDFs client-side before anything touches a server.

**03  Shamir Secret Sharing — distributed trust**  [diagram]\
`     `Split a secret into N shares, require K to reconstruct. How ZeroLeak splits encryption keys across 5 nodes. No single point of trust.

**04  Blockchain timelocks — time-enforced access control**  [real code · diagram]\
`     `Smart contract enforces unlock time. require(block.timestamp >= unlockTime). ZeroLeak's timelock contract.

**⚠ MISTAKE I MADE:**  Built a contract that accepted signed messages for authorization but forgot to include a nonce. The same signed message could be replayed indefinitely. Anyone could capture one valid signature and reuse it forever. Nonces are mandatory in any system that accepts off-chain signatures.


### **M6.2 — Application-Level Security**
Rate limiting, Sybil prevention, abuse prevention, WAF basics, API protection. ProxyShield architecture.

**01  Rate limiting — protecting on-chain and off-chain resources**  [real code]\
`     `Per-address rate limits in smart contracts. Off-chain API rate limiting. Token bucket algorithm. Sliding window.

**02  Sybil prevention — one identity per human**\
`     `Address farming. Proof of humanity. On-chain identity signals. Why wallet address ≠ unique human.

**03  ProxyShield — WAF + API gateway architecture**  [real code · diagram]\
`     `Reverse proxy. WAF rules. Honeypot traps. Real-time attack dashboard. Built for WITCHAR-26 hackathon.


### **M6.3 — Production Reliability Engineering**
Fallback RPCs, retry systems, monitoring, transaction failure handling. What happens when the infrastructure breaks.

**01  Fallback RPC architecture**  [real code]\
`     `Primary + secondary + tertiary RPC endpoints. Automatic failover. Circuit breaker pattern. Alchemy + QuickNode combination.

**02  Transaction monitoring and retry systems**\
`     `Watching for transaction confirmation. Timeout handling. Gas price escalation on retry. What to show users during waiting.

**03  Smart contract upgrade patterns**\
`     `Proxy patterns. UUPS. Transparent proxy. When upgradability is a feature and when it's a centralization risk.

**04  Production deployment checklist**  [real code]\
`     `Security audit. Test coverage. Gas report. Polygonscan verification. Frontend ABI sync. Monitoring setup.


# **T7  Real-World Blockchain Systems**
*Why blockchain should exist in a system — not why blockchain is cool. Fake drugs. Exam leaks. Civil material fraud. Academic credential privacy. Real problems solved with real systems.*

**3 modules · 10 lessons · Expert · Prereq: T5 + T6 · ~6 hours**

**★ HERO PROJECT: ChainCure + CiviChain  —**  Two fully deployed production-grade systems. ChainCure: pharmaceutical anti-counterfeiting with 5-actor supply chain, QR public verification, IPFS lab reports. CiviChain: decentralized governance for civil material authentication. Both on Polygon Amoy with verified contracts.


### **M7.1 — Problem-First System Design**
How to identify when blockchain is the right tool. Mapping real problems to blockchain properties.

**01  Problem → solution mapping framework**  [diagram]\
`     `Is there a trust problem between untrusted parties? Does immutability add value? Does decentralization matter here? The decision tree.

**02  ChainCure — pharmaceutical problem deep dive**  [diagram]\
`     `Counterfeit drug market. Supply chain opacity. Why blockchain + role-based access + public verification solves this.

**03  ZKredential — credential fraud problem**  [diagram]\
`     `Academic credential fraud. Why public blockchains can't store private data. Why ZK proofs are the only correct answer.

**04  ZeroLeak — institutional trust problem**  [diagram]\
`     `Exam paper leaks. Insider threats. Why mathematical cryptography eliminates human trust from the equation.


### **M7.2 — Cryptographic Trust Architecture**
Timelocks, Shamir Secret Sharing, distributed trust, audit trails. Building systems where no human can cheat.

**01  Zero-trust architecture from first principles**  [diagram]\
`     `Assume every participant is malicious. Design systems where honesty is enforced by math, not policy.

**02  Audit trails — immutable history on-chain**  [real code]\
`     `Event-based audit trail. Who did what and when. Why blockchain audit trails are more credible than database logs.

**03  Multi-party computation without trusting any party**  [diagram]\
`     `Combining SSS + timelocks + on-chain enforcement. How ZeroLeak achieves zero-trust exam distribution.


### **M7.3 — Production Case Studies & Hard Truths**
Where blockchain should NOT be used. Failed architectures. Scalability tradeoffs. Cost analysis.

**01  Failed blockchain projects — what went wrong**  [mistake]\
`     `Real projects that used blockchain incorrectly. Common patterns of blockchain overengineering.

**02  Scalability tradeoffs in production**\
`     `Gas costs at scale. Transaction throughput limits. L2 migration decisions. When to move off-chain.

**03  The future of Web3 UX**\
`     `Web2-level UX + Web3 ownership. Account abstraction as the bridge. Where the ecosystem is heading.


# **06  COMPLETE "MISTAKES I MADE" CATALOGUE**


This is the master list of every mistake category covered across all tracks. Each one maps to a specific lesson where it appears as an integrated callout — not a separate section, but woven into the lesson that teaches the solution.

## **M1 — Blockchain & Network Confusions**
**⚠ MISTAKE I MADE:**  Thought testnet = mainnet with fake money. They have completely different RPCs, chain IDs, contract addresses, block explorers, and sometimes different behavior. Confused them for 3 weeks.

**⚠ MISTAKE I MADE:**  Thought MetaMask was the blockchain. Asked "is MetaMask down?" when a transaction failed. MetaMask is just a key manager. The blockchain runs independently.

**⚠ MISTAKE I MADE:**  Suggested blockchain for a school attendance system. A Google Sheet would have worked better, cost nothing, and been faster.

## **M2 — Smart Contract Architecture**
**⚠ MISTAKE I MADE:**  Stored full voter names, proposal descriptions, and debate text directly on-chain in a voting contract. Gas costs were enormous. Some transactions failed randomly at the block gas limit. THIS is the most important mistake on the platform — it teaches that blockchain is not a general-purpose database.

**⚠ MISTAKE I MADE:**  Used tx.origin instead of msg.sender for authorization. Anyone could have phished my contract. The distinction matters enormously.

**⚠ MISTAKE I MADE:**  Forgot to add a nonce to a contract that accepted signed messages. The same signature could be replayed indefinitely.

## **M3 — Frontend & Library Hell**
**⚠ MISTAKE I MADE:**  Followed a YouTube tutorial using ethers.js v5. Spent 4 hours debugging. getDefaultProvider is gone. Contract constructor changed. Signer API changed. Always check the version.

**⚠ MISTAKE I MADE:**  ABI in the frontend was from an earlier compiled version. Contract was redeployed with new functions but old ABI was still cached. Always sync the ABI after recompile.

**⚠ MISTAKE I MADE:**  Called eth\_getLogs for the last 50,000 blocks on every page load. Public RPC rate-limited the app within hours. Use an indexer.

## **M4 — ZK & Cryptography**
**⚠ MISTAKE I MADE:**  Used SHA-256 inside a Circom circuit. Constraint count exploded. Proof generation took minutes. Switched to Poseidon. Constraint count dropped 10x. Proof time: seconds.

**⚠ MISTAKE I MADE:**  Lost a hackathon because ERC-4337 UserOperation gas fields were wrong and paymasterAndData encoding was incorrect. Built erc4337-kit to solve this permanently.

## **M5 — Architecture & UX**
**⚠ MISTAKE I MADE:**  Built an infinite re-render loop in the Privy + ERC-4337 integration. Wallet initializes asynchronously. Used useRef to guard setup from running more than once. Took 6 hours.

**⚠ MISTAKE I MADE:**  Assumed MetaMask UX was acceptable for a consumer demo. Every non-technical person in the room was confused by the MetaMask popup. Modern apps need embedded wallets.


# **07  DIAGRAM PROMPT LIBRARY**


Use these exact prompts to generate SVG diagrams with consistent visual language across all tracks. Generate using any AI image/SVG tool. Substitute [bracketed] values per lesson.

## **Prompt 1 — Transaction Lifecycle Diagram**
SVG diagram, #09090b background, 900x400px.

Show 6 stages left to right: Signed → Broadcast → Mempool → Validator Picks → In Block → Finalized

Each stage: rounded rect rx=8, fill #111113, border 1px rgba(255,255,255,0.12).

Stage label: Geist Mono, 11px, #a1a1aa, uppercase, centered.

Active stage (highlight "Mempool"): border 1px #7c3aed, slight glow filter.

Connecting arrows: thin 1px line rgba(255,255,255,0.18), filled arrowhead 6px.

No shadows. No gradients. Clean dark engineering style.

## **Prompt 2 — Actor System Diagram**
SVG diagram, #09090b background, 900x500px.

Show [N] actors as vertical stacked boxes on left side.

Actor box: fill #111113, border-left 3px solid [track color], rx=6, padding 12px.

Actor name: Geist, 13px, bold, #fafafa.

Actor role: Geist Mono, 10px, #71717a, below name.

Arrows between actors: curved, 1px, rgba(255,255,255,0.15), labeled.

Arrow labels: 10px, Geist Mono, #52525b.

Right side: blockchain column, dark purple border, labeled "Polygon Amoy".

## **Prompt 3 — ZK Proof Flow Diagram**
SVG diagram, #09090b background, 900x450px.

Three columns: Private Inputs | Circuit | Public Output

Private inputs (left): red-tinted boxes fill #1a0a0a, border rgba(239,68,68,0.2).

Circuit (center): large dark box fill #111113, border 2px solid #ec4899.

Label "Circom Circuit" in Geist, 14px, bold, #f9a8d4.

Public output (right): green-tinted box fill #0a1a0a, border rgba(34,197,94,0.2).

Arrows flow left to right through circuit. Private inputs have lock icon.

Output: "Proof: Valid/Invalid" in #86efac.

Below circuit: "904 Groth16 constraints" in Geist Mono, 10px, #52525b.

## **Prompt 4 — Smart Contract Storage Diagram**
SVG diagram, #09090b background, 700x400px.

Show EVM storage slots as a vertical grid.

Each slot: 32-byte wide rect, fill #18181b, border 1px rgba(255,255,255,0.07).

Slot number: Geist Mono, 10px, #52525b, left side.

Slot value: Geist Mono, 12px, #a1a1aa, content area.

Packed slots highlighted with #f59e0b border to show packing.

Label: "slot 0", "slot 1" etc. Show bytes32 values in hex.


# **08  IMPLEMENTATION GUIDE**


## **Tech Stack**

**Frontend Framework**

Next.js 15 (App Router)

Content: MDX files + Contentlayer (lessons as markdown with frontmatter)

Styling: Tailwind CSS v4 + @tailwindcss/typography

Components: shadcn/ui + Radix UI primitives

Syntax highlighting: Shiki (github-dark theme)

Animations: Framer Motion (minimal, intentional)

Fonts: Geist + Geist Mono (Vercel)

Icons: Lucide React

**SEO & Content**

next-seo for meta tags

JSON-LD Course schema (rich snippets in Google)

Auto-generated sitemap.xml

MDX frontmatter → SEO metadata per lesson

**Web3 Stack**

Solidity + Hardhat + OpenZeppelin

ethers.js v6 + viem + wagmi

Privy (embedded wallets)

Pimlico + Permissionless.js (ERC-4337)

The Graph (event indexing)

IPFS + Pinata (storage)

Polygon Amoy (testnet) + Polygon Mainnet (production)

**Phase 2 (user accounts, progress)**

Supabase: user progress tracking, bookmarks

NOT for lesson content — lessons are MDX files

## **Content Folder Structure**
/content

`  `/track-0

`    `/module-1

`      `01-trust-problem.mdx

`      `02-what-is-a-block.mdx

`  `/track-1

`    `/module-1

`      `01-solidity-types.mdx

/app

`  `/learn

`    `/[track]

`      `/[module]

`        `/[slug]

`          `page.tsx

## **URL Structure**
learn.atharvabaodhankar.me/learn/track-0/module-1/trust-problem

learn.atharvabaodhankar.me/learn/track-5/module-2/circom-basics

learn.atharvabaodhankar.me/mistakes

learn.atharvabaodhankar.me/roadmap

## **MDX Frontmatter Per Lesson**
\---

title: "Why gas exists and how it is calculated"

track: 0

module: 3

lesson: 2

difficulty: beginner

tags: [gas, EVM, transactions]

has\_diagram: true

has\_mistake: true

has\_project: false

real\_project: ZKredential

estimated\_time: 12

\---

## **Launch Sequence**

1. Week 1–2: Ship landing page + curriculum roadmap page
1. Week 3–4: Write Track 0 complete (4 modules, 14 lessons)
1. Week 5: Ship "Mistakes I Made" standalone page (goes viral potential)
1. Week 6: Write Track 4, Module 1 (ERC-4337 — low competition SEO)
1. Week 8: Write Track 5, Module 2 (Circom — very low competition SEO)
1. Week 10: Submit sitemap, apply for Privy/Alchemy/Pimlico sponsorship
1. Month 4: Add Supabase progress tracking
1. Month 6: Launch starter kit products

## **SEO Target Keywords by Track**

**High priority (low competition, high intent):**

- circom tutorial beginner
- ERC-4337 tutorial Privy Pimlico
- soulbound NFT ERC-5192 guide
- Web3 mistakes beginners make
- Poseidon hash vs SHA-256 ZK circuits
- account abstraction gasless transaction React

**Medium priority (winnable in 3–6 months):**

- account abstraction explained simply
- ethers.js v6 migration guide
- IPFS Pinata React upload tutorial
- wagmi wallet connection Next.js

**Long-term (12–18 months):**

- blockchain roadmap 2025
- learn Web3 development
- solidity tutorial production


**learn.atharvabaodhankar.me**

*Curriculum Bible v1.0 · Built from real confusion. Shipped projects. Zero hype.*
