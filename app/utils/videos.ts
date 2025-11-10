/**
 * Utility functions for accessing and querying video data
 */

import type { Video } from '~/types'
import { videos as videosFa } from '~/data/fa/videos'
import { videos as videosEn } from '~/data/en/videos'

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://youtu.be/{VIDEO_ID}
 * - https://www.youtube.com/watch?v={VIDEO_ID}
 * - https://youtube.com/watch?v={VIDEO_ID}
 * - https://www.youtube.com/embed/{VIDEO_ID}
 * @param url - YouTube URL
 * @returns Video ID or null if invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  // Pattern 1: youtu.be/{VIDEO_ID}
  const youtuBeMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1]
  }

  // Pattern 2: youtube.com/watch?v={VIDEO_ID}
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/)
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1]
  }

  // Pattern 3: youtube.com/embed/{VIDEO_ID}
  const embedMatch = url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1]
  }

  return null
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality ('default' | 'medium' | 'high' | 'maxres')
 * @returns YouTube thumbnail URL
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'
): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  }

  const qualityKey = qualityMap[quality] || 'hqdefault'
  return `https://img.youtube.com/vi/${videoId}/${qualityKey}.jpg`
}

/**
 * Generate a URL-friendly slug from video title
 * @param video - Video object
 * @param locale - Locale to use for slug generation
 * @returns URL-friendly slug
 */
export function generateVideoSlug(video: Video, locale: 'fa' | 'en' = 'fa'): string {
  const title = video.title[locale] || video.title.fa || video.title.en || 'video'
  
  // For ASCII-only strings, create a readable slug
  if (/^[\x00-\x7F]*$/.test(title)) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || video.youtubeId // Fallback to video ID if empty
  }
  
  // For non-ASCII (Persian, etc.), create a hash-based slug
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const hashStr = Math.abs(hash).toString(36)
  
  // Include ASCII characters if available for readability
  const asciiPart = title
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 20)
    .replace(/^-+|-+$/g, '')
  
  if (asciiPart) {
    return `${asciiPart}-${hashStr}`
  }
  return `${video.youtubeId}-${hashStr}`
}

/**
 * Get all videos
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all videos
 */
export function getAllVideos(locale: 'fa' | 'en' = 'fa'): Video[] {
  return locale === 'fa' ? videosFa : videosEn
}

/**
 * Get video by slug
 * @param slug - Video slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Video object or undefined if not found
 */
export function getVideoBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Video | undefined {
  const videos = getAllVideos(locale)
  return videos.find((video) => generateVideoSlug(video, locale) === slug)
}

/**
 * Get videos by skill ID
 * @param skillId - Skill ID (1-15)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos related to the skill
 */
export function getVideosBySkillId(skillId: number, locale: 'fa' | 'en' = 'fa'): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => video.skillIds.includes(skillId))
}

/**
 * Get videos by category ID
 * @param categoryId - Category ID ('health' | 'identity' | 'career')
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos in the category
 */
export function getVideosByCategoryId(
  categoryId: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => video.categoryIds.includes(categoryId))
}

/**
 * Get videos by playlist ID
 * @param playlistId - Playlist ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos in the playlist
 */
export function getVideosByPlaylistId(
  playlistId: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => video.playlistId === playlistId)
}

/**
 * Validate skill ID (must be between 1 and 15)
 * @param skillId - Skill ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidSkillId(skillId: number): boolean {
  return Number.isInteger(skillId) && skillId >= 1 && skillId <= 15
}

/**
 * Validate category ID (must be 'health', 'identity', or 'career')
 * @param categoryId - Category ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidCategoryId(categoryId: string): boolean {
  return ['health', 'identity', 'career'].includes(categoryId)
}

/**
 * Get videos by writer ID
 * @param writerId - Writer slug/ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos featuring the writer
 */
export function getVideosByWriterId(
  writerId: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => video.writerId === writerId)
}

/**
 * Get videos by book slug
 * @param bookSlug - Book slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos mentioning the book
 */
export function getVideosByBookSlug(
  bookSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => 
    video.bookIds && video.bookIds.includes(bookSlug)
  )
}

