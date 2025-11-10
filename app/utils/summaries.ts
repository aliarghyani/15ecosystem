/**
 * Utility functions for accessing and querying video summary data
 */

import type { VideoSummary, SummaryMetadata } from '~/types/summaries'
import { summaries as summariesFa, getAllSummaryMetadata as getAllSummaryMetadataFa } from '~/data/summaries/fa'
import { summaries as summariesEn, getAllSummaryMetadata as getAllSummaryMetadataEn } from '~/data/summaries/en'

/**
 * Get summary by video ID
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns VideoSummary or undefined if not found
 */
export function getSummaryByVideoId(
  videoId: string,
  locale: 'fa' | 'en' = 'fa'
): VideoSummary | undefined {
  const summaries = locale === 'fa' ? summariesFa : summariesEn
  return summaries[videoId]
}

/**
 * Get all summaries for a locale
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all VideoSummary objects
 */
export function getAllSummaries(locale: 'fa' | 'en' = 'fa'): VideoSummary[] {
  const summaries = locale === 'fa' ? summariesFa : summariesEn
  return Object.values(summaries)
}

/**
 * Get all summary metadata (for listing/searching)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of SummaryMetadata
 */
export function getAllSummaryMetadata(locale: 'fa' | 'en' = 'fa'): SummaryMetadata[] {
  if (locale === 'fa') {
    return getAllSummaryMetadataFa()
  } else {
    return getAllSummaryMetadataEn()
  }
}

/**
 * Check if summary exists for a video
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns true if summary exists, false otherwise
 */
export function hasSummary(videoId: string, locale: 'fa' | 'en' = 'fa'): boolean {
  return getSummaryByVideoId(videoId, locale) !== undefined
}

/**
 * Get summary word count
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Word count or 0 if summary not found
 */
export function getSummaryWordCount(videoId: string, locale: 'fa' | 'en' = 'fa'): number {
  const summary = getSummaryByVideoId(videoId, locale)
  return summary?.wordCount || 0
}

/**
 * Get summary character count
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Character count or 0 if summary not found
 */
export function getSummaryCharacterCount(videoId: string, locale: 'fa' | 'en' = 'fa'): number {
  const summary = getSummaryByVideoId(videoId, locale)
  return summary?.characterCount || 0
}

/**
 * Get summary reading time estimate
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Reading time in minutes or 0 if summary not found
 */
export function getSummaryReadingTime(videoId: string, locale: 'fa' | 'en' = 'fa'): number {
  const summary = getSummaryByVideoId(videoId, locale)
  return summary?.metadata?.readingTimeMinutes || 0
}

/**
 * Get summary key points
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of key points or empty array if not found
 */
export function getSummaryKeyPoints(videoId: string, locale: 'fa' | 'en' = 'fa'): string[] {
  const summary = getSummaryByVideoId(videoId, locale)
  return summary?.metadata?.keyPoints || []
}

/**
 * Get summary topics
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of topics or empty array if not found
 */
export function getSummaryTopics(videoId: string, locale: 'fa' | 'en' = 'fa'): string[] {
  const summary = getSummaryByVideoId(videoId, locale)
  return summary?.metadata?.topics || []
}

/**
 * Search summaries by text content
 * @param searchText - Text to search for
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @param caseSensitive - Whether search should be case-sensitive, defaults to false
 * @returns Array of VideoSummary objects containing the search text
 */
export function searchSummaries(
  searchText: string,
  locale: 'fa' | 'en' = 'fa',
  caseSensitive: boolean = false
): VideoSummary[] {
  const summaries = getAllSummaries(locale)
  const searchPattern = caseSensitive ? searchText : searchText.toLowerCase()
  
  return summaries.filter((summary) => {
    const text = caseSensitive ? summary.summary : summary.summary.toLowerCase()
    return text.includes(searchPattern)
  })
}

/**
 * Calculate reading time from word count
 * Average reading speed: 200-250 words per minute
 * @param wordCount - Number of words
 * @param wordsPerMinute - Reading speed (default: 225)
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(wordCount: number, wordsPerMinute: number = 225): number {
  return Math.ceil(wordCount / wordsPerMinute)
}

