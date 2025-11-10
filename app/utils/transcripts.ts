/**
 * Utility functions for accessing and querying video transcript data
 */

import type { VideoTranscript, TranscriptMetadata } from '~/types/transcripts'
import { transcripts as transcriptsFa, getAllTranscriptMetadata as getAllTranscriptMetadataFa } from '~/data/transcripts/fa'
import { transcripts as transcriptsEn, getAllTranscriptMetadata as getAllTranscriptMetadataEn } from '~/data/transcripts/en'

/**
 * Get transcript by video ID
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns VideoTranscript or undefined if not found
 */
export function getTranscriptByVideoId(
  videoId: string,
  locale: 'fa' | 'en' = 'fa'
): VideoTranscript | undefined {
  const transcripts = locale === 'fa' ? transcriptsFa : transcriptsEn
  return transcripts[videoId]
}

/**
 * Get all transcripts for a locale
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of all VideoTranscript objects
 */
export function getAllTranscripts(locale: 'fa' | 'en' = 'fa'): VideoTranscript[] {
  const transcripts = locale === 'fa' ? transcriptsFa : transcriptsEn
  return Object.values(transcripts)
}

/**
 * Get all transcript metadata (for listing/searching)
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of TranscriptMetadata
 */
export function getAllTranscriptMetadata(locale: 'fa' | 'en' = 'fa'): TranscriptMetadata[] {
  if (locale === 'fa') {
    return getAllTranscriptMetadataFa()
  } else {
    return getAllTranscriptMetadataEn()
  }
}

/**
 * Check if transcript exists for a video
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns true if transcript exists, false otherwise
 */
export function hasTranscript(videoId: string, locale: 'fa' | 'en' = 'fa'): boolean {
  return getTranscriptByVideoId(videoId, locale) !== undefined
}

/**
 * Get transcript word count
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Word count or 0 if transcript not found
 */
export function getTranscriptWordCount(videoId: string, locale: 'fa' | 'en' = 'fa'): number {
  const transcript = getTranscriptByVideoId(videoId, locale)
  return transcript?.wordCount || 0
}

/**
 * Get transcript character count
 * @param videoId - YouTube video ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Character count or 0 if transcript not found
 */
export function getTranscriptCharacterCount(videoId: string, locale: 'fa' | 'en' = 'fa'): number {
  const transcript = getTranscriptByVideoId(videoId, locale)
  return transcript?.characterCount || 0
}

/**
 * Search transcripts by text content
 * @param searchText - Text to search for
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @param caseSensitive - Whether search should be case-sensitive, defaults to false
 * @returns Array of VideoTranscript objects containing the search text
 */
export function searchTranscripts(
  searchText: string,
  locale: 'fa' | 'en' = 'fa',
  caseSensitive: boolean = false
): VideoTranscript[] {
  const transcripts = getAllTranscripts(locale)
  const searchPattern = caseSensitive ? searchText : searchText.toLowerCase()
  
  return transcripts.filter((transcript) => {
    const text = caseSensitive ? transcript.transcript : transcript.transcript.toLowerCase()
    return text.includes(searchPattern)
  })
}

/**
 * Count mentions of a word or phrase in transcripts
 * @param searchText - Word or phrase to count
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @param caseSensitive - Whether search should be case-sensitive, defaults to false
 * @returns Total count of mentions across all transcripts
 */
export function countMentions(
  searchText: string,
  locale: 'fa' | 'en' = 'fa',
  caseSensitive: boolean = false
): number {
  const transcripts = getAllTranscripts(locale)
  const searchPattern = caseSensitive ? searchText : searchText.toLowerCase()
  let totalCount = 0
  
  transcripts.forEach((transcript) => {
    const text = caseSensitive ? transcript.transcript : transcript.transcript.toLowerCase()
    const matches = text.match(new RegExp(searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))
    if (matches) {
      totalCount += matches.length
    }
  })
  
  return totalCount
}

