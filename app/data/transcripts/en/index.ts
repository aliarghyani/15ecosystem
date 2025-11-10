/**
 * English video transcripts
 * 
 * This file exports all English video transcripts.
 * Transcripts are loaded on-demand for performance.
 * 
 * AUTO-GENERATED from YAML files in app/data/transcripts/en/
 * Files are named by video title (Persian/English).
 * DO NOT EDIT MANUALLY - Regenerate using: pnpm generate:transcripts
 */

import type { VideoTranscript } from '~/types/transcripts'

/**
 * All English video transcripts
 * 
 * Structure: Map videoId -> VideoTranscript
 */
export const transcripts: Record<string, VideoTranscript> = {}

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
  locale: 'en'
  preview: string
  updatedAt?: string
}> {
  return Object.values(transcripts).map((transcript) => ({
    videoId: transcript.videoId,
    wordCount: transcript.wordCount,
    characterCount: transcript.characterCount,
    locale: 'en' as const,
    preview: transcript.transcript.substring(0, 200),
    updatedAt: transcript.updatedAt,
  }))
}
