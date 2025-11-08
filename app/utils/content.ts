/**
 * Content parsing utilities for extracting structured data from source files
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { Skill, Category, Book } from '~/types'

/**
 * Read and parse transcript file
 */
export function parseTranscript(): string {
  const transcriptPath = join(process.cwd(), 'docs/sources/youtubevideofulltext.yml')
  const content = readFileSync(transcriptPath, 'utf-8')
  return content.trim()
}

/**
 * Extract book references from text
 * Looks for patterns like: *Book Title* (Author) or منابع: *Book Title* (Author)
 */
export function extractBooks(text: string, skillId: number): Book[] {
  const books: Book[] = []
  // Pattern to match: *Book Title* (Author)
  const bookPattern = /\*([^*]+)\*\s*\(([^)]+)\)/g
  let match: RegExpExecArray | null

  while ((match = bookPattern.exec(text)) !== null) {
    if (match[1] && match[2]) {
      const title = match[1].trim()
      const author = match[2].trim()
      
      // Check if book already exists
      const existingBook = books.find((b) => b.title === title && b.author === author)
      if (existingBook) {
        if (!existingBook.skillIds.includes(skillId)) {
          existingBook.skillIds.push(skillId)
        }
      } else {
        books.push({
          title,
          author,
          skillIds: [skillId],
        })
      }
    }
  }

  return books
}

/**
 * Parse summary file and extract skills
 * The summary file has a structured format with numbered skills
 */
export function parseSkillsFromSummary(): Skill[] {
  const summaryPath = join(process.cwd(), 'docs/sources/summaryofyoutubevideofulltext.yml')
  const content = readFileSync(summaryPath, 'utf-8')

  const skills: Skill[] = []
  const lines = content.split('\n')

  let currentSkill: Partial<Skill> | null = null
  let currentSection = ''
  let skillNumber = 0
  let inHealthSection = false
  let inIdentitySection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Detect section headers
    if (line.includes('مهارت‌های سلامت') || line.includes('مهارت‌های ۱ تا ۶')) {
      inHealthSection = true
      inIdentitySection = false
      continue
    }

    if (line.includes('مهارت‌های هویت') || line.includes('مهارت‌های ۷ تا ۱۵')) {
      inHealthSection = false
      inIdentitySection = true
      continue
    }

    // Detect skill number (e.g., "1. **خوابِ باکیفیت**")
    const skillMatch = line.match(/^(\d+)\.\s*\*\*([^*]+)\*\*/)
    if (skillMatch && skillMatch[1] && skillMatch[2]) {
      // Save previous skill if exists
      if (currentSkill && skillNumber > 0 && currentSkill.whyItMatters && currentSkill.howTo) {
        // Clean up and finalize previous skill
        currentSkill.whyItMatters.fa = currentSkill.whyItMatters.fa.trim()
        currentSkill.howTo.fa = currentSkill.howTo.fa.trim()
        skills.push(currentSkill as Skill)
      }

      const listedNumber = parseInt(skillMatch[1], 10)
      const skillNameFa = skillMatch[2].trim()

      // Calculate actual skill number based on section
      if (inHealthSection) {
        skillNumber = listedNumber // Skills 1-6
      } else if (inIdentitySection) {
        skillNumber = listedNumber + 6 // Skills 7-15 (listed as 1-9 in section)
      } else {
        skillNumber = listedNumber // Fallback
      }

      // Determine category based on skill number
      let category: 'health' | 'identity' | 'career' = 'health'
      if (skillNumber >= 1 && skillNumber <= 6) {
        category = 'health'
      } else if (skillNumber >= 7 && skillNumber <= 12) {
        category = 'identity'
      } else if (skillNumber >= 13 && skillNumber <= 15) {
        category = 'career'
      }

      currentSkill = {
        id: skillNumber,
        name: {
          fa: skillNameFa,
          en: '', // Will be added later
        },
        category,
        whyItMatters: {
          fa: '',
          en: '',
        },
        howTo: {
          fa: '',
          en: '',
        },
        books: [],
      }
      currentSection = ''
      continue
    }

    // Detect sections: "چرا مهم است؟", "چرا؟", "چطور؟", "چیست؟", "منابع:"
    if (currentSkill && (line.includes('چرا مهم است؟') || (line.includes('چرا؟') && !line.includes('منابع')))) {
      currentSection = 'whyItMatters'
      // Extract content after "چرا مهم است؟" or "چرا؟"
      const contentAfter = line.split(/چرا مهم است؟|چرا\؟/).pop()?.trim()
      if (contentAfter && contentAfter.length > 5 && currentSkill.whyItMatters) {
        currentSkill.whyItMatters.fa = contentAfter
      }
      continue
    }

    if (currentSkill && (line.includes('چطور؟') || line.includes('چیست؟'))) {
      currentSection = 'howTo'
      // Extract content after "چطور؟" or "چیست؟"
      const contentAfter = line.split(/چطور\؟|چیست\؟/).pop()?.trim()
      if (contentAfter && contentAfter.length > 5 && currentSkill.howTo) {
        currentSkill.howTo.fa = contentAfter
      }
      continue
    }

    if (currentSkill && (line.includes('منابع:') || line.includes('منابع'))) {
      currentSection = 'books'
      // Extract books from this line
      if (currentSkill.id && currentSkill.books) {
        const books = extractBooks(line, currentSkill.id)
        currentSkill.books.push(...books)
      }
      continue
    }

    // Collect content for current section
    if (currentSkill && line && !line.startsWith('##') && !line.startsWith('---') && line.length > 3) {
      // Skip empty lines and section markers
      if (line === '---' || line.startsWith('##')) {
        continue
      }

      if (currentSection === 'whyItMatters' && currentSkill.whyItMatters) {
        currentSkill.whyItMatters.fa += (currentSkill.whyItMatters.fa ? ' ' : '') + line
      } else if (currentSection === 'howTo' && currentSkill.howTo) {
        currentSkill.howTo.fa += (currentSkill.howTo.fa ? ' ' : '') + line
      } else if (currentSection === 'books' && currentSkill.id && currentSkill.books) {
        // Extract books from this line
        const books = extractBooks(line, currentSkill.id)
        currentSkill.books.push(...books)
      }
    }
  }

  // Save last skill
  if (currentSkill && skillNumber > 0 && currentSkill.whyItMatters && currentSkill.howTo) {
    currentSkill.whyItMatters.fa = currentSkill.whyItMatters.fa.trim()
    currentSkill.howTo.fa = currentSkill.howTo.fa.trim()
    skills.push(currentSkill as Skill)
  }

  return skills
}

/**
 * Parse categories from skills
 */
export function parseCategories(_skills: Skill[]): Category[] {
  const categories: Category[] = [
    {
      id: 'health',
      name: {
        fa: 'سلامت',
        en: 'Health',
      },
      description: {
        fa: 'مهارت‌های ۱ تا ۶: سلامت و انرژی پایه',
        en: 'Skills 1-6: Health and Energy Foundation',
      },
      skills: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'identity',
      name: {
        fa: 'هویت',
        en: 'Identity',
      },
      description: {
        fa: 'مهارت‌های ۷ تا ۱۲: هویت، هدف و یادگیری',
        en: 'Skills 7-12: Identity, Purpose and Learning',
      },
      skills: [7, 8, 9, 10, 11, 12],
    },
    {
      id: 'career',
      name: {
        fa: 'شغل',
        en: 'Career',
      },
      description: {
        fa: 'مهارت‌های ۱۳ تا ۱۵: بازار کار و درآمد',
        en: 'Skills 13-15: Career and Income',
      },
      skills: [13, 14, 15],
    },
  ]

  return categories
}

/**
 * Parse summary file content
 */
export function parseSummary(): string {
  const summaryPath = join(process.cwd(), 'docs/sources/summaryofyoutubevideofulltext.yml')
  const content = readFileSync(summaryPath, 'utf-8')
  return content.trim()
}

/**
 * Collect all unique books from skills
 */
export function collectAllBooks(skills: Skill[]): Book[] {
  const bookMap = new Map<string, Book>()

  skills.forEach((skill) => {
    skill.books.forEach((book) => {
      const key = `${book.title}|${book.author}`
      const existing = bookMap.get(key)
      if (existing) {
        // Merge skill IDs
        if (!existing.skillIds.includes(skill.id)) {
          existing.skillIds.push(skill.id)
        }
      } else {
        bookMap.set(key, { ...book })
      }
    })
  })

  return Array.from(bookMap.values())
}
