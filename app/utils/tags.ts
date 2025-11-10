/**
 * Utility functions for accessing and querying tag data
 */

import type { Tag, Skill, Book, Writer, Category } from '~/types'
import { tags as tagsFa } from '~/data/fa/tags'
import { tags as tagsEn } from '~/data/en/tags'
import { getAllSkills } from './skills'
import { getAllBooks, getBookBySlug } from './books'
import { getAllWriters } from './writers'
import { getAllCategories } from './categories'

/**
 * Generate a URL-friendly slug from tag name
 * @param name - Tag name
 * @returns URL-friendly slug
 */
export function getTagSlug(name: string): string {
  // For ASCII-only strings, create a readable slug
  if (/^[\x00-\x7F]*$/.test(name)) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || 'tag' // Fallback if empty
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
  return `tag-${hashStr}`
}

/**
 * Get all tags
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all tags
 */
export function getAllTags(locale: 'fa' | 'en' = 'fa'): Tag[] {
  return locale === 'fa' ? tagsFa : tagsEn
}

/**
 * Get a tag by slug
 * @param slug - Tag slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Tag object or undefined if not found
 */
export function getTagBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Tag | undefined {
  const tags = getAllTags(locale)
  return tags.find((tag) => tag.slug === slug)
}

/**
 * Get tags for a skill
 * @param skillId - Skill ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of tags for this skill
 */
export function getTagsForSkill(skillId: number, locale: 'fa' | 'en' = 'fa'): Tag[] {
  const skill = getAllSkills(locale).find((s) => s.id === skillId)
  if (!skill || !skill.tags || skill.tags.length === 0) return []
  
  const allTags = getAllTags(locale)
  return skill.tags
    .map((tagSlug) => allTags.find((tag) => tag.slug === tagSlug))
    .filter((tag) => tag !== undefined) as Tag[]
}

/**
 * Get tags for a book
 * @param bookSlug - Book slug (generated from title and author)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of tags for this book
 */
export function getTagsForBook(bookSlug: string, locale: 'fa' | 'en' = 'fa'): Tag[] {
  const book = getBookBySlug(bookSlug, locale)
  
  if (!book || !book.tags || book.tags.length === 0) return []
  
  const allTags = getAllTags(locale)
  return book.tags
    .map((tagSlug) => allTags.find((tag) => tag.slug === tagSlug))
    .filter((tag) => tag !== undefined) as Tag[]
}

/**
 * Get tags for a writer
 * @param writerSlug - Writer slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of tags for this writer
 */
export function getTagsForWriter(writerSlug: string, locale: 'fa' | 'en' = 'fa'): Tag[] {
  const writer = getAllWriters(locale).find((w) => w.slug === writerSlug)
  if (!writer || !writer.tags || writer.tags.length === 0) return []
  
  const allTags = getAllTags(locale)
  return writer.tags
    .map((tagSlug) => allTags.find((tag) => tag.slug === tagSlug))
    .filter((tag) => tag !== undefined) as Tag[]
}

/**
 * Get tags for a category
 * @param categoryId - Category ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of tags for this category
 */
export function getTagsForCategory(categoryId: string, locale: 'fa' | 'en' = 'fa'): Tag[] {
  const category = getAllCategories(locale).find((c) => c.id === categoryId)
  if (!category || !category.tags || category.tags.length === 0) return []
  
  const allTags = getAllTags(locale)
  return category.tags
    .map((tagSlug) => allTags.find((tag) => tag.slug === tagSlug))
    .filter((tag) => tag !== undefined) as Tag[]
}

/**
 * Get content by tag
 * @param tagSlug - Tag slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Object containing all content with this tag
 */
export function getContentByTag(tagSlug: string, locale: 'fa' | 'en' = 'fa'): {
  skills: Skill[]
  books: Book[]
  writers: Writer[]
  categories: Category[]
} {
  const allSkills = getAllSkills(locale)
  const allBooks = getAllBooks(locale)
  const allWriters = getAllWriters(locale)
  const allCategories = getAllCategories(locale)
  
  return {
    skills: allSkills.filter((skill) => skill.tags?.includes(tagSlug)),
    books: allBooks.filter((book) => book.tags?.includes(tagSlug)),
    writers: allWriters.filter((writer) => writer.tags?.includes(tagSlug)),
    categories: allCategories.filter((category) => category.tags?.includes(tagSlug))
  }
}

/**
 * Get count of items for a tag
 * @param tagSlug - Tag slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Total count of items with this tag
 */
export function getTagCount(tagSlug: string, locale: 'fa' | 'en' = 'fa'): number {
  const content = getContentByTag(tagSlug, locale)
  return content.skills.length + content.books.length + content.writers.length + content.categories.length
}

