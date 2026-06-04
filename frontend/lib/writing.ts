// Content layer for the writing garden.
// Source of truth: markdown files in content/writing/ (exported from Obsidian).
// One content pool, surfaced through three lenses: stream, topics, project devlogs.

import { readFile, readdir } from "fs/promises"
import { join } from "path"
import matter from "gray-matter"
import { extractWikilinkSlugs, slugify } from "./obsidian-markdown"

export type PostType = "post" | "devlog" | "note"

export interface PostMeta {
  slug: string
  title: string
  date: string // ISO
  updated: string | null
  type: PostType
  project: string | null
  tags: string[]
  summary: string | null
}

export interface Post extends PostMeta {
  content: string // raw markdown body (Obsidian-flavored)
  outgoing: string[] // slugs this note links to
}

export interface Backlink {
  slug: string
  title: string
}

const WRITING_DIR = join(process.cwd(), "content", "writing")

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined
}

// YAML parses unquoted ISO dates (date: 2026-05-30) into Date objects, so accept both.
function asDateString(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === "string") return v
  return undefined
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

function normalizeType(v: unknown): PostType {
  return v === "devlog" || v === "note" ? v : "post"
}

async function readPostFile(fileName: string): Promise<Post | null> {
  const raw = await readFile(join(WRITING_DIR, fileName), "utf8")
  const { data, content } = matter(raw)

  // Honor the publish flag — unflagged notes never reach the site.
  if (data.publish !== true) return null

  const slug = asString(data.slug) || slugify(fileName)
  return {
    slug,
    title: asString(data.title) || fileName.replace(/\.md$/i, ""),
    date: asDateString(data.date) || "1970-01-01",
    updated: asDateString(data.updated) ?? null,
    type: normalizeType(data.type),
    project: asString(data.project) ?? null,
    tags: asStringArray(data.tags),
    summary: asString(data.summary) ?? null,
    content,
    outgoing: extractWikilinkSlugs(content),
  }
}

let _cache: Post[] | null = null

// Read + parse every published post once per build.
export async function getAllPosts(): Promise<Post[]> {
  if (_cache) return _cache
  let files: string[] = []
  try {
    files = (await readdir(WRITING_DIR)).filter((f) => f.endsWith(".md"))
  } catch {
    return [] // directory may not exist yet
  }
  const posts = (await Promise.all(files.map(readPostFile))).filter(
    (p): p is Post => p !== null
  )
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  _cache = posts
  return posts
}

export async function getAllPostMeta(): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    updated: p.updated,
    type: p.type,
    project: p.project,
    tags: p.tags,
    summary: p.summary,
  }))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug) || null
}

export async function getBacklinks(slug: string): Promise<Backlink[]> {
  const posts = await getAllPosts()
  return posts
    .filter((p) => p.slug !== slug && p.outgoing.includes(slug))
    .map((p) => ({ slug: p.slug, title: p.title }))
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts()
  const counts = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const meta = await getAllPostMeta()
  return meta.filter((p) => p.tags.includes(tag))
}

export async function getAllProjects(): Promise<{ project: string; count: number }[]> {
  const posts = await getAllPosts()
  const counts = new Map<string, number>()
  for (const p of posts) {
    if (p.project) counts.set(p.project, (counts.get(p.project) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([project, count]) => ({ project, count }))
    .sort((a, b) => b.count - a.count || a.project.localeCompare(b.project))
}

export async function getPostsByProject(project: string): Promise<PostMeta[]> {
  const meta = await getAllPostMeta()
  return meta.filter((p) => p.project === project)
}
