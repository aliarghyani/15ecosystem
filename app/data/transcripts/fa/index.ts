/**
 * Persian video transcripts
 * 
 * This file exports all Persian video transcripts.
 * Transcripts are loaded on-demand for performance.
 */

import type { VideoTranscript } from '~/types/transcripts'

/**
 * All Persian video transcripts
 * 
 * Structure: Map videoId -> VideoTranscript
 * 
 * Example:
 * {
 *   'hxnS40NolrA': {
 *     videoId: 'hxnS40NolrA',
 *     transcript: '...',
 *     wordCount: 1234,
 *     characterCount: 5678,
 *     characterCountNoSpaces: 4567,
 *     locale: 'fa',
 *     updatedAt: '2024-01-01T00:00:00Z'
 *   }
 * }
 */
export const transcripts: Record<string, VideoTranscript> = {
  // Transcripts will be added here
  // Format: videoId -> VideoTranscript
}

/**
 * Get transcript by video ID
 * @param videoId - YouTube video ID
 * @returns VideoTranscript or undefined if not found
 */
export function getTranscript(videoId: string): VideoTranscript | undefined {
  return transcripts[videoId]
}

/**
 * Get all transcript metadata (for listing/searching)
 * @returns Array of TranscriptMetadata
 */
export function getAllTranscriptMetadata(): Array<{
  videoId: string
  wordCount: number
  characterCount: number
  locale: 'fa'
  preview: string
  updatedAt?: string
}> {
  return Object.values(transcripts).map((transcript) => ({
    videoId: transcript.videoId,
    wordCount: transcript.wordCount,
    characterCount: transcript.characterCount,
    locale: 'fa' as const,
    preview: transcript.transcript.substring(0, 200),
    updatedAt: transcript.updatedAt,
  }))
}

