import { Button } from "@/components/ui/button"
import { ExternalLink, Github, FileText } from "lucide-react"

interface ButtonLinkProps {
  href: string
  type: "app" | "github" | "resume" | "docs"
  children?: React.ReactNode
}

export function ButtonLink({ href, type, children }: ButtonLinkProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="border-tui-dark-gray text-tui-cyan hover:bg-tui-cyan hover:text-tui-bg font-mono rounded-none transition-colors"
      asChild
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {type === "docs" ? <FileText /> : type === "app" ? <ExternalLink /> : type === "github" ? <Github /> : <FileText />}
        {children || (type === "docs" ? "View Docs" : type === "app" ? "View App" : type === "github" ? "View Code" : "View Resume")}
      </a>
    </Button>
  )
} 