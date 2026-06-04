import type { NextPage } from 'next'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { SiteLayout } from '../components/SiteLayout'
import { TuiSidebar, type NavItem } from '../components/TuiSidebar'
import { PhotoCarousel } from '../components/PhotoCarousel'
import { Contact } from '../components/Contact'
import { markdownComponents } from '../lib/markdownComponents'
import { getMarkdownContent } from '../lib/markdown'
import styles from '../styles/Home.module.css'

interface MeProps {
  about: string
  contact: string
}

const ME_NAV_ITEMS: NavItem[] = [
  { label: "about", hash: "#about" },
  { label: "photos", hash: "#photos" },
  { label: "contact", hash: "#contact" },
]

const Me: NextPage<MeProps> = ({ about, contact }) => {
  const [activeSection, setActiveSection] = useState('#about')

  return (
    <SiteLayout
      title="mads | about"
      description="The person behind the terminal: how I came to software, how I think about building, and a few peeks into life outside the keyboard."
      path="/me"
      activeSection={activeSection}
      sidebar={<TuiSidebar navItems={ME_NAV_ITEMS} onActiveChange={setActiveSection} />}
    >
      <section id="about" className={styles.section}>
        <div className="react-markdown">
          <ReactMarkdown components={markdownComponents}>{about}</ReactMarkdown>
        </div>
        <hr className="tui-divider" />
      </section>

      <section id="photos" className={styles.section}>
        <h2>life outside the terminal</h2>
        <hr className="tui-divider" />
        <PhotoCarousel />
        <hr className="tui-divider" />
      </section>

      <section id="contact" className={styles.section}>
        <Contact content={contact} />
        <hr className="tui-divider" />
      </section>
    </SiteLayout>
  )
}

export async function getStaticProps() {
  const [about, contact] = await Promise.all([
    getMarkdownContent('about'),
    getMarkdownContent('contact'),
  ])

  return {
    props: {
      about: about.content,
      contact: contact.content,
    },
  }
}

export default Me
