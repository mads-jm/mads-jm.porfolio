// Utilities for turning Obsidian-flavored markdown into something react-markdown can render.
//
// We deliberately preprocess the raw string (rather than add a fragile remark-plugin
// dependency chain) for the two Obsidian-isms react-markdown can't handle natively:
//   - wikilinks:  [[target]] and [[target|alias]]  ->  standard markdown links
//   - embeds:     ![[image.png]]                    ->  standard markdown images
// Callouts ( > [!note] ) are handled at render time by a custom blockquote component.

const WRITING_ASSET_PREFIX = "/writing-assets"

// Turn a note title / wikilink target into a URL-safe slug.
// "My First Post" -> "my-first-post". Keep in sync with the sync script's filenames.
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^\w\s-]/g, "") // drop punctuation
    .replace(/[\s_]+/g, "-") // spaces/underscores -> hyphen
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp|avif)$/i

// Resolve an embedded attachment reference to a public URL.
// Bare filenames map into /writing-assets (where the sync script drops attachments).
function resolveAsset(target: string): string {
  const t = target.trim()
  if (/^https?:\/\//i.test(t) || t.startsWith("/")) return t
  return `${WRITING_ASSET_PREFIX}/${t}`
}

// Convert Obsidian wikilinks and embeds into standard markdown.
export function transformObsidianMarkdown(raw: string): string {
  let out = raw

  // Embeds: ![[file]] or ![[file|alt]]
  out = out.replace(/!\[\[([^\]]+)\]\]/g, (_m, inner: string) => {
    const [target, alias] = inner.split("|").map((s) => s.trim())
    if (IMAGE_EXT.test(target)) {
      return `![${alias || target}](${resolveAsset(target)})`
    }
    // Non-image embed (transclusion) — degrade to a link; full transclusion is a later feature.
    return `[${alias || target}](/writing/${slugify(target)})`
  })

  // Links: [[target]] or [[target|alias]] (supports heading refs target#heading)
  out = out.replace(/\[\[([^\]]+)\]\]/g, (_m, inner: string) => {
    const [rawTarget, alias] = inner.split("|").map((s) => s.trim())
    const [target] = rawTarget.split("#").map((s) => s.trim())
    const label = alias || rawTarget.replace("#", " § ")
    return `[${label}](/writing/${slugify(target)})`
  })

  return out
}

// Extract outgoing wikilink targets (slugs) from raw markdown — used to build backlinks.
export function extractWikilinkSlugs(raw: string): string[] {
  const slugs = new Set<string>()
  const re = /(?<!!)\[\[([^\]]+)\]\]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    const target = m[1].split("|")[0].split("#")[0].trim()
    if (target) slugs.add(slugify(target))
  }
  return [...slugs]
}
