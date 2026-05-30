import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { WritingLayout } from "../../../components/writing/WritingLayout"
import { PostList } from "../../../components/writing/PostList"
import { getAllProjects, getPostsByProject, type PostMeta } from "../../../lib/writing"
import styles from "../../../styles/writing.module.css"

interface ProjectProps {
  project: string
  posts: PostMeta[]
}

const ProjectDevlog: NextPage<ProjectProps> = ({ project, posts }) => {
  return (
    <WritingLayout title={`@${project} devlog · writing`} path={`writing/projects/${project}`}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>@{project}</h1>
        <p className={styles.pageLede}>
          Build-in-public devlog — {posts.length} entr{posts.length === 1 ? "y" : "ies"}.
        </p>
      </header>
      <PostList posts={posts} />
    </WritingLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getAllProjects()
  return {
    paths: projects.map(({ project }) => ({ params: { project } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<ProjectProps> = async ({ params }) => {
  const project = String(params?.project)
  const posts = await getPostsByProject(project)
  return { props: { project, posts } }
}

export default ProjectDevlog
