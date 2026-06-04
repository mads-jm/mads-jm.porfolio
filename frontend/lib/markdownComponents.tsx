import type { Components } from 'react-markdown'
import { ButtonLink } from '../components/ButtonLink'

// Extend Components type to include our custom components
export interface CustomComponents extends Components {
  ProjectLink: typeof ButtonLink
}

// Custom components for ReactMarkdown — shared across the hub, portfolio and
// personal pages so link affordances (Code/App/Docs/Resume → ButtonLink) stay
// consistent everywhere markdown is rendered.
export const markdownComponents: CustomComponents = {
  ProjectLink: ButtonLink,
  a: ({ href, children }) => {
    const text = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : String(children ?? "")
    const lower = text.toLowerCase()

    if (lower.includes("code"))   return <ButtonLink href={href ?? "#"} type="github">{children}</ButtonLink>
    if (lower.includes("app"))    return <ButtonLink href={href ?? "#"} type="app">{children}</ButtonLink>
    if (lower.includes("doc"))    return <ButtonLink href={href ?? "#"} type="docs">{children}</ButtonLink>
    if (lower.includes("resume")) return <ButtonLink href={href ?? "#"} type="resume">{children}</ButtonLink>

    return <a href={href}>{children}</a>
  }
}
