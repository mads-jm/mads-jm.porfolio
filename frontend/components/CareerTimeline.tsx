import { useState, useCallback } from "react"
import { WORK, EDUCATION } from "../lib/careerData"
import styles from "../styles/CareerTimeline.module.css"

// Two-column career view: a work spine (left) with a parallel education lane
// (right). Education segments are brackets that span the work entries they ran
// concurrent with, so the long road through school reads as overlap rather than
// a gap. EdgeRunner nodes carry expandable checkpoints. Data: lib/careerData.ts.
//
// Layout: a CSS grid. Row 1 is the column headers; work entry i sits on grid
// row i+2; an edu segment spanning WORK[from..to) sits on grid rows (from+2)..(to+2).
// On mobile the grid collapses to a single stacked column (DOM order: work, edu).
export function CareerTimeline() {
  // Namespaced `${entryId}:${checkpointId}` keys. Default-open the headline one.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(["edgerunner-engineer:perf"])
  )

  const toggle = useCallback((key: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  return (
    <div className={styles.layout}>
      <span className={styles.colHead} style={{ gridColumn: 1, gridRow: 1 }}>
        work
      </span>
      <span className={styles.colHead} style={{ gridColumn: 2, gridRow: 1 }}>
        edu
      </span>

      {WORK.map((entry, i) => (
        <div
          key={entry.id}
          className={styles.node}
          data-current={i === 0 ? "" : undefined}
          data-last={i === WORK.length - 1 ? "" : undefined}
          style={{ gridColumn: 1, gridRow: i + 2 }}
        >
          <header className={styles.head}>
            <h3 className={styles.role}>{entry.role}</h3>
            <p className={styles.meta}>
              <span className={styles.org}>{entry.org}</span>
              <span className={styles.dotSep} aria-hidden>·</span>
              <span className={styles.date}>{entry.dateRange}</span>
            </p>
          </header>

          {entry.blurb && <p className={styles.blurb}>{entry.blurb}</p>}
          {entry.stat && <p className={styles.stat}>{entry.stat}</p>}

          {entry.checkpoints && entry.checkpoints.length > 0 && (
            <ul className={styles.checkpoints}>
              {entry.checkpoints.map((cp) => {
                const key = `${entry.id}:${cp.id}`
                const isOpen = open.has(key)
                return (
                  <li key={cp.id} className={styles.checkpoint}>
                    <button
                      type="button"
                      className={styles.cpToggle}
                      aria-expanded={isOpen}
                      onClick={() => toggle(key)}
                    >
                      <span className={styles.cpArrow} aria-hidden>
                        {isOpen ? "▾" : "▸"}
                      </span>
                      <span className={styles.cpTitle}>{cp.title}</span>
                      {cp.dateRange && <span className={styles.cpDate}>{cp.dateRange}</span>}
                      <span className={styles.cpSummary}>{cp.summary}</span>
                    </button>

                    {isOpen && cp.detail && cp.detail.length > 0 && (
                      <ul className={styles.detail}>
                        {cp.detail.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ))}

      {EDUCATION.map((seg) => (
        <div
          key={seg.id}
          className={styles.eduSeg}
          style={{ gridColumn: 2, gridRow: `${seg.fromIndex + 2} / ${seg.toIndex + 2}` }}
        >
          <h3 className={styles.eduDegree}>{seg.degree}</h3>
          <p className={styles.eduOrg}>{seg.org}</p>
          <p className={styles.eduDate}>{seg.dateRange}</p>
          {seg.note && <p className={styles.eduNote}>{seg.note}</p>}
        </div>
      ))}
    </div>
  )
}
