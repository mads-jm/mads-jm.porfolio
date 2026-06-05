import { useState, useEffect } from "react"
import Link from "next/link"
import styles from "../styles/components/status-bars.module.css"

interface StatusBarsProps {
  activeSection: string
  tuiMode: boolean
  onToggleMode: () => void
}

export function TopBar({ tuiMode, onToggleMode }: Pick<StatusBarsProps, "tuiMode" | "onToggleMode">) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      )
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className={styles.topBar}>
      <div className={styles.topLeft}>
        <Link href="/" className={styles.brandLink}>
          <span className={styles.brand}>▽</span>
          <span className={styles.brandName}>mads</span>
        </Link>
        <span className={styles.separator}>|</span>
        <Link href="/portfolio" className={styles.info}>work</Link>
        <span className={styles.separator}>|</span>
        <Link href="/me" className={styles.info}>about</Link>
        <span className={styles.separator}>|</span>
        <Link href="/writing" className={styles.info}>writing</Link>
      </div>
      <div className={styles.topRight}>
        <button
          className={styles.modeToggle}
          onClick={onToggleMode}
          aria-label={tuiMode ? "Switch to clean mode" : "Switch to TUI mode"}
          title={tuiMode ? "switch to clean mode" : "switch to tui mode"}
        >
          {tuiMode ? "[clean]" : "[tui]"}
        </button>
        <span className={styles.separator}>|</span>
        <span className={styles.clock}>{time}</span>
      </div>
    </header>
  )
}

export function BottomBar({ activeSection }: Pick<StatusBarsProps, "activeSection">) {
  // Convert hash to display path: #projects-graft → ~/projects/graft
  const sectionPath = activeSection
    .replace("#", "~/")
    .replace(/-/, "/")

  return (
    <footer className={styles.bottomBar}>
      <div className={styles.bottomLeft}>
        <span className={styles.sectionPath}>{sectionPath}</span>
      </div>
      <div className={styles.bottomRight}>
        <span className={styles.hintKey}>[↑↓]</span>
        <span className={styles.hintLabel}>nav</span>
        <span className={styles.hintKey}>[⏎]</span>
        <span className={styles.hintLabel}>go</span>
        <span className={styles.hintKey}>[spc]</span>
        <span className={styles.hintLabel}>expand</span>
      </div>
    </footer>
  )
}
