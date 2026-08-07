# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP, Three.js, Lucide Icons, Shiki / Rehype Pretty Code, Upstash Redis, Firebase.

## Users

Web2/Web3 software engineers, developers, and computer science students learning system-level Web3 engineering, smart contract security, and zero-knowledge cryptography. They require deep, non-abstract mechanical clarity on how blockchain systems work under the hood.

## Product Purpose

RoadToChain is an interactive Web3 engineering curriculum portal designed to transition developers from high-level abstractions to low-level mastery. Its purpose is to deliver rigorous, intuitive, and hands-on Web3 education through interactive mental models and visual simulators. Success is when a developer understands EVM storage, RPC calls, gas mechanics, account abstraction, and ZK circuits by interacting with and breaking systems rather than reading passive definitions.

## Positioning

"We learn by breaking things, not reading definitions." Unlike conventional documentation or text-heavy tutorials, RoadToChain positions itself as an interactive engineering playground and autopsy lab where every concept (RPC nodes, keys, gas, contract storage, ZK circuits) is coupled with real-time visual simulators, state inspectors, and vulnerability post-mortems.

## Operating Context

Self-paced technical education, developer onboarding, interactive browser-based labs, smart contract security audits, and visual step-by-step walkthroughs of complex Web3 mechanisms (EVM storage layouts, EIP-712 typed signatures, UserOperations, Circom verifiers).

## Capabilities and Constraints

- 8 structured learning tracks (Tracks 00-07) covering Foundations, Solidity Systems, Full-Stack Web3, Advanced Contracts, Account Abstraction, ZK Proofs, Off-Chain Signatures, and System Audits.
- MDX-driven curriculum rendered with Shiki syntax highlighting and interactive React/Three.js/Framer Motion simulation components.
- State persistence and caching via Upstash Redis and Firebase.
- Technical constraint: Keep interactive components fluid and responsive, ensuring micro-simulations and visual models execute without UI lag or layout shifts.

## Brand Commitments

- Name: RoadToChain
- Tagline: "Modern Web3 engineering education. We learn by breaking things, not reading definitions."
- Tone & Voice: Authoritative, pragmatic, precise, adversarial yet encouraging, highly visual, technical without fluff.
- Aesthetic direction: Sleek high-contrast dark theme, crisp monospace typography for code/data payloads, vibrant neon accents for state changes, rich interactive diagrams.

## Evidence on Hand

- `README.md`: Curriculum roadmap, installation guide, contribution guidelines.
- `web3_curriculum_bible.md`: Comprehensive curriculum specifications, lesson breakdowns, track objectives.
- `blockchain_projects_inventory.md`: Project inventory and architectural details.
- Interactive diagram components in `components/diagrams/` (e.g., `WalletRealityCheck.tsx`).
- MDX content modules under `content/track-*/`.

## Product Principles

1. **Break Before You Build**: Expose underlying mechanics by letting users trigger failures, state corruptions, and vulnerability autopsies.
2. **Visual & Mechanical Clarity**: Every abstract Web3 concept (gas, storage slots, signatures, UserOps) must have a visual, step-by-step representation.
3. **No Decorative Fluff**: Every diagram, simulator, and code snippet serves a specific learning outcome with real-world technical precision.
4. **Zero Magic**: Show raw byte payloads, memory layouts, RPC JSON requests/responses, and exact state transformations.

## Accessibility & Inclusion

- Keyboard-accessible interactive controls and simulators.
- High-contrast dark theme meeting WCAG AA standards for readable code blocks, diagrams, and text labels.
- Responsive layout supporting desktop and tablet screen sizes for intensive reading and simulator interaction.
