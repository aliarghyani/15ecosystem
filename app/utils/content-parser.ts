/**
 * Utility functions for parsing content and detecting entity mentions
 * Creates clickable links for skills, books, writers, and categories
 */

import { getAllSkills } from './skills'
import { getAllBooks, getBookSlug } from './books'
import { getAllWriters } from './writers'
import { getAllCategories } from './categories'

interface EntityMatch {
  type: 'skill' | 'book' | 'writer' | 'category'
  name: string
  slug: string
  startIndex: number
  endIndex: number
}

/**
 * Detect skill mentions in text
 */
export function detectSkillMentions(text: string, locale: 'fa' | 'en'): EntityMatch[] {
  const skills = getAllSkills(locale)
  const matches: EntityMatch[] = []

  skills.forEach((skill) => {
    const skillName = locale === 'fa' ? skill.name.fa : skill.name.en
    if (!skillName) return

    // Create regex pattern for skill name (case-insensitive, word boundaries)
    const pattern = new RegExp(`\\b${escapeRegex(skillName)}\\b`, 'gi')
    let match: RegExpExecArray | null

    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        type: 'skill',
        name: skillName,
        slug: skill.id.toString(),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }
  })

  return matches.sort((a, b) => a.startIndex - b.startIndex)
}

/**
 * Detect book mentions in text
 */
export function detectBookMentions(text: string, locale: 'fa' | 'en'): EntityMatch[] {
  const books = getAllBooks(locale)
  const matches: EntityMatch[] = []

  books.forEach((book) => {
    const bookTitle = book.title
    if (!bookTitle) return

    // Create regex pattern for book title (case-insensitive, word boundaries)
    const pattern = new RegExp(`\\b${escapeRegex(bookTitle)}\\b`, 'gi')
    let match: RegExpExecArray | null

    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        type: 'book',
        name: bookTitle,
        slug: getBookSlug(book.title, book.author),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }
  })

  return matches.sort((a, b) => a.startIndex - b.startIndex)
}

/**
 * Detect writer mentions in text
 */
export function detectWriterMentions(text: string, locale: 'fa' | 'en'): EntityMatch[] {
  const writers = getAllWriters(locale)
  const matches: EntityMatch[] = []

  writers.forEach((writer) => {
    const writerName = writer.name
    if (!writerName) return

    // Create regex pattern for writer name (case-insensitive, word boundaries)
    const pattern = new RegExp(`\\b${escapeRegex(writerName)}\\b`, 'gi')
    let match: RegExpExecArray | null

    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        type: 'writer',
        name: writerName,
        slug: writer.slug,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }
  })

  return matches.sort((a, b) => a.startIndex - b.startIndex)
}

/**
 * Detect category mentions in text
 */
export function detectCategoryMentions(text: string, locale: 'fa' | 'en'): EntityMatch[] {
  const categories = getAllCategories(locale)
  const matches: EntityMatch[] = []

  categories.forEach((category) => {
    const categoryName = locale === 'fa' ? category.name.fa : category.name.en
    if (!categoryName) return

    // Create regex pattern for category name (case-insensitive, word boundaries)
    const pattern = new RegExp(`\\b${escapeRegex(categoryName)}\\b`, 'gi')
    let match: RegExpExecArray | null

    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        type: 'category',
        name: categoryName,
        slug: category.id,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }
  })

  return matches.sort((a, b) => a.startIndex - b.startIndex)
}

/**
 * Parse content and detect all entity mentions
 */
export function parseContentForEntities(
  content: string,
  locale: 'fa' | 'en'
): {
  text: string
  entities: EntityMatch[]
} {
  const allMatches: EntityMatch[] = []

  // Detect all entity types
  allMatches.push(...detectSkillMentions(content, locale))
  allMatches.push(...detectBookMentions(content, locale))
  allMatches.push(...detectWriterMentions(content, locale))
  allMatches.push(...detectCategoryMentions(content, locale))

  // Sort by start index
  allMatches.sort((a, b) => a.startIndex - b.startIndex)

  // Remove overlapping matches (keep the longest match)
  const filteredMatches: EntityMatch[] = []
  for (let i = 0; i < allMatches.length; i++) {
    const current = allMatches[i]
    if (!current) continue
    
    let overlap = false

    for (let j = 0; j < filteredMatches.length; j++) {
      const existing = filteredMatches[j]
      if (!existing) continue
      
      if (
        (current.startIndex >= existing.startIndex && current.startIndex < existing.endIndex) ||
        (current.endIndex > existing.startIndex && current.endIndex <= existing.endIndex) ||
        (current.startIndex <= existing.startIndex && current.endIndex >= existing.endIndex)
      ) {
        // Overlap detected - keep the longer match
        if (current.endIndex - current.startIndex > existing.endIndex - existing.startIndex) {
          filteredMatches[j] = current
        }
        overlap = true
        break
      }
    }

    if (!overlap) {
      filteredMatches.push(current)
    }
  }

  return {
    text: content,
    entities: filteredMatches.sort((a, b) => a.startIndex - b.startIndex),
  }
}

/**
 * Convert content with entities to HTML with clickable links
 */
export function convertContentToClickableHTML(
  content: string,
  locale: 'fa' | 'en'
): string {
  const { entities } = parseContentForEntities(content, locale)

  if (entities.length === 0) {
    // No entities found, just format as HTML
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
  }

  // Build HTML with links
  let html = ''
  let lastIndex = 0

  // Determine base path based on locale
  const basePath = locale === 'fa' ? '/fa' : ''

  entities.forEach((entity) => {
    // Add text before entity
    if (entity.startIndex > lastIndex) {
      const beforeText = content.substring(lastIndex, entity.startIndex)
      html += escapeHtml(beforeText)
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
    }

    // Determine URL based on entity type
    let url = ''
    switch (entity.type) {
      case 'skill':
        url = `${basePath}/skills/${entity.slug}`
        break
      case 'book':
        url = `${basePath}/books/${entity.slug}`
        break
      case 'writer':
        url = `${basePath}/writers/${entity.slug}`
        break
      case 'category':
        url = `${basePath}/categories/${entity.slug}`
        break
    }

    // Add entity as clickable link
    const entityText = content.substring(entity.startIndex, entity.endIndex)
    html += `<a href="${url}" class="entity-${entity.type}" title="${entity.name}">${escapeHtml(entityText)}</a>`

    lastIndex = entity.endIndex
  })

  // Add remaining text
  if (lastIndex < content.length) {
    const afterText = content.substring(lastIndex)
    html += escapeHtml(afterText)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
  }

  return html
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return str.replace(/[&<>"']/g, (m) => map[m] || m)
}

