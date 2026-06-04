import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { WritingLayout } from "../../../components/writing/WritingLayout"
import { PostList } from "../../../components/writing/PostList"
import { getAllTags, getPostsByTag, type PostMeta } from "../../../lib/writing"
import styles from "../../../styles/writing.module.css"

interface TopicProps {
  tag: string
  posts: PostMeta[]
}

const Topic: NextPage<TopicProps> = ({ tag, posts }) => {
  return (
    <WritingLayout title={`#${tag} · writing`} path={`writing/topics/${tag}`}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>#{tag}</h1>
        <p className={styles.pageLede}>
          {posts.length} note{posts.length === 1 ? "" : "s"} tagged #{tag}.
        </p>
      </header>
      <PostList posts={posts} />
    </WritingLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags()
  return {
    paths: tags.map(({ tag }) => ({ params: { tag } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<TopicProps> = async ({ params }) => {
  const tag = String(params?.tag)
  const posts = await getPostsByTag(tag)
  return { props: { tag, posts } }
}

export default Topic
