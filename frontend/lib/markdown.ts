import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

interface SectionContent {
  data: Record<string, unknown>
  content: string
  subSections?: Record<string, string>
}

// Input: Markdown content string
// Output: Split content into sections based on level 3 headers
const splitContentByHeaders = (content: string): Record<string, string> => {
  const sections: Record<string, string> = {}
  const lines = content.split('\n')
  let currentSection = ''
  let currentContent: string[] = []

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim()
      }
      currentSection = line.replace('### ', '').trim()
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim()
  }

  return sections
}

// Input: Path to markdown file
// Output: Processed markdown content with frontmatter and sub-sections
export async function getMarkdownContent(slug: string): Promise<SectionContent> {
  const filePath = join(process.cwd(), 'content', `${slug}.md`)
  const fileContents = await readFile(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  // For projects, split content into sub-sections
  if (slug === 'projects') {
    return {
      data,
      content: content.split('###')[0],
      subSections: splitContentByHeaders(content)
    }
  }

  return { data, content }
} 