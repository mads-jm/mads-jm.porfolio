# Writing Garden — working doc

> Persistent task tracker for the writing/garden initiative. Update as we go so we can
> pause and resume cleanly. Newest decisions at top of each section.

## North star
Obsidian-backed **digital garden** integrated into the portfolio. Metric is *"did I write,"*
not reach. **Architect toward the `dev.madigan.app` platform, build the garden first.**

- **Today:** portfolio is live at `portfolio.madigan.app`. Phase 1 writing ships at
  `portfolio.madigan.app/writing` (route in this repo — no subdomain yet).
- **Author flow:** write in main Obsidian vault → flag `publish: true` → filtered export
  script copies only flagged notes into `content/writing/` → commit → Vercel deploy.
  Mobile capture via Obsidian Git plugin. **Never put the whole vault in this public repo.**
- **Content model:** one pool, three lenses — stream (`/writing`), topics
  (`/writing/topics/[tag]`), project devlogs (`/writing/projects/[project]`).
- **Aesthetic:** rides the existing global `[clean] ⇄ [tui]` mode toggle. tui = terminal feel,
  clean = prose reading surface.

## Frontmatter schema (standardize now — expensive to change later)
```yaml
---
title: My note title
date: 2026-05-30        # required, ISO
updated: 2026-05-31     # optional
type: post              # post | devlog | note
project: whatnext       # optional, only for devlogs
tags: [audio, rust]     # optional
summary: One-line blurb for cards/SEO   # optional
publish: true           # only true notes are exported & built
---
```

## Phase 1 — build the garden (CODE COMPLETE, awaiting real content)
- [x] Interview + decisions captured (see memory + this doc)
- [x] Working doc created
- [x] `lib/writing.ts` — content layer (list/get/tags/projects/backlinks)
- [x] `lib/obsidian-markdown.ts` — wikilink/embed preprocessing + slugify
- [x] `lib/useSiteMode.ts` — shared mode hook (extracted from index.tsx logic)
- [x] Writing markdown renderer (react-markdown + remark-gfm + callouts + wikilinks)
- [x] `components/writing/*` — WritingLayout, WritingMarkdown, PostList
- [x] Pages: `/writing`, `/writing/[slug]`, `/writing/topics/[tag]`, `/writing/projects/[project]`
- [x] `styles/writing.css` + `writing.module.css` — reading prose (tui + clean variants)
- [x] Seed posts (post / devlog / note) so it renders without the vault
- [x] `scripts/sync-writing.mjs` — filtered export from Obsidian vault
- [x] Add nav entry to the portfolio (writing link in TopBar)
- [x] `next build` green — 14 static pages, verified rendering (wikilinks/backlinks/callouts/tables)
- [ ] **TODO: run `bun install` locally** — remark-gfm was added via npm in the sandbox;
      bun.lock not updated. Sync the bun lockfile before committing.
- [ ] Point sync at the real vault: `OBSIDIAN_VAULT=/path bun run sync:writing`
      (note: a real sync wipes content/writing and replaces it with vault notes — the seed
      files will be removed unless they also live in the vault.)
- [ ] Write 10–15 real notes

## How it works (quick reference)
- Write in Obsidian → add `publish: true` to frontmatter.
- `bun run sync:writing` (with `OBSIDIAN_VAULT` set) exports flagged notes into
  `frontend/content/writing/` and copies image attachments to `public/writing-assets/`.
- Filenames are slugified and used as URL slugs; wikilinks resolve by slugified title,
  so keeping Obsidian filenames == titles makes `[[links]]` and backlinks just work.
- `git commit` → Vercel deploys. Live at `/writing`.
- Three lenses: `/writing` (stream), `/writing/topics/[tag]`, `/writing/projects/[project]`.

## Deferred (do NOT build yet)
- v2 reader/tui presentation toggle *per article* (raw `cat` view vs prose). Global mode
  toggle already covers the baseline.
- Backlinks graph / proper wikilink resolution against a note index (v1 slugifies targets).
- Phase 2 platform: promote to `dev.madigan.app` hub. Recommendation when we get there:
  single Next app + subdomain middleware, NOT a monorepo, until 2 surfaces have different
  release cadences. Clean module boundary now makes this cheap.
- RSS / newsletter / SEO machinery (not a priority — metric is writing, not reach).

## Open questions / TODO notes
- Obsidian vault path: sync script reads `OBSIDIAN_VAULT` env var. Set it locally before
  running `bun run sync:writing`. (Joseph uses subvaults for project docs.)
- Attachment handling: script copies embedded images to `public/writing-assets/`.
  Existing remote image host is `f9y2nv7uff.ufs.sh` (uploadthing) if we prefer hosted.

## Decisions log
- 2026-05-30: chose markdown-in-git over CMS — Obsidian vault IS the CMS. Ownership-first.
- 2026-05-30: garden (not blog); three lenses; ride existing mode toggle for hybrid look.
- 2026-05-30: ship at `/writing` route first; defer subdomain/platform split to Phase 2.
