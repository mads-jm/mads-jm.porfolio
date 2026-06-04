import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"
import { WritingLayout } from "../../components/writing/WritingLayout"
import { WritingMarkdown } from "../../components/writing/WritingMarkdown"
import {
  getAllPosts,
  getBacklinks,
  getPostBySlug,
  type Backlink,
  type Post,
} from "../../lib/writing"
import styles from "../../styles/writing.module.css"

interface NoteProps {
  post: Post
  backlinks: Backlink[]
}

function formatDate(iso?: string | null): string {
  if (!iso) return ""
  return iso.split("T")[0]
}

const Note: NextPage<NoteProps> = ({ post, backlinks }) => {
  return (
    <WritingLayout
      title={`${post.title} · writing`}
      description={post.summary}
      path={`writing/${post.slug}`}
    >
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.postType} data-type={post.type}>
              {post.type}
            </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated && (
              <span className={styles.updated}>updated {formatDate(post.updated)}</span>
            )}
            {post.project && (
              <Link href={`/writing/projects/${post.project}`} className={styles.postProject}>
                @{post.project}
              </Link>
            )}
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          {post.tags.length > 0 && (
            <div className={styles.tagRow}>
              {post.tags.map((t) => (
                <Link key={t} href={`/writing/topics/${t}`} className={styles.tag}>
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div className={`writing-prose ${styles.prose}`}>
          <WritingMarkdown>{post.content}</WritingMarkdown>
        </div>

        {backlinks.length > 0 && (
          <footer className={styles.backlinks}>
            <h2 className={styles.sectionLabel}>{"// linked from"}</h2>
            <ul className={styles.backlinkList}>
              {backlinks.map((b) => (
                <li key={b.slug}>
                  <Link href={`/writing/${b.slug}`} className={styles.railItem}>
                    {"<- "}
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </WritingLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts()
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<NoteProps> = async ({ params }) => {
  const slug = String(params?.slug)
  const post = await getPostBySlug(slug)
  if (!post) return { notFound: true }
  const backlinks = await getBacklinks(slug)
  return { props: { post, backlinks } }
}

export default Note
