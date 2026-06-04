import Head from "next/head"
import Link from "next/link"
import { useEffect, useState, type ReactNode } from "react"
import { TopBar, BottomBar } from "../StatusBars"
import { useSiteMode } from "../../lib/useSiteMode"
import styles from "../../styles/writing.module.css"

interface WritingLayoutProps {
  title: string
  description?: string | null
  // Breadcrumb-ish path shown in the bottom bar, e.g. "writing/my-post"
  path?: string
  children: ReactNode
}

const LENSES = [
  { label: "stream", href: "/writing" },
  { label: "topics", href: "/writing#topics" },
  { label: "projects", href: "/writing#projects" },
]

export function WritingLayout({ title, description, path, children }: WritingLayoutProps) {
  const { tuiMode, toggleMode } = useSiteMode()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile rail on route-ish hash changes
  useEffect(() => {
    const close = () => setMobileOpen(false)
    window.addEventListener("hashchange", close)
    return () => window.removeEventListener("hashchange", close)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>

      <TopBar tuiMode={tuiMode} onToggleMode={toggleMode} />
      <BottomBar activeSection={`#${path ?? "writing"}`} />

      <button
        className={styles.mobileTrigger}
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle writing navigation"
      >
        {mobileOpen ? "▽ close" : "▽ menu"}
      </button>

      <nav className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`} aria-label="Writing navigation">
        <Link href="/" className={styles.backLink}>
          {"<< home"}
        </Link>
        <div className={styles.railHeading}>~/writing</div>
        <ul className={styles.railList}>
          {LENSES.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.railItem}>
                <span className={styles.railPrefix}>{">"}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.main}>{children}</main>
    </div>
  )
}
