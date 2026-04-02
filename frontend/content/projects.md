# Projects

### WhatNext
**A resilient, user-centric music management platform for musical permanence and deep collaboration**  
November 2025 - Ongoing  
Stack: TypeScript | Electron | React | RxDB | LibP2P | WebRTC | Spotify API  

- Built a local-first Electron desktop app with a Coordinator Model — one user connects to Spotify, imports playlists, and opens a P2P session that friends join with zero OAuth friction
- Implemented real-time P2P networking with libp2p featuring mDNS discovery, Noise encryption, Yamux multiplexing, and RxDB replication over custom protocols
- Engineered remote connectivity via circuit relay server and DCUtR for NAT traversal, enabling sessions across networks
- Developed collaborative session features including co-host model, playback mutex, turn-taking, reactions, and presence indicators
- Designed an import adapter architecture abstracting streaming services into a canonical format, with Spotify as the first adapter
- Built a companion client enabling phone/browser session viewing alongside the desktop app
- Storing all user data in plaintext Structured Markdown with YAML frontmatter for full data sovereignty and interoperability

### Pour
**Terminal-Native Obsidian Capture Tool**  
[View Docs](https://pour.madigan.app/)   -   [View Code](https://github.com/mads-jm/pour)  
March 2026 - Ongoing  
Stack: Rust | ratatui | crossterm | Obsidian Local REST API | TOML  

- Building a frictionless, instant-booting TUI in Rust for structured data capture directly into Obsidian vaults
- Implementing hybrid transport layer with API-first writes via Obsidian Local REST API and filesystem fallback
- Designing config-driven module system — fields, paths, and templates all defined in TOML, no hardcoded modules
- Building vault-sourced dynamic dropdowns with 3-tier fallback: API query → disk scan → cache → freetext
- Outputting strict Markdown with YAML frontmatter for portable, plaintext-forever data compatible with Dataview
- Supporting dual write modes: create (new file with frontmatter) and append (under header in daily note)

### git-identity
**Cross-Platform Git Identity Manager with TUI and CLI**  
[View Documentation](https://github.com/mads-jm/git-identity)   -   [View Code](https://github.com/mads-jm/git-identity)  
March 2026 - Ongoing  
Stack: Rust | ratatui | crossterm | clap | serde | YAML  

- Built a standalone TUI and CLI tool for managing multiple GitHub accounts with directory-based switching and SSH aliases
- Implemented non-destructive config generation using a managed-block pattern that preserves user content in ~/.gitconfig and ~/.ssh/config
- Designed a layered architecture separating pure business logic (core) from I/O, UI, and a consent-gated permissions system
- Built an interactive TUI with ratatui featuring account management, health validation, and clone URL conversion screens
- Engineered cross-platform support (Windows, macOS, Linux) with atomic file writes, backup creation, and dry-run mode
- Created an interactive setup wizard for zero-friction onboarding of new machines

### EmailEssence
**Email Productivity Tool**  
[View App](https://email.madigan.app/)   -   [View Code](https://github.com/EmailEssence/EmailEssence.github.io)  
October 2024 - Ongoing  
Stack: JavaScript | Python | OpenRouter API  

- Architected a modular backend with clear separation between routers, services, and providers, following SOLID principles
- Built IMAP email service with parsing and reader view capabilities
- Implemented Google OAuth with token validation endpoints
- Designed abstract AI summarization service supporting multiple providers
- Established CI/CD pipelines and Docker configurations
- Created API testing fixtures for code quality assurance

### ReverbXR
**Web-based 3D/XR Audio Visualizer**  
[View App](https://reverb-xr.madigan.app/)   -   [View Code](https://github.com/mads-jm/reverb-xr)  
April 2024 - June 2024  
Stack: HTML | JavaScript | Web Audio API  

- Developed a web application for real-time audio processing and 3D visualization using Web Audio API and A-Frame
- Designed and implemented a modular architecture for managing audio processor states
- Handled microphone input and audio file processing
