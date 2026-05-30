import { useCallback, useEffect, useState } from "react"

// Shared [tui] <-> [clean] mode toggle, persisted to localStorage and applied as
// data-mode on <html> (themes.css / globals.css read it). Mirrors the inline logic in
// pages/index.tsx so the writing pages stay in sync with the rest of the site.
// TODO: refactor index.tsx to use this hook too (currently duplicated — see WRITING_GARDEN.md).
export function useSiteMode() {
  const [tuiMode, setTuiMode] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("site-mode")
    if (saved === "clean") {
      setTuiMode(false)
      document.documentElement.setAttribute("data-mode", "clean")
    }
  }, [])

  const toggleMode = useCallback(() => {
    setTuiMode((prev) => {
      const next = !prev
      const mode = next ? "tui" : "clean"
      document.documentElement.setAttribute("data-mode", mode)
      localStorage.setItem("site-mode", mode)
      return next
    })
  }, [])

  return { tuiMode, toggleMode }
}
