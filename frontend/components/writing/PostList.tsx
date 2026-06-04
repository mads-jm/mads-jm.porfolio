import Link from "next/link"
import type { PostMeta } from "../../lib/writing"
import styles from "../../styles/writing.module.css"

function formatDate(iso: string): string {
  // Render deterministically (avoid locale/timezone drift between build and client).
  const [y, m, d] = iso.split("T")[0].split("-")
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  if (!y || !m || !d) return iso
  return `${y}-${m}-${d} (${months[Number(m) - 1] ?? ""} ${Number(d)})`
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return <p className={styles.empty}>No notes here yet. Write something. ▽</p>
  }
  return (
    <ul className={styles.postList}>
      {posts.map((p) => (
        <li key={p.slug} className={styles.postRow}>
          <div className={styles.postRowHead}>
            <span className={styles.postType} data-type={p.type}>
              {p.type}
            </span>
            <time className={styles.postDate} dateTime={p.date}>
              {formatDate(p.date)}
            </time>
            {p.project && (
              <Link href={`/writing/projects/${p.project}`} className={styles.postProject}>
                @{p.project}
              </Link>
            )}
          </div>
          <Link href={`/writing/${p.slug}`} className={styles.postTitle}>
            {p.title}
          </Link>
          {p.summary && <p className={styles.postSummary}>{p.summary}</p>}
          {p.tags.length > 0 && (
            <div className={styles.tagRow}>
              {p.tags.map((t) => (
                <Link key={t} href={`/writing/topics/${t}`} className={styles.tag}>
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
