# Projects

### WhatNext
**Local-first, peer-to-peer music sessions: shared queues your friends can join, stored as plain Markdown**  
[View Docs](https://whtnxt.madigan.app/)  -  [View Code](https://github.com/mads-jm/WhatNext)  
November 2025 - Ongoing  
Stack: TypeScript | Electron | React | RxDB | LibP2P | WebRTC | Spotify API  

- Built a local-first Electron desktop app with a Coordinator Model — one user connects to Spotify, imports playlists, and opens a P2P session that friends join with zero OAuth friction
- Implemented real-time P2P networking with libp2p featuring mDNS discovery, Noise encryption, Yamux multiplexing, and RxDB replication over custom protocols
- Engineered remote connectivity via circuit relay server and DCUtR for NAT traversal, enabling sessions across networks
- Developed collaborative session features including co-host model, playback mutex, turn-taking, reactions, and presence indicators
- Designed an import adapter architecture abstracting streaming services into a canonical format, with Spotify as the first adapter
- Built a companion client enabling phone/browser session viewing alongside the desktop app
- Stored all user data as plain-text Markdown with YAML frontmatter, so it stays portable and fully owned by the user

### Pour
**Terminal-Native Capture Tool with Mobile PWA Companion**  
[View Docs](https://pour.madigan.app/)  -  [View Code](https://github.com/mads-jm/pour)  
March 2026 - Ongoing (v1.0.0 shipped May 2026)  
Stack: Rust | ratatui | crossterm | axum | tokio | rust-embed | Service Worker | IndexedDB | TOML  

- Built a frictionless, instant-booting TUI in Rust for structured data capture into any Markdown folder, with first-class Obsidian vault support
- Engineered a hybrid transport layer with API-first writes via Obsidian Local REST API and automatic filesystem fallback so capture never blocks
- Designed a fully config-driven module system — modules, fields, paths, templates, and conditional `show_when` visibility all declared in TOML with no hardcoded behavior
- Implemented vault-sourced dynamic dropdowns with a 3-tier fallback chain (API → disk scan → cache → freetext) that renders instantly from cache while refreshing in the background
- Shipped a contract-first mobile PWA companion (`pour serve`) — embedded in the binary via `rust-embed`, served over LAN with QR-code pairing, constant-time token auth, and per-module opt-out
- Built an offline-first capture path on the PWA — IndexedDB queue with idempotency keys, service worker app-shell cache, FIFO drain on reconnect, and synthetic-202 wire shape negotiated as a ratified contract amendment
- Designed a sub-form overlay system that captures structured frontmatter for novel `dynamic_select` values inline (e.g. logging a coffee with a bean that doesn't exist yet), preserving the keyboard-first capture flow
- Engineered a layered preset system — per-module presets with hierarchical drilldown picker (`method × bean × intent`), per-field presets for repeatable composite arrays like brew recipes, and atomic JSON persistence
- Sealed the v1.0.0 foundation across decomposition, lock-in, and hardening — collapsed 8 god-modules behind a focused module tree, 18 ad-hoc atomic-write blocks behind a single transactional `Config::edit()`, and 3 hand-rolled JSON stores behind a generic `JsonStore<T>` with migration hooks
- Hardened the write path for the freeze — rejected `..` traversal across all fs entry points, locked Windows atomicity to `MoveFileExW`, char-indexed the textarea cursor for emoji and CJK, escaped strftime tokens in user templates, and surfaced previously-swallowed persistence failures via a status-bar toast
- Locked the `pub` surface and enforced an 800-LOC file-size CI ratchet at v1.0.0 — 891 passing tests across config, transport, server, PWA contract surface, and TUI rendering, with `cargo clippy -D warnings`, `cargo fmt --check`, and `cargo doc -D warnings` all green

### seed
**Local-First TUI Wellness Companion with a Generative Mandala**  
[View Docs](https://seed.madigan.app/)  -  [View Code](https://github.com/mads-jm/seed)  
April 2026 - Ongoing  
Stack: Rust | tokio | ratatui | crossterm | interprocess | notify-rust | chrono  

- Built an event-sourced workspace in Rust (3 crates) — a pure domain core with no I/O, a writer daemon that owns mutable state, and a TUI client that mirrors state via length-prefixed JSON over local sockets
- Designed an append-only event log with periodic snapshots — daemon replays events past the snapshot's skip count on boot, persisting every 100 events or 5 minutes
- Implemented cross-platform IPC via `interprocess` (Unix abstract socket / Windows named pipe) with per-connection mpsc routing and broadcast fan-out for state diffs
- Engineered single-instance daemon lifecycle: socket-probe locking with stale-socket recovery, graceful Ctrl-C drain that flushes a final snapshot before exit
- Built a generative mandala renderer combining braille (core), block/half-block (petals), and box-drawing (spokes) — per-cell truecolor with 256-color quantization fallback, locked by a byte-compared golden snapshot
- Designed a versioned wire schema where unknown event kinds round-trip via `Event::Unknown` so forward-compatible tooling never silently loses data
- Modeled an OSRS-style 1-99 XP curve across nine wellness traits with SEED → ZENITH prestige tiers, driving mandala evolution from sparse seed to full bloom

### git-identity
**Cross-Platform Git Identity Manager with TUI and CLI**  
[View Code](https://github.com/mads-jm/git-identity)  
February 2026 - Ongoing  
Stack: Rust | ratatui | crossterm | clap | serde | YAML  

- Built a standalone TUI and CLI tool for managing multiple GitHub accounts with directory-based switching and SSH aliases
- Implemented non-destructive config generation using a managed-block pattern that preserves user content in ~/.gitconfig and ~/.ssh/config
- Designed a layered architecture separating pure business logic (core) from I/O, UI, and a consent-gated permissions system
- Built an interactive TUI with ratatui featuring account management, health validation, and clone URL conversion screens
- Engineered cross-platform support (Windows, macOS, Linux) with atomic file writes, backup creation, and dry-run mode
- Created an interactive setup wizard for zero-friction onboarding of new machines

### Digest
**Local-First AI Email Summarizer**  
[View Docs](https://digest.madigan.app/)  -  [View Code](https://github.com/mads-jm/digest)  
March 2026 - Ongoing  
Stack: TypeScript | Electron | React | Python | FastAPI | SQLite | aiosqlite  

- Forked EmailEssence's proven backend into a local-first Electron desktop app — no cloud deployment, no remote database
- Built a FastAPI sidecar spawned as a subprocess by Electron, communicating via localhost HTTP with typed IPC bridging all renderer-to-backend calls
- Replaced MongoDB with SQLite (aiosqlite) for fully local data storage
- Implemented Electron-native OAuth 2.0 with tokens secured in OS keychain via safeStorage — no JWT in localStorage, no token storage in the database
- Designed a pluggable AI summarization provider system supporting local inference (Ollama, llama.cpp, LM Studio) alongside cloud providers (OpenAI, Gemini, OpenRouter)
- Packaged with electron-builder bundling the Python backend via PyInstaller so end users need no separate Python install

### EmailEssence
**Email Productivity Tool — Capstone Project**  
[View App](https://email.madigan.app/)  -  [View Code](https://github.com/EmailEssence/EmailEssence.github.io)  
October 2024 - June 2025  
Stack: JavaScript | Python | OpenRouter API  

- Architected a modular backend with clear separation between routers, services, and providers, following SOLID principles
- Built IMAP email service with parsing and reader view capabilities
- Implemented Google OAuth with token validation endpoints
- Designed abstract AI summarization service supporting multiple providers
- Established CI/CD pipelines and Docker configurations
- Created API testing fixtures for code quality assurance

### ReverbXR
**Web-based 3D/XR Audio Visualizer**  
[View App](https://reverb-xr.madigan.app/)  -  [View Code](https://github.com/mads-jm/reverb-xr)  
April 2024 - June 2024  
Stack: HTML | JavaScript | Web Audio API  

- Developed a web application for real-time audio processing and 3D visualization using Web Audio API and A-Frame
- Designed and implemented a modular architecture for managing audio processor states
- Handled microphone input and audio file processing
