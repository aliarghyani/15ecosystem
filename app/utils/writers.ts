/**
 * Utility functions for accessing and querying writer data
 */

import type { Writer, Book, Video } from '~/types'
import { writers as writersFa } from '~/data/fa/writers'
import { writers as writersEn } from '~/data/en/writers'
import { getAllBooks, getBookSlug } from './books'
import { getSkillById, getSkillsByCategory } from './skills'
import { getAllCategories } from './categories'
import { getVideosByWriterId } from './videos'

/**
 * Generate a URL-friendly slug from writer name
 * @param name - Writer name
 * @returns URL-friendly slug
 */
export function getWriterSlug(name: string): string {
  // For ASCII-only strings, create a readable slug
  if (/^[\x00-\x7F]*$/.test(name)) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || 'writer' // Fallback if empty
  }
  
  // For non-ASCII (Persian, etc.), create a hash-based slug
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const hashStr = Math.abs(hash).toString(36)
  
  // Include ASCII characters if available for readability
  const asciiPart = name
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 20)
    .replace(/^-+|-+$/g, '')
  
  if (asciiPart) {
    return `${asciiPart}-${hashStr}`
  }
  return `writer-${hashStr}`
}

/**
 * Get all writers
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all writers
 */
export function getAllWriters(locale: 'fa' | 'en' = 'fa'): Writer[] {
  return locale === 'fa' ? writersFa : writersEn
}

/**
 * Get a writer by slug
 * @param slug - Writer slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Writer object or undefined if not found
 */
export function getWriterBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Writer | undefined {
  const writers = getAllWriters(locale)
  return writers.find((writer) => writer.slug === slug)
}

/**
 * Get writers by category
 * Writers are organized by category through their linked skills
 * @param category - Category ID ('health' | 'identity' | 'career')
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of writers linked to skills in the specified category
 */
export function getWritersByCategory(
  category: 'health' | 'identity' | 'career',
  locale: 'fa' | 'en' = 'fa'
): Writer[] {
  // Get all skills in this category
  const skillsInCategory = getSkillsByCategory(category, locale)
  const skillIdsInCategory = new Set(skillsInCategory.map((skill) => skill.id))

  // Get all writers and filter by category
  const allWriters = getAllWriters(locale)
  const writersInCategory = allWriters.filter((writer) =>
    writer.skillIds.some((skillId) => skillIdsInCategory.has(skillId))
  )

  return writersInCategory
}

/**
 * Get writers by skill ID
 * @param skillId - Skill ID (1-15)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of writers linked to the specified skill
 */
export function getWritersBySkill(skillId: number, locale: 'fa' | 'en' = 'fa'): Writer[] {
  const allWriters = getAllWriters(locale)
  return allWriters.filter((writer) => writer.skillIds.includes(skillId))
}

/**
 * Get writer's books
 * @param writerSlug - Writer slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of books by this writer
 */
export function getWriterBooks(writerSlug: string, locale: 'fa' | 'en' = 'fa'): Book[] {
  const writer = getWriterBySlug(writerSlug, locale)
  if (!writer) return []

  const allBooks = getAllBooks(locale)
  return allBooks.filter((book) => {
    const bookSlug = getBookSlug(book.title, book.author)
    return writer.books.includes(bookSlug)
  })
}

/**
 * Get writer's related skills
 * @param writerSlug - Writer slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of skills related to this writer
 */
export function getWriterSkills(writerSlug: string, locale: 'fa' | 'en' = 'fa') {
  const writer = getWriterBySlug(writerSlug, locale)
  if (!writer) return []

  return writer.skillIds
    .map((skillId) => getSkillById(skillId, locale))
    .filter((skill) => skill !== undefined)
}

/**
 * Get videos featuring a writer
 * @param writerSlug - Writer slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos featuring the writer
 */
export function getVideosByWriter(
  writerSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  return getVideosByWriterId(writerSlug, locale)
}

