---
name: RoadToChain
description: Modern Web3 engineering education design system — "The Adversarial Lab"
colors:
  primary: "#7c3aed"
  primary-dark: "#a78bfa"
  neutral-bg: "#0f0f12"
  neutral-bg2: "#141419"
  neutral-bg3: "#1e1e24"
  neutral-bg4: "#272730"
  neutral-border: "#272730"
  neutral-border2: "#3f3f46"
  neutral-text: "#ededed"
  neutral-muted: "#a1a1aa"
  neutral-dim: "#52525b"
  track-0: "#a78bfa"
  track-1: "#60a5fa"
  track-2: "#2dd4bf"
  track-3: "#4ade80"
  track-4: "#fbbf24"
  track-5: "#f472b6"
  track-6: "#fb923c"
  track-7: "#22d3ee"
typography:
  display:
    fontFamily: "var(--font-serif), Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "0.875rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  card-container:
    backgroundColor: "{colors.neutral-bg2}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.xl}"
    padding: "1.25rem 1.5rem"
  code-block:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "1rem"
---

# Design System: RoadToChain

## Overview

**Creative North Star: "The Adversarial Lab"**

RoadToChain's interface is designed as an interactive Web3 autopsy lab and engineering workstation. Grounded in a dark, high-contrast visual environment (`#0f0f12`), the system pairs high-density technical readouts with precise monospace telemetry and energetic track-specific color accents. Rather than presenting static prose or generic UI cards, the interface functions like a tactile workbench where state changes, storage slot allocations, and byte manipulation trigger immediate visual physics and glowing indicator updates.

The core aesthetic balances authoritative documentation with mechanical interactivity. Dark zinc backgrounds (`#141419`, `#1e1e24`) provide visual stability, while precise violet accents (`#7c3aed`, `#a78bfa`) command focal attention for critical interactions. Eight distinct neon track hues delineate specialized learning domains (from Ethereum foundations to Zero-Knowledge cryptography), giving each module a memorable visual anchor without polluting the global workspace.

**Key Characteristics:**
- High-contrast dark mode foundation (`#0f0f12` canvas with layered zinc surfaces).
- Dual typography hierarchy pairing classic serif display headers with hyper-legible system body text and dense monospace telemetry.
- 8 domain-specific spectrum accents mapped 1:1 to curriculum learning tracks (Tracks 00–07).
- Interactive, theme-aware visual diagrams with SVG flow pulses, packet movement animations, and line-level code inspectors.
- Flat structural surfaces with state-triggered border glows and zero unnecessary drop shadows.

## Colors

The color system is built around a dark zinc palette punctuated by an electric violet primary accent and an eight-color domain spectrum.

### Primary
- **Electric Violet** (`#7c3aed` / `#a78bfa` in dark theme): Used for primary actions, active navigation states, interactive diagram triggers, and core focal indicators.

### Track Spectrum (Domain Accents)
- **Track 00 — Foundations Violet** (`#a78bfa`): RPC nodes, keys, gas mechanics.
- **Track 01 — Solidity Blue** (`#60a5fa`): Smart contract state & EVM storage layouts.
- **Track 02 — Full-Stack Teal** (`#2dd4bf`): Frontends, subgraphs, IPFS gateways.
- **Track 03 — Advanced Green** (`#4ade80`): Multi-sig patterns & gas optimization.
- **Track 04 — Abstraction Gold** (`#fbbf24`): ERC-4337 entry points & UserOps.
- **Track 05 — ZK Pink** (`#f472b6`): Circom circuits & Poseidon hashing.
- **Track 06 — Crypto Orange** (`#fb923c`): EIP-712 signatures & off-chain auth.
- **Track 07 — Audits Cyan** (`#22d3ee`): Reentrancy post-mortems & security autopsies.

### Neutral
- **Deep Obsidian Canvas** (`#0f0f12`): Base application background in dark mode.
- **Layered Surface Containers**: `#141419` (Card level 1), `#1e1e24` (Card level 2), `#272730` (Interactive control background).
- **Subtle Zinc Borders**: `#272730` (Base border), `#3f3f46` (Hover/elevated border), `#52525b` (Active stroke).
- **High-Contrast Text Scale**: `#ededed` (Primary text), `#a1a1aa` (Secondary text), `#52525b` (Dim labels & gutters).

### Named Rules
**The Rarity of Primary Accent Rule.** The primary violet accent (`#7c3aed` / `#a78bfa`) is reserved strictly for primary actions, active navigation tabs, and system state highlights. It must cover ≤10% of any viewport surface to preserve its focal intensity.

**The Domain Track Color Rule.** Track spectrum colors are strictly contextual. A track color (e.g. Track 05 ZK Pink `#f472b6`) may only be applied to elements belonging to that specific track module, badge, or progress indicator.

## Typography

**Display Font:** `var(--font-serif)`, Georgia, serif  
**Body Font:** `system-ui, -apple-system, sans-serif`  
**Label / Monospace Font:** `ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace`  

**Character:** A high-contrast editorial and technical pairing. Warm serif display headers evoke textbook authority, modern system body font guarantees rapid scannability, and crisp monospace text powers byte data, code snippets, and telemetry labels.

### Hierarchy
- **Display** (Weight: 600, Size: `clamp(2rem, 5vw, 3.5rem)`, Line-Height: 1.1, Letter-Spacing: `-0.03em`): Hero headlines and major track titles.
- **Headline** (Weight: 600, Size: `1.75rem`, Line-Height: 1.25, Letter-Spacing: `-0.02em`): Section headings and module titles.
- **Title** (Weight: 600, Size: `1.25rem`, Line-Height: 1.4, Letter-Spacing: `-0.01em`): Subsections, card headers, and diagram titles.
- **Body** (Weight: 400, Size: `14.5px`, Line-Height: 1.6): Core lesson prose and description text. Max line length: 65–75ch.
- **Label** (Weight: 500, Size: `0.72rem`, Letter-Spacing: `0.05em`, Monospace): Code line numbers, status badges, telemetry stats, and interactive control labels.

### Named Rules
**The Code Integrity Rule.** All inline code (`code`), technical parameters, hex addresses, RPC payloads, and line numbers must strictly use the monospace font stack with dedicated background pill styling.

## Layout

- **Grid & Alignment**: Standardized 12-column responsive grid with max content container width of 1280px (`max-w-7xl`).
- **Sidebar & Lesson Viewport**: Fixed 280px left navigation sidebar for curriculum tracks with flexible central reading column (`max-w-4xl` prose container) and optional right-hand table of contents (`w-64`).
- **Spacing Rhythm**: 8px spatial grid (`xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`).
- **Density**: Compact, high-information density tailored for developer documentation and interactive labs.

## Elevation & Depth

RoadToChain utilizes a flat, surface-layered depth model rather than heavy material shadows. Depth is communicated through background tonal contrast (`#0f0f12` → `#141419` → `#1e1e24`) combined with subtle 1px border definitions (`#272730`).

### Shadow Vocabulary
- **Subtle Surface Glow** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): Applied to resting code viewports and cards.
- **Active Focus Glow** (`box-shadow: 0 0 0 1px rgba(167,139,250,0.4), 0 8px 32px rgba(0,0,0,0.5)`): Applied to active interactive controls, search inputs, and code viewer hover states.

### Named Rules
**The Tonal Depth Rule.** Surfaces rest completely flat on the canvas. Visual depth must be established via zinc background tone step-ups (`var(--bg)` → `var(--bg2)` → `var(--bg3)`) and 1px border contrast rather than drop shadows.

## Shapes

- **Form Language**: Clean geometry with subtly rounded corners that preserve a precise, technical feel.
- **Corner Scale**:
  - `sm` (`4px` / `0.25rem`): Inline code pills, small buttons, status indicators.
  - `md` (`8px` / `0.5rem`): Standard buttons, input fields, navigation pills.
  - `lg` (`12px` / `0.75rem`): Code viewports (`.lcb-root`), diagram containers, callout boxes.
  - `xl` (`14px` / `0.875rem`): Interactive cards (`.lpe-root`), lesson modal containers.
  - `full` (`9999px`): Status badge dots, pill buttons, category tags.
- **Borders**: Crisp 1px solid borders (`var(--border)`, `var(--border2)`) outline all container boundaries.

## Components

### Primary Button
- **Shape:** Rounded-md (`8px`)
- **Primary:** Background `#7c3aed`, Text `#ffffff`, Padding `0.5rem 1.25rem` (`8px 20px`), Font-weight `500`.
- **Hover / Focus:** Background `#6d28d9` (light) / `#c084fc` (dark) with subtle glow `box-shadow: 0 12px 32px color-mix(in srgb, var(--accent) 40%, transparent)`.

### Code Viewport (`.lcb-root`)
- **Shape:** Rounded-lg (`12px` / `0.75rem`), 1px solid border (`rgba(255,255,255,0.08)` in dark mode).
- **Titlebar:** Background `var(--code-header-bg)`, text filename in monospace `0.72rem`, theme-aware copy button with status indicator.
- **Gutter & Lines:** Line numbers in vertical gutter with `1px solid var(--border)`, syntax tokens highlighted via Shiki dual-theme tokens.

### Interactive Diagram Container
- **Shape:** Rounded-xl (`14px`), dark background `#18181b` with 1px border `#3f3f46`.
- **Interactivity:** Animated SVG flow pulses (`diagram-flow-pulse`), step-by-step cascade reveals, and interactive state triggers.

### Lesson Status Badges
- **Shape:** Full pill (`9999px`), 1px border with `10%` accent background fill.
- **Typography:** Monospace `0.6rem`, uppercase, letter-spacing `0.05em`.

## Do's and Don't's

### Do:
- **Do** use strict dark-mode zinc surfaces (`#0f0f12`, `#141419`) for high-contrast reading.
- **Do** pair serif display headers with monospace technical telemetry for clear typographical hierarchy.
- **Do** map track colors (Tracks 00–07) consistently to their respective curriculum domains.
- **Do** keep interactive diagram controls keyboard-accessible and clearly delineated with 1px zinc borders.

### Don't:
- **Don't** use heavy material drop shadows or blurred backdrop filters that obscure high-density code text.
- **Don't** apply primary electric violet accent (`#7c3aed`) to passive background elements or bulk body text.
- **Don't** mix track colors arbitrarily; respect the 1:1 domain color mapping across the application.
- **Don't** override monospace line heights in code blocks below `1.6`.
