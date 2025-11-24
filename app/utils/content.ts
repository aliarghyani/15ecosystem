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
 * Looks for patterns like: *Book Title* (Author) or Sources: *Book Title* (Author)
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
    const line = lines[i]?.trim() || ''

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

    // Detect skill number (e.g., "1. **Quality Sleep**")
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

    // Detect sections: "Why is it important?", "Why?", "How?", "What is it?", "Sources:"
    if (currentSkill && (line.includes('چرا مهم است؟') || (line.includes('چرا؟') && !line.includes('منابع')))) {
      currentSection = 'whyItMatters'
      // Extract content after "Why is it important?" or "Why?"
      const contentAfter = line.split(/چرا مهم است؟|چرا\؟/).pop()?.trim()
      if (contentAfter && contentAfter.length > 5 && currentSkill.whyItMatters) {
        currentSkill.whyItMatters.fa = contentAfter
      }
      continue
    }

    // Handle "What is it?" as fallback for whyItMatters when "Why?" is not present
    if (currentSkill && line.includes('چیست؟')) {
      // If whyItMatters is empty, use "What is it?" content as whyItMatters
      const contentAfter = line.split(/چیست\؟/).pop()?.trim()
      if (contentAfter && contentAfter.length > 5) {
        if (!currentSkill.whyItMatters?.fa || currentSkill.whyItMatters.fa.trim() === '') {
          if (currentSkill.whyItMatters) {
            currentSkill.whyItMatters.fa = contentAfter
          }
          currentSection = 'whyItMatters'
        } else {
          // If whyItMatters already has content, treat "What is it?" as howTo
          currentSection = 'howTo'
          if (currentSkill.howTo) {
            currentSkill.howTo.fa = contentAfter
          }
        }
      }
      continue
    }

    if (currentSkill && line.includes('چطور؟')) {
      currentSection = 'howTo'
      // Extract content after "How?"
      const contentAfter = line.split(/چطور\؟/).pop()?.trim()
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
 * Identify and add related skills connections based on logical progression
 * Progression: Health → Focus → Learning → Creativity → Brand/Income
 */
export function addRelatedSkills(skills: Skill[]): Skill[] {
  // Updated comprehensive skill relationships based on investigation
  // Bidirectional relationships: if A connects to B, B also connects to A
  const relationships: Record<number, number[]> = {
    // Health category (1-6): Foundation skills
    1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14], // Quality Sleep - Mother skill
    2: [1, 3, 4, 7, 8, 9, 10, 13, 14], // Focus (Attention Economy)
    3: [1, 2, 4, 5, 7, 9, 13], // Dopamine Management
    4: [1, 2, 3, 5, 6, 7, 9, 13, 15], // Stress Management
    5: [1, 3, 4, 6, 7, 11, 12, 13, 15], // Mental Health & Meaningful Relationships
    6: [1, 4, 5, 7, 9, 13, 15], // Healthy Longevity
    
    // Identity category (7-12): Building on health foundation
    7: [1, 2, 3, 4, 5, 6, 8, 9, 11, 13, 14], // Creativity
    8: [1, 2, 7, 9, 10, 11, 13, 14, 15], // Specific Knowledge
    9: [1, 2, 3, 4, 6, 7, 8, 10, 13, 14, 15], // Effective & Continuous Learning
    10: [1, 2, 8, 9, 11, 13, 14, 15], // English Language
    11: [5, 7, 8, 10, 12, 13, 15], // Personal Brand
    12: [5, 11, 13, 15], // Authenticity
    
    // Career category (13-15): Building on identity
    13: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15], // Content Creation
    14: [1, 2, 7, 8, 9, 10, 13, 15], // AI Literacy
    15: [4, 5, 6, 8, 9, 10, 11, 12, 13, 14], // Agency (Business Execution)
  }

  return skills.map((skill) => {
    const relatedIds = relationships[skill.id] || []
    // Filter to only include valid skill IDs (1-15) and remove self-reference
    const validRelatedIds = relatedIds.filter((id) => id >= 1 && id <= 15 && id !== skill.id)
    
    return {
      ...skill,
      relatedSkills: validRelatedIds.length > 0 ? validRelatedIds : undefined,
    }
  })
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
