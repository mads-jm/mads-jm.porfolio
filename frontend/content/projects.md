# Projects

### EmailEssence
**Email Productivity Tool**  
[View App](https://email.madigan.app/)   -   [View Code](https://github.com/EmailEssence/EmailEssence.github.io)  
October 2024 - Ongoing  
Stack: JavaScript | Python | OpenRouter API  
```
- Architected a modular backend with clear separation between routers, services, and providers, following SOLID principles
- Built IMAP email service with parsing and reader view capabilities
- Implemented Google OAuth with token validation endpoints
- Designed abstract AI summarization service supporting multiple providers
- Established CI/CD pipelines and Docker configurations
- Created API testing fixtures for code quality assurance
```

### ReverbXR
**Web-based 3D/XR Audio Visualizer**  
[View App](https://reverb-xr.madigan.app/)   -   [View Code](https://github.com/mads-jm/reverb-xr)  
April 2024 - June 2024  
Stack: HTML | JavaScript | Web Audio API  
```
- Developed a web application for real-time audio processing and 3D visualization using Web Audio API and A-Frame
- Designed and implemented a modular architecture for managing audio processor states
- Handled microphone input and audio file processing
```

### WhatNext
**Sovereign Music Management Platform**  
[View App](https://whatnext.madigan.app/)   -   [View Code](https://github.com/mads-jm/WhatNext)  
November 2025 - Ongoing  
Stack: TypeScript | Electron | React | RxDB | libp2p | Spotify API  
```
- Architecting a local-first, peer-to-peer music management platform built on user sovereignty principles
- Building decentralized P2P collaboration via libp2p with mDNS discovery, Noise encryption, and WebRTC transport
- Implementing local-first data storage using RxDB with plaintext Markdown/YAML for full user data ownership
- Building Electron desktop app with React, Zustand, and Vite for a reactive cross-platform experience
- Integrating Spotify as a progressive enhancement for metadata enrichment and playback control
- Designing circuit relay infrastructure for NAT traversal and persistent peer connectivity
```

### Pour
**Terminal-Native Obsidian Capture Tool**  
[View App](https://pour.madigan.app/)   -   [View Code](https://github.com/mads-jm/pour)  
March 2026 - Ongoing  
Stack: Rust | ratatui | crossterm | Obsidian Local REST API | TOML  
```
- Building a frictionless, instant-booting TUI in Rust for structured data capture directly into Obsidian vaults
- Implementing hybrid transport layer with API-first writes via Obsidian Local REST API and filesystem fallback
- Designing config-driven module system — fields, paths, and templates all defined in TOML, no hardcoded modules
- Building vault-sourced dynamic dropdowns with 3-tier fallback: API query → disk scan → cache → freetext
- Outputting strict Markdown with YAML frontmatter for portable, plaintext-forever data compatible with Dataview
- Supporting dual write modes: create (new file with frontmatter) and append (under header in daily note)
```
