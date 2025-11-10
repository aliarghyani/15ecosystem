/**
 * Utility functions for accessing and querying book data
 */

import type { Book, Writer, Video } from '~/types'
import { books as booksFa } from '~/data/fa/books'
import { books as booksEn } from '~/data/en/books'
import { getSkillById, getSkillsByCategory } from './skills'
import { getAllWriters } from './writers'
import { getVideosByBookSlug } from './videos'

/**
 * Get all books
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all books
 */
export function getAllBooks(locale: 'fa' | 'en' = 'fa'): Book[] {
  return locale === 'fa' ? booksFa : booksEn
}

/**
 * Get books by category
 * Books are organized by category through their linked skills
 * @param category - Category ID ('health' | 'identity' | 'career')
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of books linked to skills in the specified category
 */
export function getBooksByCategory(
  category: 'health' | 'identity' | 'career',
  locale: 'fa' | 'en' = 'fa'
): Book[] {
  // Get all skills in this category
  const skillsInCategory = getSkillsByCategory(category, locale)
  const skillIdsInCategory = new Set(skillsInCategory.map((skill) => skill.id))

  // Get all books and filter by category
  const allBooks = getAllBooks(locale)
  const booksInCategory = allBooks.filter((book) =>
    book.skillIds.some((skillId) => skillIdsInCategory.has(skillId))
  )

  // Deduplicate books (in case a book is linked to multiple skills in the same category)
  const uniqueBooks = new Map<string, Book>()
  for (const book of booksInCategory) {
    const key = `${book.title}|${book.author}`
    if (!uniqueBooks.has(key)) {
      uniqueBooks.set(key, book)
    }
  }

  return Array.from(uniqueBooks.values())
}

/**
 * Get books by skill ID
 * @param skillId - Skill ID (1-15)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of books linked to the specified skill
 */
export function getBooksBySkillId(skillId: number, locale: 'fa' | 'en' = 'fa'): Book[] {
  const allBooks = getAllBooks(locale)
  return allBooks.filter((book) => book.skillIds.includes(skillId))
}

/**
 * Get a book by title
 * @param title - Book title (case-insensitive partial match)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Book object or undefined if not found
 */
export function getBookByTitle(title: string, locale: 'fa' | 'en' = 'fa'): Book | undefined {
  const allBooks = getAllBooks(locale)
  const searchTitle = title.toLowerCase().trim()
  return allBooks.find(
    (book) => book.title.toLowerCase().includes(searchTitle) || searchTitle.includes(book.title.toLowerCase())
  )
}

/**
 * Get books by author
 * @param author - Author name (case-insensitive partial match)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of books by the specified author
 */
export function getBooksByAuthor(author: string, locale: 'fa' | 'en' = 'fa'): Book[] {
  const allBooks = getAllBooks(locale)
  const searchAuthor = author.toLowerCase().trim()
  return allBooks.filter(
    (book) =>
      book.author.toLowerCase().includes(searchAuthor) || searchAuthor.includes(book.author.toLowerCase())
  )
}

/**
 * Get unique authors from all books
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of unique author names
 */
export function getAllAuthors(locale: 'fa' | 'en' = 'fa'): string[] {
  const allBooks = getAllBooks(locale)
  const authors = new Set(allBooks.map((book) => book.author))
  return Array.from(authors).sort()
}

/**
 * Verify book-skill relationship integrity
 * Checks that all book skillIds reference valid skills
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Object with validation results
 */
export function verifyBookSkillRelationships(locale: 'fa' | 'en' = 'fa'): {
  valid: boolean
  errors: Array<{ book: Book; invalidSkillIds: number[] }>
} {
  const allBooks = getAllBooks(locale)
  const errors: Array<{ book: Book; invalidSkillIds: number[] }> = []

  for (const book of allBooks) {
    const invalidSkillIds = book.skillIds.filter((skillId) => {
      const skill = getSkillById(skillId, locale)
      return !skill
    })

    if (invalidSkillIds.length > 0) {
      errors.push({ book, invalidSkillIds })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate a URL-friendly slug from book title and author
 * Uses a hash-based approach for non-ASCII characters (like Persian)
 * @param title - Book title
 * @param author - Book author
 * @returns URL-friendly slug
 */
export function getBookSlug(title: string, author: string): string {
  // Create a unique identifier from title and author
  const combined = `${title}|${author}`
  
  // For ASCII-only strings, create a readable slug
  if (/^[\x00-\x7F]*$/.test(combined)) {
    const slug = combined
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || 'book' // Fallback if empty
  }
  
  // For non-ASCII (Persian, etc.), create a hash-based slug
  // Simple hash function for consistent slug generation
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value and convert to base36 for shorter slugs
  const hashStr = Math.abs(hash).toString(36)
  
  // Also include first few ASCII characters if available for readability
  const asciiPart = combined
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 20)
    .replace(/^-+|-+$/g, '')
  
  // Ensure we always return a valid slug
  if (asciiPart) {
    return `${asciiPart}-${hashStr}`
  }
  // If no ASCII part, use hash with prefix
  return `book-${hashStr}`
}

/**
 * Get a book by slug
 * @param slug - Book slug (generated from title and author)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Book object or undefined if not found
 */
export function getBookBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Book | undefined {
  const allBooks = getAllBooks(locale)
  return allBooks.find((book) => getBookSlug(book.title, book.author) === slug)
}

/**
 * Get writers who wrote a book
 * Finds writers whose books array includes this book slug
 * @param bookSlug - Book slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of writers who wrote this book
 */
export function getWritersByBook(
  bookSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Writer[] {
  const allWriters = getAllWriters(locale)
  return allWriters.filter((writer) => writer.books.includes(bookSlug))
}

/**
 * Get videos mentioning a book
 * @param bookSlug - Book slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos mentioning the book
 */
export function getVideosByBook(
  bookSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  return getVideosByBookSlug(bookSlug, locale)
}

