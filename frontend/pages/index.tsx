import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar } from "../components/AppSidebar"
import ReactMarkdown from 'react-markdown'
import { getMarkdownContent } from '../lib/markdown'
import { Contact } from '../components/Contact'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

interface SectionData {
  title?: string
  [key: string]: unknown
}

interface SectionContent {
  data: SectionData
  content: string
  subSections?: Record<string, string>
}

interface HomeProps {
  sections: {
    [key: string]: SectionContent
  }
}

// Input: None
// Output: Rendered scroll indicator component
const ScrollIndicator = () => {
  return (
    <div className={styles.scrollIndicator}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.scrollArrow}
        color="black"
      >
        <path
          d="M12 5L12 19M12 19L19 12M12 19L5 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

// Input: Section content and ID
// Output: Rendered section with markdown content
const renderSection = (content: string, id: string) => {
  if (id === 'contact') {
    return (
      <section id={id} className={styles.section}>
        <Contact content={content} />
      </section>
    )
  }
  if (id === 'home') {
    return (
      <section id={id} className={styles.section}>
        <div className="react-markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          maxWidth: '480px',
          padding: '0 1rem',
          margin: '0 auto'
        }}>
          <Carousel className="w-full">
            <CarouselContent className="flex">
              <CarouselItem className="flex justify-center">
                  <Image src="https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjv03EyzDDZg0mYBiM43271b8AJcFG6wTV5saW" alt="Chester" width={480} height={240} style={{ width: 'auto', height: '80%' }} />
              </CarouselItem>
              <CarouselItem className="flex justify-center">
                  <Image src="https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjunwSWmI0cIjg3BZdiJowSTfR8rl9WGL6m2b1" alt="Latte Art 2024" width={480} height={240} style={{ width: 'auto', height: '80%' }} />
              </CarouselItem>
              <CarouselItem className="flex justify-center">
                  <Image src="https://f9y2nv7uff.ufs.sh/f/nkgLo6uKBuNjsU4pIOn345OyM2j0kCJQ6lcYngt9VFziofvT" alt="Desk" width={480} height={240} style={{ width: 'auto', height: '80%' }} />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <ScrollIndicator />
      </section>
    )
  }
  return (
    <section id={id} className={styles.section}>
      <div className="react-markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  )
}

// Input: Project name and content
// Output: Rendered project section with proper ID and icon
const renderProjectSection = (name: string, content: string) => {
  const iconPath = `/projects/${name.toLowerCase().replace(' ', '')}.ico`
  return (
    <section id={`projects-${name.toLowerCase()}`} className={styles.section}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 64, height: 64, position: 'relative' }}>
          <Image 
            src={iconPath} 
            alt={`${name} icon`} 
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <h2>{name}</h2>
      </div>
      <div className="react-markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  )
}

const Home: NextPage<HomeProps> = ({ sections }) => {
  return (
    <SidebarProvider>
      <div className={styles.container}>
        <Head>
          <title>mads&apos; portfolio</title>
          <meta name="description" content="A single-page site with smooth scrolling navigation." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <AppSidebar />

        {/* Endless scroll sections */}
        <main className={styles.main}>
          
          {/* Main sections */}
          {renderSection(sections.home.content, "home")}
          {renderSection(sections.about.content, "about")}
          
          {/* Projects section with nested sections */}
          <section id="projects" className={styles.section}>
            <ReactMarkdown>{sections.projects.content}</ReactMarkdown>
            {sections.projects.subSections && Object.entries(sections.projects.subSections).map(([name, content]) => (
              renderProjectSection(name, content)
            ))}
          </section>
          
          {/* Contact section */}
          {renderSection(sections.contact.content, "contact")}
        </main>
      </div>
    </SidebarProvider>
  )
}

export async function getStaticProps() {
  const sections = {
    home: await getMarkdownContent('home'),
    about: await getMarkdownContent('about'),
    projects: await getMarkdownContent('projects'),
    contact: await getMarkdownContent('contact'),
  }

  return {
    props: {
      sections,
    },
  }
}

export default Home
