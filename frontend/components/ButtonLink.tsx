import { Button } from "@/components/ui/button"
import { ExternalLink, Github, FileText } from "lucide-react"

interface ButtonLinkProps {
  href: string
  type: "app" | "github" | "resume"
  children?: React.ReactNode
}

export function ButtonLink({ href, type, children }: ButtonLinkProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      asChild
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {type === "app" ? <ExternalLink /> : type === "github" ? <Github /> : <FileText />}
        {children || (type === "app" ? "View App" : type === "github" ? "View Code" : "View Resume")}
      </a>
    </Button>
  )
} 