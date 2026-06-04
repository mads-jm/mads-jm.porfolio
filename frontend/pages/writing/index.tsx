import type { GetStaticProps, NextPage } from "next"
import Link from "next/link"
import { WritingLayout } from "../../components/writing/WritingLayout"
import { PostList } from "../../components/writing/PostList"
import {
  getAllPostMeta,
  getAllTags,
  getAllProjects,
  type PostMeta,
} from "../../lib/writing"
import styles from "../../styles/writing.module.css"

interface WritingIndexProps {
  posts: PostMeta[]
  tags: { tag: string; count: number }[]
  projects: { project: string; count: number }[]
}

const WritingIndex: NextPage<WritingIndexProps> = ({ posts, tags, projects }) => {
  return (
    <WritingLayout
      title="mads | writing"
      description="Notes, posts, and project devlogs: a digital garden by Joseph Madigan."
      path="writing"
    >
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>~/writing</h1>
        <p className={styles.pageLede}>
          A garden of posts, project devlogs, and notes. Updated as I think out loud.
        </p>
      </header>

      <section className={styles.streamSection}>
        <h2 className={styles.sectionLabel}>{"// stream"}</h2>
        <PostList posts={posts} />
      </section>

      <section id="topics" className={styles.lensSection}>
        <h2 className={styles.sectionLabel}>{"// topics"}</h2>
        {tags.length === 0 ? (
          <p className={styles.empty}>No topics yet.</p>
        ) : (
          <div className={styles.chipRow}>
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={`/writing/topics/${tag}`} className={styles.chip}>
                #{tag} <span className={styles.chipCount}>{count}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="projects" className={styles.lensSection}>
        <h2 className={styles.sectionLabel}>{"// project devlogs"}</h2>
        {projects.length === 0 ? (
          <p className={styles.empty}>No project devlogs yet.</p>
        ) : (
          <div className={styles.chipRow}>
            {projects.map(({ project, count }) => (
              <Link
                key={project}
                href={`/writing/projects/${project}`}
                className={styles.chip}
              >
                @{project} <span className={styles.chipCount}>{count}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </WritingLayout>
  )
}

export const getStaticProps: GetStaticProps<WritingIndexProps> = async () => {
  const [posts, tags, projects] = await Promise.all([
    getAllPostMeta(),
    getAllTags(),
    getAllProjects(),
  ])
  return { props: { posts, tags, projects } }
}

export default WritingIndex
