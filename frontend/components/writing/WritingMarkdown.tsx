import { Children, isValidElement, type ReactNode } from "react"
import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { transformObsidianMarkdown } from "../../lib/obsidian-markdown"

// Parse an Obsidian callout out of blockquote children.
// Handles the common case: first child is a <p> whose leading text is "[!type] Title".
function parseCallout(
  children: ReactNode
): { type: string; title: string; body: ReactNode[] } | null {
  const arr = Children.toArray(children)
  // react-markdown interleaves whitespace text nodes — find the first real element.
  const first = arr.find((c) => isValidElement(c))
  if (!first || !isValidElement(first)) return null

  const firstProps = first.props as { children?: ReactNode }
  const pChildren = Children.toArray(firstProps.children)
  const leading = pChildren[0]
  if (typeof leading !== "string") return null

  const m = leading.match(/^\[!(\w+)\][+-]?\s*([^\n]*)/)
  if (!m) return null

  const [, type, title] = m
  const remainder = leading.slice(m[0].length) // text after the marker line
  const rebuiltFirst = <p key="callout-lead">{[remainder, ...pChildren.slice(1)]}</p>

  const body = [...arr]
  body[arr.indexOf(first)] = rebuiltFirst
  return { type: type.toLowerCase(), title, body }
}

const markdownComponents: Components = {
  a: ({ href, children }) => {
    const url = href ?? "#"
    const isInternal = url.startsWith("/")
    if (isInternal) {
      return (
        <Link href={url} className="writing-link">
          {children}
        </Link>
      )
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="writing-link">
        {children}
      </a>
    )
  },
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} className="writing-img" />,
  blockquote: ({ children }) => {
    const callout = parseCallout(children)
    if (callout) {
      return (
        <aside className="writing-callout" data-callout={callout.type}>
          <div className="writing-callout-title">{callout.title || callout.type}</div>
          <div className="writing-callout-body">{callout.body}</div>
        </aside>
      )
    }
    return <blockquote>{children}</blockquote>
  },
}

export function WritingMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {transformObsidianMarkdown(children)}
    </ReactMarkdown>
  )
}
