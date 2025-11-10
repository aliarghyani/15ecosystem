/**
 * Utility functions for accessing and querying playlist data
 */

import type { Playlist } from '~/types'
// Import will be added when data files are created
// import { playlists as playlistsFa } from '~/data/fa/playlists'
// import { playlists as playlistsEn } from '~/data/en/playlists'

/**
 * Generate a URL-friendly slug from playlist title
 * @param playlist - Playlist object
 * @param locale - Locale to use for slug generation
 * @returns URL-friendly slug
 */
export function generatePlaylistSlug(playlist: Playlist, locale: 'fa' | 'en' = 'fa'): string {
  const title = playlist.title[locale] || playlist.title.fa || playlist.title.en || 'playlist'
  
  // For ASCII-only strings, create a readable slug
  if (/^[\x00-\x7F]*$/.test(title)) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || playlist.youtubeId // Fallback to playlist ID if empty
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
  return `${playlist.youtubeId}-${hashStr}`
}

/**
 * Get all playlists
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all playlists
 */
export function getAllPlaylists(locale: 'fa' | 'en' = 'fa'): Playlist[] {
  // TODO: Import and return playlists when data files are created
  // return locale === 'fa' ? playlistsFa : playlistsEn
  return []
}

/**
 * Get playlist by slug
 * @param slug - Playlist slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Playlist object or undefined if not found
 */
export function getPlaylistBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Playlist | undefined {
  const playlists = getAllPlaylists(locale)
  return playlists.find((playlist) => generatePlaylistSlug(playlist, locale) === slug)
}

/**
 * Get playlists by skill ID
 * @param skillId - Skill ID (1-15)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of playlists related to the skill
 */
export function getPlaylistsBySkillId(skillId: number, locale: 'fa' | 'en' = 'fa'): Playlist[] {
  const playlists = getAllPlaylists(locale)
  return playlists.filter((playlist) => playlist.skillIds.includes(skillId))
}

/**
 * Get playlists by category ID
 * @param categoryId - Category ID ('health' | 'identity' | 'career')
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of playlists in the category
 */
export function getPlaylistsByCategoryId(
  categoryId: string,
  locale: 'fa' | 'en' = 'fa'
): Playlist[] {
  const playlists = getAllPlaylists(locale)
  return playlists.filter((playlist) => playlist.categoryIds.includes(categoryId))
}

