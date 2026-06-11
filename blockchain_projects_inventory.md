# Atharva's Blockchain Projects Inventory
*Generated on June 14, 2026 by Antigravity IDE*

## Summary
- **Total blockchain repositories found**: 16
- **Production deployed**: 0 (all deployable to testnets/devnets)
- **Hackathon winners / Advanced Projects**: 4
- **Active / Maintained projects**: 8

---

## Projects Breakdown by Category

## 1. Hackathon Winners & Advanced Projects

### ZeroLeak
**Repository**: [https://github.com/atharvabaodhankar/ZeroLeak](https://github.com/atharvabaodhankar/ZeroLeak)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/ZeroLeak/main/README.md)  
**Status**: Development / Sepolia Testnet  
**Network**: Ethereum Sepolia  
**Framework**: Hardhat  
**Language**: Solidity / JavaScript  
**Created**: 2026-01-01  
**Last Update**: 2026-04-09

#### Description
ZeroLeak is a military-grade, zero-trust decentralized exam paper distribution system. Powered by Ethereum smart contract timelocks, Shamir’s Secret Sharing (SSS), and client-side encryption to eliminate insider threats and prevent exam paper leaks.

#### Key Features
- **Zero-Knowledge Architecture**: Authority manages exam schedules and paper distribution without seeing raw data.
- **Shamir's Secret Sharing (SSS)**: Distributes cryptographic keys across independent nodes, eliminating single-point-of-failure key storage.
- **Blockchain Timelocks**: Smart contract state-enforces unlocking times immutably on-chain.
- **Memory Isolation**: Automatically purges cryptographic keys from client-side local RAM post-upload.

#### Architecture
The system prevents leaks by ensuring question papers remain unreadable until exactly the exam starts. Question papers are encrypted client-side using symmetric keys. The decryption keys are split into shards using SSS. These shards are encrypted for individual centers and stored decentralized. To reconstruct the key, a center must wait for the contract timelock to expire, download the threshold number of shares, and combine them.

#### Deployments
- **Contract Address**: Deployed on Sepolia Testnet (addresses managed dynamically in hardhat configuration)
- **Network**: testnet (Sepolia)
- **Live Demo**: N/A

#### Competition/Recognition
Advanced zero-trust exam distribution mechanism designed to address high-stakes real-world leakage problems.

#### Technical Stack
- **Smart Contracts**: Solidity 0.8.x, Hardhat
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Browser-Native Crypto polyfills for secure key generation (no Node.js dependency in browser)
- **Database / Storage**: IPFS (Pinata gateway) for decentralized encrypted blob storage
- **Testing**: Hardhat tests

#### Current Status
Maintained / Complete

---

### ChainNotesV2
**Repository**: [https://github.com/atharvabaodhankar/ChainNotesV2](https://github.com/atharvabaodhankar/ChainNotesV2)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/ChainNotesV2/main/README.md)  
**Status**: Testnet  
**Network**: Polygon Amoy  
**Framework**: Hardhat / Permissionless.js  
**Language**: Solidity / JavaScript / TypeScript  
**Created**: 2026-05-29  
**Last Update**: 2026-06-03

#### Description
A secure, gasless, decentralized Web3 note-taking app featuring OAuth social logins, account abstraction, and 100% sponsored transactions on Polygon Amoy.

#### Key Features
- **OAuth Social Logins & Signer Sync**: Powered by Privy, allowing instant logins via Google, Email, or Web3 wallets.
- **Account Abstraction & 1-Click Keyset Generation**: SimpleSmartAccount v0.6 deterministic contracts automatically bind to the user's social identity.
- **100% Gasless Transaction Sponsorship**: Every note creation and upload transaction is sponsored gaslessly via Pimlico's Paymaster engine.
- **Vercel Serverless Security Proxy**: Hides master Pinata IPFS credentials by proxying uploads through Vercel serverless functions.
- **Limit-Free View Call Queries**: Note retrievals bypass restrictive public RPC block limits by using standard static state calls with sender overrides.
- **Premium HSL Glassmorphism UI**: High-fidelity dark mode workspace built with Tailwind CSS v4.

#### Architecture
Integrates Privy for social login and smart wallet embedding. Deploys an ERC-4337 SimpleSmartAccount for the user. Note metadata and body are signed by the smart account, sent as UserOperations to a Pimlico bundler, sponsored by a Pimlico paymaster, and recorded on the Polygon Amoy blockchain. Note details are pinned to IPFS via Pinata.

#### Deployments
- **Contract Address**: `0x1Daaa7e5FCaBdEf7e7299109bcF71E676Dd2C297`
- **Network**: testnet (Polygon Amoy)
- **Live Demo**: N/A

#### Competition/Recognition
Showcases modern UX patterns in Web3 (social login + gasless AA).

#### Technical Stack
- **Smart Contracts**: Solidity, `Notes.sol`
- **Frontend**: React v19, Vite, Tailwind CSS v4
- **Backend**: Vercel Serverless Node.js endpoints (`/api/pinFile` and `/api/pinJSON`)
- **Database / Storage**: IPFS (Pinata)
- **Testing**: Hardhat tests

#### Current Status
Active Development

---

### Zkredential
**Repository**: [https://github.com/atharvabaodhankar/Zkredential](https://github.com/atharvabaodhankar/Zkredential)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/Zkredential/main/README.md)  
**Status**: Testnet  
**Network**: Polygon Amoy  
**Framework**: Hardhat / Circom  
**Language**: Solidity / Circom / JavaScript  
**Created**: 2026-04-11  
**Last Update**: 2026-04-12

#### Description
Zkredential is a zero-knowledge credential verification system utilizing Groth16 zkSNARKs, Poseidon hashing, and Soulbound ERC-5192 NFTs to issue and verify credentials without exposing private identity data.

#### Key Features
- **Zero-Knowledge Proofs**: Groth16 zkSNARKs for fast verification, Poseidon hashing, and selective disclosure.
- **Soulbound NFTs (ERC-5192)**: Non-transferable credentials bound to the user's wallet address permanently.
- **QR Code Integration**: Generates QR codes for credentials allowing instant, mobile-friendly URL scans for verifiers.
- **Privacy Guarantees**: Private data never leaves the student's device; only the certificate cryptographic hash is stored on-chain.

#### Architecture
Students generate credentials locally. The credential hash is generated using a ZK-friendly Poseidon hash. The issuer signs this hash and issues a Soulbound NFT. When verifying, the student generates a Groth16 proof using snarkjs and Circom circuits, demonstrating they hold a valid certificate with specific properties (e.g., GPA threshold) without revealing the actual values.

#### Deployments
- **Contract Address**:
  - `Verifier.sol`: `0x11688F2cB72403Afe18b98Fb11103fCC2a3A9A3e`
  - `ZkredentialNFT.sol`: `0xC75798D7e9d1366bE7E5EC7dc8c402d71dC57001`
  - `Poseidon.sol`: `0x2cb799d38bfb786df012d44fa8c30d073c493ef0`
- **Network**: testnet (Polygon Amoy)
- **Live Demo**: N/A

#### Competition/Recognition
Advanced application of ZK cryptography and Soulbound tokens for identity/academic verification.

#### Technical Stack
- **Smart Contracts**: Solidity 0.8.24, ERC-721 + ERC-5192 (Soulbound), Hardhat
- **Zero-Knowledge Circuits**: Circom 2.0.0, SnarkJS (Groth16), Poseidon
- **Frontend**: Next.js (React), ethers.js v6, qrcode/qr-scanner
- **Backend**: Next.js API Routes

#### Current Status
Maintained

---

### Socio3
**Repository**: [https://github.com/atharvabaodhankar/Socio3](https://github.com/atharvabaodhankar/Socio3)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/Socio3/main/README.md)  
**Status**: Testnet / Local  
**Network**: Ethereum Sepolia  
**Framework**: Hardhat / The Graph  
**Language**: Solidity / JavaScript  
**Created**: 2025-10-18  
**Last Update**: 2026-06-08

#### Description
A decentralized social media platform built on Ethereum and IPFS with wallet-based authentication, Privy account abstraction, on-chain moderation, and custom indexing subgraphs.

#### Key Features
- **On-Chain Moderation**: Content is managed securely through a voting/flagging mechanism built into smart contracts.
- **Decentralized Publishing**: Posts are uploaded directly to IPFS, ensuring censorship-resistant distribution.
- **Social Tipping**: Integrates account abstraction-based tipping for users.
- **Decentralized Indexing**: Employs The Graph protocol to query and index social feed data smoothly.

#### Architecture
The contracts handle profile creation, posts, comments, and flagging. Front-end interactions communicate with the blockchain and IPFS. An indexing subgraph captures events from the smart contracts and provides a fast GraphQL API to load user profiles, posts, and feeds.

#### Deployments
- **Contract Address**:
  - EntryPoint: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
  - SocialRegistry: `0x5d5C1d313f580027204e04E8D4E3162f37A661CF`
  - Subgraph Endpoint: Indexed via local/hosted Graph Node
- **Network**: testnet (Sepolia)
- **Live Demo**: N/A

#### Competition/Recognition
A complete social media dApp stack integrating front-end, smart contracts, backend server, Privy, and subgraph query layers.

#### Technical Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, Privy SDK, Ethers.js
- **Backend / Indexing**: Node.js, Express, Firebase, The Graph (subgraph)
- **Database / Storage**: IPFS, Firestore

#### Current Status
Maintained

---

## 2. Infrastructure

### erc4337-kit
**Repository**: [https://github.com/atharvabaodhankar/erc4337-kit](https://github.com/atharvabaodhankar/erc4337-kit)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/erc4337-kit/main/README.md)  
**Status**: Stable Library  
**Network**: Polygon / Sepolia / Arbitrum / Base  
**Framework**: React Hooks Library  
**Language**: TypeScript / JavaScript  
**Created**: 2026-03-24  
**Last Update**: 2026-05-31

#### Description
An advanced React hooks library for ERC-4337 Account Abstraction. It provides developers with gasless transactions, social logins, and smart accounts without configuration complexity.

#### Key Features
- **Plug-and-play Hook Interfaces**: Exposes simple React hooks (`useSmartAccount`, `useGaslessSend`) to integrate Account Abstraction.
- **Integrated Social Login Providers**: Seamless hooks for Privy, Web3Auth, and deterministic smart account bindings.
- **Multi-Bundler Support**: Supports Pimlico, Biconomy, and custom bundler JSON-RPC endpoints.
- **Paymaster Rules Config**: Built-in methods to easily request sponsored gas transactions from paymasters.

#### Architecture
A developer-focused React wrapper library built on top of `viem`, `wagmi`, `permissionless`, and Privy. It abstracts the instantiation of Bundlers, Paymasters, and UserOperations, allowing React developers to trigger on-chain operations with standard hooks and state.

#### Deployments
- **Contract Address**: Canonical EntryPoint `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` / standard ERC-4337 factories.
- **Network**: Multi-chain support
- **Live Demo**: N/A

#### Competition/Recognition
Infrastructure library aimed at simplifying Web3 UX hurdles for developers.

#### Technical Stack
- **Languages**: TypeScript, JavaScript
- **Web3 Libraries**: viem, wagmi, @privy-io/react-auth, permissionless, react-query
- **Environment**: NPM package structure

#### Current Status
Maintained / Active

---

### create-aa-dapp
**Repository**: [https://github.com/atharvabaodhankar/create-aa-dapp](https://github.com/atharvabaodhankar/create-aa-dapp)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/create-aa-dapp/main/README.md)  
**Status**: Development Tool  
**Network**: N/A  
**Framework**: Node CLI  
**Language**: JavaScript  
**Created**: 2026-01-31  
**Last Update**: 2026-01-31

#### Description
A command-line starter tool to initialize an ERC-4337 Account Abstraction dApp workspace instantly.

#### Key Features
- **Scaffolding CLI**: Interactive prompt to set up smart contract and front-end layouts.
- **Pre-configured Stack**: Bundles Hardhat, React/Vite, Privy, and Pimlico clients out of the box.

#### Technical Stack
- **Tooling**: Node.js, CLI scripts

#### Current Status
Archived / Proof of Concept

---

## 3. Experimental Projects

### GassLess-Notes-DApp
**Repository**: [https://github.com/atharvabaodhankar/GassLess-Notes-DApp](https://github.com/atharvabaodhankar/GassLess-Notes-DApp)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/GassLess-Notes-DApp/main/README.md)  
**Status**: Experimental / Sepolia Testnet  
**Network**: Ethereum Sepolia  
**Framework**: Hardhat  
**Language**: Solidity / JavaScript  
**Created**: 2026-01-11  
**Last Update**: 2026-01-17

#### Description
An experimental notes application powered by ERC-4337 Account Abstraction on Ethereum Sepolia, sponsoring transactions on-chain.

#### Key Features
- **Account Abstraction Standard**: Implements smart accounts using custom factories and entry points.
- **Paymaster Funding**: Deployed paymaster contract with sponsored ETH to pay for transactions.
- **Social/Web2 Auth**: Integrates Firebase SDK for front-end authentication.

#### Architecture
The client logs in via Firebase. A request to the Node.js backend registers or fetches a smart wallet. When creating a note, a UserOperation is signed and executed via the deployed Paymaster, writing note hashes directly to the `NotesRegistry`.

#### Deployments
- **Contract Address**:
  - EntryPoint: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
  - AccountFactory: `0x34E676A2307ad597547d5dABFA466264dBb739C6`
  - NotesRegistry: `0x14f3dfddab66f0E2C14d46415bc635b3a363EeDf`
  - Paymaster: `0x9D18bDD3E47990e4da201936A1433dB8eB53DA3b`
- **Network**: testnet (Sepolia)
- **Live Demo**: N/A

#### Technical Stack
- **Smart Contracts**: Solidity 0.8.19, Hardhat, Ethers.js v5
- **Frontend**: React 18, Vite, Tailwind CSS, Firebase SDK
- **Backend**: Node.js, Express, Firebase Admin SDK

#### Current Status
Maintained / Complete

---

### ChainElect
**Repository**: [https://github.com/atharvabaodhankar/ChainElect](https://github.com/atharvabaodhankar/ChainElect)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/ChainElect/main/README.md)  
**Status**: Experimental  
**Network**: Ethereum (Local/Sepolia)  
**Framework**: Hardhat  
**Language**: Solidity / JavaScript  
**Created**: 2024-11-07  
**Last Update**: 2026-01-10

#### Description
Secure and transparent e-voting system using Ethereum smart contracts for casting votes, with a database backend for candidate details.

#### Key Features
- **Secure Ballots**: Casts cryptographically signed votes directly to smart contracts.
- **Web3 Interaction**: Integrates MetaMask wallet for voter validation.
- **Database Backup**: Uses Supabase for candidate media assets and information profiles.

#### Technical Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React.js, Vite, Web3.js
- **Backend**: Node.js, Express, Supabase Auth & Database

#### Current Status
Maintained

---

### ProofChain
**Repository**: [https://github.com/atharvabaodhankar/ProofChain](https://github.com/atharvabaodhankar/ProofChain)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/ProofChain/main/README.md)  
**Status**: Experimental  
**Network**: Ethereum Sepolia  
**Framework**: Hardhat  
**Language**: Solidity / JavaScript  
**Created**: 2025-12-29  
**Last Update**: 2026-03-23

#### Description
Decentralized proof of existence system. Users hash documents client-side and commit the hash to Sepolia, creating immutable, timestamped proofs.

#### Key Features
- **On-chain Event Logs**: Gas-efficient hash storage utilizing Ethereum event emission logs.
- **Duplicate Prevention**: Contract prevents duplicate commits of the same file hash.
- **Auth Sync**: Integrates Firebase Authentication to track user dashboard entries.

#### Technical Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React 18, Vite, Tailwind CSS, Firebase, Framer Motion
- **Backend**: Node.js, Express, Ethers.js

#### Current Status
Maintained

---

## 4. Learning & Educational Projects

### ChainNotes
**Repository**: [https://github.com/atharvabaodhankar/ChainNotes](https://github.com/atharvabaodhankar/ChainNotes)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/ChainNotes/main/README.md)  
**Status**: Development  
**Network**: Ethereum Sepolia  
**Language**: Solidity / JavaScript  
**Created**: 2025-08-23  
**Last Update**: 2025-11-15

#### Description
A decentralized, encrypted note-taking application. Features client-side AES-256 encryption before sending note hashes to IPFS and Ethereum Sepolia.

#### Key Features
- **Client-side Encryption**: Notes are encrypted locally using CryptoJS before upload.
- **Contract Address**: `0xc95BC91D0e0Bcb13F288d2341a289D9b0c281b03`

#### Technical Stack
- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Frontend**: React 18, Vite, Tailwind CSS, Ethers.js v6
- **Storage**: IPFS, Pinata SDK

#### Current Status
Archived (precursor to ChainNotesV2)

---

### D-Vault
**Repository**: [https://github.com/atharvabaodhankar/D-Vault](https://github.com/atharvabaodhankar/D-Vault)  
**README**: [Raw README URL](https://raw.githubusercontent.com/atharvabaodhankar/D-Vault/main/README.md)  
**Status**: Learning  
**Language**: JavaScript / HTML  
**Created**: 2025-07-13  
**Last Update**: 2025-07-15

#### Description
A simple React-based decentralized vault to upload files directly to IPFS using Pinata API keys.

#### Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS
- **Storage**: Pinata IPFS API

#### Current Status
Archived

---

### ChainCure
**Repository**: [https://github.com/atharvabaodhankar/ChainCure](https://github.com/atharvabaodhankar/ChainCure)  
**README**: N/A (Parsed from `SYSTEM_DESIGN.md`)  
**Status**: Development  
**Network**: Local / Sepolia  
**Framework**: Hardhat  
**Language**: Solidity / JavaScript  
**Created**: 2026-03-18  
**Last Update**: 2026-03-18

#### Description
Supply chain pharmaceutical tracker designed to log drug manufacturing batches, intermediate distribution checkpoints, and end-customer verifications.

#### Technical Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React, Tailwind CSS

#### Current Status
Development / Inactive

---

### Other Educational/PoC Repositories
- **IPFS-example**: Simple React integration showing uploads to local IPFS daemon.
- **ChainTask**: A task manager storing todo state on-chain (Polygon Amoy / Local).
- **ChainLock**: Simple lock box smart contract showing timelock releases.
- **ContractCanvas**: Visual tool attempting to represent smart contract logic on a canvas board.
