#!/usr/bin/env node
// Filtered export from an Obsidian vault into content/writing/.
// Copies ONLY notes with `publish: true` in frontmatter — never the whole vault.
// Also copies referenced image attachments into public/writing-assets/.
//
// Usage:
//   OBSIDIAN_VAULT=/path/to/vault bun run sync:writing
//   OBSIDIAN_VAULT=/path/to/vault bun run sync:writing -- --dry-run
//
// Filenames are kept as-is (slugified) so wikilinks-by-title resolve. Keep this
// slugify in sync with lib/obsidian-markdown.ts.

import { readdir, readFile, writeFile, mkdir, rm, stat } from "node:fs/promises"
import { join, basename, extname, dirname } from "node:path"

const VAULT = process.env.OBSIDIAN_VAULT
const DRY_RUN = process.argv.includes("--dry-run")
const CONTENT_DIR = join(process.cwd(), "content", "writing")
const ASSET_DIR = join(process.cwd(), "public", "writing-assets")

const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp|avif)$/i

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// Minimal frontmatter reader — just enough to check `publish` and the title.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return { data: {}, body: raw }
  const data = {}
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (kv) data[kv[1]] = kv[2].trim()
  }
  return { data, body: raw }
}

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

async function main() {
  if (!VAULT) {
    console.error("✗ Set OBSIDIAN_VAULT to your vault path. Example:")
    console.error("    OBSIDIAN_VAULT=~/vault bun run sync:writing")
    process.exit(1)
  }
  if (!(await exists(VAULT))) {
    console.error(`✗ Vault not found: ${VAULT}`)
    process.exit(1)
  }

  const allFiles = await walk(VAULT)
  const mdFiles = allFiles.filter((f) => f.endsWith(".md"))
  const attachments = new Map() // basename -> full path
  for (const f of allFiles) {
    if (IMAGE_EXT.test(f)) attachments.set(basename(f), f)
  }

  const published = []
  const skipped = []
  for (const file of mdFiles) {
    const raw = await readFile(file, "utf8")
    const { data } = parseFrontmatter(raw)
    if (String(data.publish) !== "true") {
      skipped.push(file)
      continue
    }
    published.push({ file, raw })
  }

  console.log(`Found ${mdFiles.length} notes — ${published.length} flagged publish:true, ${skipped.length} skipped.`)

  if (DRY_RUN) {
    console.log("\n[dry-run] Would publish:")
    for (const { file } of published) console.log("  +", basename(file))
    return
  }

  // Fresh export: clear destination so unpublished/renamed notes don't linger.
  await rm(CONTENT_DIR, { recursive: true, force: true })
  await mkdir(CONTENT_DIR, { recursive: true })
  await mkdir(ASSET_DIR, { recursive: true })

  const usedAssets = new Set()
  for (const { file, raw } of published) {
    const slug = slugify(basename(file))
    await writeFile(join(CONTENT_DIR, `${slug}.md`), raw, "utf8")
    console.log("  +", `${slug}.md`)

    // Collect embedded attachments: ![[name.png]] or ![](name.png)
    for (const m of raw.matchAll(/!\[\[([^\]|]+)\]\]/g)) {
      if (IMAGE_EXT.test(m[1])) usedAssets.add(m[1].trim())
    }
  }

  let copied = 0
  let missing = 0
  for (const name of usedAssets) {
    const src = attachments.get(basename(name))
    if (!src) { console.warn("  ! missing attachment:", name); missing++; continue }
    const dest = join(ASSET_DIR, basename(name))
    await mkdir(dirname(dest), { recursive: true })
    await writeFile(dest, await readFile(src))
    copied++
  }

  console.log(`\n✓ Published ${published.length} notes, copied ${copied} attachments` +
    (missing ? `, ${missing} missing.` : "."))
  console.log("  Review with `git status`, then commit to deploy.")
}

main().catch((err) => { console.error(err); process.exit(1) })
