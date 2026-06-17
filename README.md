# RoadToChain — Curriculum Roadmap

> **Modern Web3 engineering education. We learn by breaking things, not reading definitions.**

---

## 🗺️ The Learning Roadmap

Below is the structured path designed to take you from foundational concepts to production-grade system engineering and zero-knowledge cryptography:

| Track | Name | Estimated Time | Key Focus Areas |
| :--- | :--- | :--- | :--- |
| **00** | **Blockchain Foundations** | 8 Hours | RPC nodes, cryptographic keys, gas mechanics, and address derivation. |
| **01** | **Solidity Systems** | 12 Hours | Smart contract state variables, EVM storage layouts, and incremental tally optimizations. |
| **02** | **Full-Stack Web3** | 15 Hours | Frontends, Graph API subgraphs, IPFS gateways, and Redis-caching pipelines. |
| **03** | **Advanced Smart Contracts** | 20 Hours | Multi-sig patterns, gas optimization patterns, and upgrades. |
| **04** | **UX & Account Abstraction** | 18 Hours | ERC-4337 entry points, UserOperations, custom signers, and Privy. |
| **05** | **Zero-Knowledge Proofs** | 25 Hours | Circom circuit compilation, Poseidon hashing, and on-chain verifiers. |
| **06** | **Web3 Cryptography & Auth** | 16 Hours | Off-chain signatures, replay attacks, EIP-712 typed data, and nonces. |
| **07** | **System Audits & Autopsies** | 14 Hours | Architectural post-mortems of hacks, reentrancies, and front-running. |

---

## 💻 Running Locally

### 1. Install Dependencies
```bash
npm install
```
*(Peer dependency conflicts are automatically bypassed using the local `.npmrc` configuration).*

### 2. Configure Environment Variables
Copy the template and fill in your keys (Firebase configuration and API endpoints):
```bash
cp .env.local.example .env.local
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the learning portal.

---

## 🤝 Contributions Welcome!

RoadToChain is built for the community, by the community. Contributions of all sizes are welcome!

*   **Bug Fixes & Security**: Open a PR if you spot issues in the smart contract examples or simulator components.
*   **Typos & Explanations**: Notice a typo or a concept that could be explained more clearly? PRs for text updates are highly appreciated.
*   **Feature Ideas**: Have a suggestion for a new lesson, simulator, or learning track? Open an Issue to discuss it!

To contribute, fork the repository, make your changes on a new branch, and submit a Pull Request. Thank you for helping build the future of Web3 education!
