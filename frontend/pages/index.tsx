import type { NextPage } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { SiteLayout } from '../components/SiteLayout'
import { Contact } from '../components/Contact'
import { getMarkdownContent } from '../lib/markdown'
import hub from '../styles/Hub.module.css'

interface HubProps {
  intro: string
  contact: string
}

const DOORS = [
  { href: '/portfolio', label: 'the work', desc: 'projects, systems, and what I ship' },
  { href: '/me', label: 'about me', desc: 'the person behind the terminal' },
  { href: '/writing', label: 'writing', desc: 'notes, devlogs, a digital garden' },
]

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joseph Madigan",
  alternateName: "mads",
  url: "https://mads-jm.github.io",
  jobTitle: "Machine Learning Engineer",
  worksFor: { "@type": "Organization", name: "EdgeRunner AI" },
  sameAs: [
    "https://github.com/mads-jm",
    "https://linkedin.com/in/madiganj13",
  ],
}

const Hub: NextPage<HubProps> = ({ intro, contact }) => {
  return (
    <SiteLayout
      title="mads | systems & tools craftsperson"
      description="I build local-first software: terminal UIs, peer-to-peer systems, and developer tools, mostly in Rust."
      path="/"
      jsonLd={personJsonLd}
    >
      <div className={hub.wrap}>
        <div className={hub.heading}>
          <h1 className={hub.name}>Joseph Madigan</h1>
          <span className={hub.handle}>mads</span>
          <div className={`${hub.intro} react-markdown`}>
            <ReactMarkdown>{intro}</ReactMarkdown>
          </div>
        </div>

        <nav className={hub.doors} aria-label="Site sections">
          {DOORS.map((d) => (
            <Link key={d.href} href={d.href} className={hub.door}>
              <span className={hub.doorLabel}>{d.label}</span>
              <span className={hub.doorDesc}>{d.desc}</span>
              <span className={hub.doorArrow}>→</span>
            </Link>
          ))}
        </nav>

        <div className={hub.connect}>
          <p className={hub.reachOut}>
            <span className={hub.kaomoji}>( ˘ ▽ ˘ )ノ</span> say hi! i want to hear what you&apos;re building
          </p>
          <Contact content={contact} compact />
        </div>
      </div>
    </SiteLayout>
  )
}

export async function getStaticProps() {
  const [home, contact] = await Promise.all([
    getMarkdownContent('home'),
    getMarkdownContent('contact'),
  ])

  return {
    props: {
      intro: home.content,
      contact: contact.content,
    },
  }
}

export default Hub
