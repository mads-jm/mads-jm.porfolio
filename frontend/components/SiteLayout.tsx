import Head from "next/head"
import { type ReactNode } from "react"
import { TopBar, BottomBar } from "./StatusBars"
import { useSiteMode } from "../lib/useSiteMode"
import styles from "../styles/SiteLayout.module.css"

const SITE_URL = "https://mads-jm.github.io"
const DEFAULT_OG_IMAGE = `${SITE_URL}/header.svg`

interface SiteLayoutProps {
  title: string
  description: string
  // Canonical path, e.g. "/portfolio". Drives canonical + og:url.
  path: string
  // Bottom-bar left label (e.g. "#projects"). Defaults from path.
  activeSection?: string
  ogImage?: string
  jsonLd?: Record<string, unknown>
  sidebar?: ReactNode
  children: ReactNode
}

// Shared TUI shell for the hub / portfolio / personal routes. Owns the single
// useSiteMode source (so the [tui]/[clean] choice persists across navigation)
// and all per-page SEO + share metadata. Modeled on WritingLayout.
export function SiteLayout({
  title,
  description,
  path,
  activeSection,
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
  sidebar,
  children,
}: SiteLayoutProps) {
  const { tuiMode, toggleMode } = useSiteMode()
  const url = `${SITE_URL}${path}`
  const bottomLabel = activeSection ?? `#${path.replace(/^\//, "") || "home"}`

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        <link rel="icon" href="/favicon.ico" sizes="any" />

        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </Head>

      <TopBar tuiMode={tuiMode} onToggleMode={toggleMode} />
      <BottomBar activeSection={bottomLabel} />

      {sidebar}

      <main className={sidebar ? styles.mainWithSidebar : styles.mainCentered}>
        {children}
      </main>
    </div>
  )
}
