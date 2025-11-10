/**
 * Utility functions for accessing and querying tag data
 */

import type { Tag, Skill, Book, Writer, Category, Video } from '~/types'
import { tags as tagsFa } from '~/data/fa/tags'
import { tags as tagsEn } from '~/data/en/tags'
import { videos as videosFa } from '~/data/fa/videos'
import { videos as videosEn } from '~/data/en/videos'
import { playlists as playlistsFa } from '~/data/fa/playlists'
import { playlists as playlistsEn } from '~/data/en/playlists'
import { getAllSkills } from './skills'
import { getAllBooks, getBookBySlug } from './books'
import { getAllWriters } from './writers'
import { getAllCategories } from './categories'
import { getAllVideos } from './videos'

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
 * Tag-to-model mapping for inference when explicit tags are not assigned
 * Maps tag slugs to related model identifiers
 */
const TAG_TO_MODEL_MAPPING: Record<string, {
  skillIds?: number[]
  bookTitles?: string[]
  writerSlugs?: string[]
  categoryIds?: string[]
  relatedTags?: string[] // Tags that are related to this tag
}> = {
  'productivity': {
    skillIds: [2], // Focus - essential for productivity
    bookTitles: ['Deep Work', 'Indistractable'], // Productivity-focused books
    writerSlugs: ['cal-newport', 'nir-eyal'], // Productivity writers
    relatedTags: ['focus', 'learning'] // Related tags
  },
  'focus': {
    skillIds: [2], // Focus skill
    bookTitles: ['Deep Work', 'Indistractable'],
    writerSlugs: ['cal-newport', 'nir-eyal'],
    relatedTags: ['productivity']
  },
  'sleep': {
    skillIds: [1], // Quality Sleep skill
    bookTitles: ['Why We Sleep'],
    writerSlugs: ['matthew-walker'],
    relatedTags: ['health', 'wellness']
  },
  'longevity': {
    skillIds: [6], // Healthy Longevity skill
    bookTitles: ['Outlive', 'Lifespan'],
    writerSlugs: ['peter-attia', 'david-sinclair'],
    relatedTags: ['health', 'wellness']
  },
  'health': {
    skillIds: [1, 2, 3, 4, 5, 6], // All health category skills
    categoryIds: ['health'],
    relatedTags: ['wellness', 'longevity', 'sleep']
  },
  'learning': {
    skillIds: [9], // Effective and Continuous Learning
    bookTitles: ['The Art of Learning', 'Mastery'],
    writerSlugs: ['josh-waitzkin', 'robert-greene'],
    relatedTags: ['productivity', 'creativity']
  },
  'creativity': {
    skillIds: [7], // Creativity skill
    bookTitles: ['Steal Like an Artist'],
    writerSlugs: ['austin-kleon'],
    relatedTags: ['learning']
  },
  'mindfulness': {
    skillIds: [4], // Stress Management (includes mindfulness)
    bookTitles: ['Waking Up', 'Good Anxiety'],
    writerSlugs: ['sam-harris', 'wendy-suzuki'],
    relatedTags: ['health', 'wellness']
  },
  'wellness': {
    skillIds: [1, 3, 4, 5, 6], // Health-related skills
    relatedTags: ['health', 'longevity', 'sleep']
  },
  'career': {
    skillIds: [13, 14, 15], // Career category skills
    categoryIds: ['career'],
    relatedTags: ['learning', 'productivity']
  },
  'ai': {
    skillIds: [14], // AI Literacy
    bookTitles: ['The Coming Wave'],
    writerSlugs: ['mustafa-suleyman'],
    relatedTags: ['career', 'learning']
  }
}

/**
 * Get content by tag with smart inference
 * @param tagSlug - Tag slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Object containing all content with this tag
 */
export function getContentByTag(tagSlug: string, locale: 'fa' | 'en' = 'fa'): {
  skills: Skill[]
  books: Book[]
  writers: Writer[]
  categories: Category[]
  videos: Video[]
} {
  const allSkills = getAllSkills(locale)
  const allBooks = getAllBooks(locale)
  const allWriters = getAllWriters(locale)
  const allCategories = getAllCategories(locale)
  const allVideos = getAllVideos(locale)
  
  // Get explicit tags first
  const explicitSkills = allSkills.filter((skill) => skill.tags?.includes(tagSlug))
  const explicitBooks = allBooks.filter((book) => book.tags?.includes(tagSlug))
  const explicitWriters = allWriters.filter((writer) => writer.tags?.includes(tagSlug))
  const explicitCategories = allCategories.filter((category) => category.tags?.includes(tagSlug))
  const explicitVideos = allVideos.filter((video) => video.tags?.includes(tagSlug))
  
  // Get inferred content from mapping
  const mapping = TAG_TO_MODEL_MAPPING[tagSlug] || {}
  const inferredSkills = mapping.skillIds 
    ? allSkills.filter((skill) => mapping.skillIds!.includes(skill.id))
    : []
  const inferredBooks = mapping.bookTitles
    ? allBooks.filter((book) => mapping.bookTitles!.includes(book.title))
    : []
  const inferredWriters = mapping.writerSlugs
    ? allWriters.filter((writer) => mapping.writerSlugs!.includes(writer.slug))
    : []
  const inferredCategories = mapping.categoryIds
    ? allCategories.filter((category) => mapping.categoryIds!.includes(category.id))
    : []
  
  // Also check related tags for videos (videos already have tags assigned)
  const relatedTagVideos = mapping.relatedTags
    ? allVideos.filter((video) => 
        video.tags && mapping.relatedTags!.some(relatedTag => video.tags!.includes(relatedTag))
      )
    : []
  
  // Combine explicit and inferred, removing duplicates
  const combineUnique = <T>(arr1: T[], arr2: T[], keyFn: (item: T) => any): T[] => {
    const seen = new Set()
    const result: T[] = []
    for (const item of [...arr1, ...arr2]) {
      const key = keyFn(item)
      if (!seen.has(key)) {
        seen.add(key)
        result.push(item)
      }
    }
    return result
  }
  
  return {
    skills: combineUnique(explicitSkills, inferredSkills, (s) => s.id),
    books: combineUnique(explicitBooks, inferredBooks, (b) => `${b.title}-${b.author}`),
    writers: combineUnique(explicitWriters, inferredWriters, (w) => w.slug),
    categories: combineUnique(explicitCategories, inferredCategories, (c) => c.id),
    videos: combineUnique(explicitVideos, relatedTagVideos, (v) => v.id)
  }
}

/**
 * Get tags for a video
 * @param videoId - Video ID (YouTube video ID)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of tags for this video
 */
export function getTagsForVideo(videoId: string, locale: 'fa' | 'en' = 'fa'): Tag[] {
  const videos = locale === 'fa' ? videosFa : videosEn
  const video = videos.find((v) => v.id === videoId)
  
  if (!video || !video.tags || video.tags.length === 0) return []
  
  const allTags = getAllTags(locale)
  return video.tags
    .map((tagSlug: string) => allTags.find((tag) => tag.slug === tagSlug))
    .filter((tag) => tag !== undefined) as Tag[]
}

/**
 * Get tags for a playlist
 * @param playlistId - Playlist ID (YouTube playlist ID)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of tags for this playlist
 */
export function getTagsForPlaylist(playlistId: string, locale: 'fa' | 'en' = 'fa'): Tag[] {
  const playlists = locale === 'fa' ? playlistsFa : playlistsEn
  const playlist = playlists.find((p) => p.id === playlistId)
  
  if (!playlist || !playlist.tags || playlist.tags.length === 0) return []
  
  const allTags = getAllTags(locale)
  return playlist.tags
    .map((tagSlug: string) => allTags.find((tag) => tag.slug === tagSlug))
    .filter((tag) => tag !== undefined) as Tag[]
}

/**
 * Get count of items for a tag
 * @param tagSlug - Tag slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Total count of items with this tag
 */
export function getTagCount(tagSlug: string, locale: 'fa' | 'en' = 'fa'): number {
  const content = getContentByTag(tagSlug, locale)
  return content.skills.length + content.books.length + content.writers.length + content.categories.length + content.videos.length
}

