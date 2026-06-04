import type { NextPage } from 'next'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { SiteLayout } from '../components/SiteLayout'
import { TuiSidebar, PROJECT_NAV_ITEMS } from '../components/TuiSidebar'
import { ProjectShowcase } from '../components/ProjectShowcase'
import { CareerTimeline } from '../components/CareerTimeline'
import { Contact } from '../components/Contact'
import { ButtonLink } from '../components/ButtonLink'
import { markdownComponents } from '../lib/markdownComponents'
import { getMarkdownContent } from '../lib/markdown'
import styles from '../styles/Home.module.css'

interface PortfolioProps {
  overview: string
  projectsIntro: string
  projects: Record<string, string>
  contact: string
}

const RESUME_URL = "https://docs.google.com/document/d/1HqCspncpNP31ns-R4zuZHlaF6cYVFCS5UfRx_gPu-xw/edit?usp=sharing"

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joseph Madigan",
  alternateName: "mads",
  url: "https://home.madigan.app/portfolio",
  jobTitle: "Machine Learning Engineer",
  worksFor: { "@type": "Organization", name: "EdgeRunner AI" },
  knowsAbout: ["Rust", "TypeScript", "Python", "Terminal UIs", "Peer-to-peer systems", "Local-first software"],
  sameAs: [
    "https://github.com/mads-jm",
    "https://linkedin.com/in/madiganj13",
  ],
}

const Portfolio: NextPage<PortfolioProps> = ({ overview, projectsIntro, projects, contact }) => {
  const [activeSection, setActiveSection] = useState('#overview')

  return (
    <SiteLayout
      title="mads | work & projects"
      description="Systems and tools I've built: Rust TUIs, peer-to-peer platforms, local-first apps, and AI tooling. Shipped, linked, and open source."
      path="/portfolio"
      activeSection={activeSection}
      jsonLd={personJsonLd}
      sidebar={<TuiSidebar navItems={PROJECT_NAV_ITEMS} onActiveChange={setActiveSection} />}
    >
      <section id="overview" className={`${styles.section} ${styles.heroCompact}`}>
        <div className="react-markdown">
          <ReactMarkdown components={markdownComponents}>{overview}</ReactMarkdown>
        </div>
        <div className={styles.heroActions}>
          <ButtonLink href={RESUME_URL} type="resume">Resume</ButtonLink>
          <Contact content={contact} compact />
        </div>
      </section>

      <section id="career" className={styles.section}>
        <h2>career</h2>
        <p>One thread runs through all of it: people. Years on theatre floors and behind coffee bars taught me to read a room, win someone over, and build a team that shows up. I came to engineering with that instinct intact and build software the same way: start with the person on the other end. The EdgeRunner roles expand for detail.</p>
        <CareerTimeline />
        <hr className="tui-divider" />
      </section>

      <ProjectShowcase intro={projectsIntro} projects={projects} />
    </SiteLayout>
  )
}

export async function getStaticProps() {
  const [overview, projectsData, contact] = await Promise.all([
    getMarkdownContent('portfolio'),
    getMarkdownContent('projects'),
    getMarkdownContent('contact'),
  ])

  return {
    props: {
      overview: overview.content,
      projectsIntro: projectsData.content,
      projects: projectsData.subSections ?? {},
      contact: contact.content,
    },
  }
}

export default Portfolio
