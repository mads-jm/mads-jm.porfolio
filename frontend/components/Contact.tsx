import { Mail, Phone, Github, Linkedin } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface ContactConfig {
  icon: React.ComponentType<{ className?: string }>
  href: (value: string) => string
  external?: boolean
}

// Input: Contact information as markdown content
// Output: Styled contact section with description and icons
export function Contact({ content }: { content: string }) {
  // Split content into description and contact links
  const lines = content.split('\n')
  const description = lines.filter(line => !line.trim().startsWith('-')).join('\n')
  const contactLines = lines.filter(line => line.trim().startsWith('-'))
  
  const contacts = contactLines.map(line => {
    const [type, value] = line.replace('- ', '').split(': ')
    return { type, value }
  })

  // Map contact types to their respective icons and link handlers
  const contactConfig: Record<string, ContactConfig> = {
    Email: {
      icon: Mail,
      href: (value: string) => `mailto:${value}`,
    },
    Phone: {
      icon: Phone,
      href: (value: string) => `tel:${value.replace(/[^0-9]/g, '')}`,
    },
    GitHub: {
      icon: Github,
      href: (value: string) => `https://${value}`,
      external: true,
    },
    LinkedIn: {
      icon: Linkedin,
      href: (value: string) => `https://${value}`,
      external: true,
    },
  }

  return (
    <div className="flex flex-col gap-8 ">
      <div className="prose dark:prose-invert max-w-none pt-6">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
      
      <div className="flex flex-col gap-4 pt-4">
        {contacts.map(({ type, value }) => {
          const config = contactConfig[type]
          if (!config) return null

          const Icon = config.icon
          const href = config.href(value)
          const externalProps = config.external ? {
            target: "_blank",
            rel: "noopener noreferrer"
          } : {}

          return (
            <div key={type} className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <a 
                href={href}
                className="hover:text-primary transition-colors"
                {...externalProps}
              >
                {value}
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
} 