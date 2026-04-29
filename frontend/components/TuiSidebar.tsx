import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import styles from "../styles/components/tui-sidebar.module.css"

interface NavItem {
  label: string
  hash: string
  children?: { label: string; hash: string }[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "home",
    hash: "#home",
    children: [{ label: "contact", hash: "#home" }],
  },
  { label: "about", hash: "#about" },
  {
    label: "projects",
    hash: "#projects",
    children: [
      { label: "whatnext", hash: "#projects-whatnext" },
      { label: "pour", hash: "#projects-pour" },
      { label: "seed", hash: "#projects-seed" },
      { label: "git-identity", hash: "#projects-git-identity" },
      { label: "digest", hash: "#projects-digest" },
      { label: "emailessence", hash: "#projects-emailessence" },
      { label: "reverbxr", hash: "#projects-reverbxr" },
    ],
  },
  { label: "music", hash: "#projects-whatnext" },
]

interface FlatItem {
  label: string
  hash: string
  isChild: boolean
  parentLabel?: string
}

function flattenItems(items: NavItem[], expanded: Set<string>): FlatItem[] {
  const flat: FlatItem[] = []
  for (const item of items) {
    flat.push({ label: item.label, hash: item.hash, isChild: false })
    if (item.children && expanded.has(item.label)) {
      for (const child of item.children) {
        flat.push({
          label: child.label,
          hash: child.hash,
          isChild: true,
          parentLabel: item.label,
        })
      }
    }
  }
  return flat
}

interface NavListProps {
  flat: FlatItem[]
  activeHash: string
  focusIndex: number
  expanded: Set<string>
  onNavigate: (hash: string) => void
  onToggle: (label: string) => void
}

function NavList({ flat, activeHash, focusIndex, expanded, onNavigate, onToggle }: NavListProps) {
  return (
    <ul className={styles.navList}>
      {flat.map((item, i) => {
        const isActive = activeHash === item.hash
        const isFocused = focusIndex === i
        const parentItem = !item.isChild
          ? NAV_ITEMS.find((n) => n.label === item.label)
          : null
        const hasChildren = parentItem?.children && parentItem.children.length > 0
        const isExpanded = hasChildren && expanded.has(item.label)

        const className = [
          styles.navItem,
          isActive ? styles.navItemActive : "",
          isFocused ? styles.navItemFocused : "",
        ]
          .filter(Boolean)
          .join(" ")

        if (item.isChild) {
          return (
            <li key={`${item.parentLabel}-${item.label}`}>
              <a
                href={item.hash}
                className={className}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(item.hash)
                }}
              >
                <span className={styles.childPrefix}>·</span>
                {item.label}
              </a>
            </li>
          )
        }

        return (
          <li key={item.label}>
            <a
              href={item.hash}
              className={className}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault()
                if (hasChildren) {
                  onToggle(item.label)
                }
                onNavigate(item.hash)
              }}
            >
              <span className={`${styles.selector} ${!isActive ? styles.selectorHidden : ""}`}>
                {">>"}
              </span>
              {item.label}
              {hasChildren && (
                <span className={styles.badge}>
                  [{isExpanded ? "-" : parentItem!.children!.length}]
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

// Key hints moved to BottomBar status bar

interface TuiSidebarProps {
  onActiveChange?: (hash: string) => void
}

export function TuiSidebar({ onActiveChange }: TuiSidebarProps = {}) {
  const [activeHash, setActiveHash] = useState("#home")
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["projects"]))
  const [focusIndex, setFocusIndex] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  const flat = useMemo(() => flattenItems(NAV_ITEMS, expanded), [expanded])

  // Notify parent of active section changes
  useEffect(() => {
    onActiveChange?.(activeHash)
  }, [activeHash, onActiveChange])

  // Clamp focusIndex when flat list shrinks (e.g. after collapsing a group)
  useEffect(() => {
    setFocusIndex((i) => Math.min(i, flat.length - 1))
  }, [flat])

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = [
      "home", "about", "projects",
      "projects-whatnext", "projects-pour", "projects-seed", "projects-git-identity",
      "projects-emailessence", "projects-reverbxr",
    ]
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    // Track all currently visible sections so we can pick the best one
    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id)
          } else {
            visible.delete(entry.target.id)
          }
        }

        // Pick the visible section whose top is closest to the viewport top
        let bestId = ""
        let bestDist = Infinity
        for (const id of visible) {
          const el = document.getElementById(id)
          if (!el) continue
          const dist = Math.abs(el.getBoundingClientRect().top)
          if (dist < bestDist) {
            bestDist = dist
            bestId = id
          }
        }
        if (bestId) {
          setActiveHash(`#${bestId}`)
        }
      },
      { threshold: [0, 0.25, 0.5] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Sync with hash changes
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash)
      }
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const navigate = useCallback(
    (hash: string) => {
      window.location.hash = hash
      setActiveHash(hash)
      const el = document.getElementById(hash.slice(1))
      el?.scrollIntoView({ behavior: "smooth" })
      if (isMobile) setMobileOpen(false)
    },
    [isMobile]
  )

  const toggleGroup = useCallback((label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }, [])

  // Refs for global keyboard handler (avoids re-registering listener on every state change)
  const flatRef = useRef(flat)
  const focusIndexRef = useRef(focusIndex)
  const mobileOpenRef = useRef(mobileOpen)
  const isMobileRef = useRef(isMobile)
  useEffect(() => { flatRef.current = flat }, [flat])
  useEffect(() => { focusIndexRef.current = focusIndex }, [focusIndex])
  useEffect(() => { mobileOpenRef.current = mobileOpen }, [mobileOpen])
  useEffect(() => { isMobileRef.current = isMobile }, [isMobile])

  // Global keyboard listener — arrow keys always control the sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when user is in a form element or interactive widget
      const active = document.activeElement
      const tag = (active?.tagName || "").toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select") return
      if (active?.getAttribute("contenteditable") === "true") return
      // Yield to ARIA widgets (modals, listboxes, menus, etc.)
      const role = active?.getAttribute("role") || active?.closest("[role]")?.getAttribute("role") || ""
      if (["dialog", "listbox", "menu", "combobox", "tree", "grid"].includes(role)) return

      // On mobile, only handle keys when panel is open
      if (isMobileRef.current && !mobileOpenRef.current) return

      const currentFlat = flatRef.current
      const currentIndex = focusIndexRef.current

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          setFocusIndex((i) => Math.max(0, i - 1))
          break
        case "ArrowDown":
          e.preventDefault()
          setFocusIndex((i) => Math.min(currentFlat.length - 1, i + 1))
          break
        case "Enter": {
          e.preventDefault()
          const item = currentFlat[currentIndex]
          if (item) {
            window.location.hash = item.hash
            setActiveHash(item.hash)
            const el = document.getElementById(item.hash.slice(1))
            el?.scrollIntoView({ behavior: "smooth" })
            if (isMobileRef.current) setMobileOpen(false)
          }
          break
        }
        case " ": {
          // Only prevent default when focused on a nav item with children
          const item = currentFlat[currentIndex]
          if (item && !item.isChild) {
            const parent = NAV_ITEMS.find((n) => n.label === item.label)
            if (parent?.children) {
              e.preventDefault()
              setExpanded((prev) => {
                const next = new Set(prev)
                if (next.has(item.label)) next.delete(item.label)
                else next.add(item.label)
                return next
              })
            }
          }
          break
        }
        case "Escape":
          if (e.defaultPrevented) break
          if (isMobileRef.current) setMobileOpen(false)
          break
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, []) // Empty deps — reads from refs

  // Desktop sidebar
  const sidebarContent = (
    <>
      <NavList
        flat={flat}
        activeHash={activeHash}
        focusIndex={focusIndex}
        expanded={expanded}
        onNavigate={navigate}
        onToggle={toggleGroup}
      />
    </>
  )

  return (
    <>
      {/* Desktop — hidden via CSS at <=768px */}
      <nav
        ref={navRef}
        className={styles.sidebar}
        tabIndex={0}
        aria-label="Site navigation"
      >
        {sidebarContent}
      </nav>

      {/* Mobile trigger — shown via CSS at <=768px */}
      <button
        className={styles.mobileTrigger}
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? "▽ close" : "▽ nav"}
      </button>

      {/* Mobile backdrop */}
      <div
        className={`${styles.mobileBackdrop} ${mobileOpen ? styles.open : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile panel */}
      <div
        ref={mobileNavRef}
        className={`${styles.mobilePanel} ${mobileOpen ? styles.open : ""}`}
        tabIndex={0}
        aria-label="Site navigation"
      >
        <NavList
          flat={flat}
          activeHash={activeHash}
          focusIndex={focusIndex}
          expanded={expanded}
          onNavigate={navigate}
          onToggle={toggleGroup}
        />
      </div>
    </>
  )
}
