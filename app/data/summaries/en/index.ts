/**
 * English video summaries
 * 
 * This file exports all English video summaries.
 * Summaries are loaded on-demand for performance.
 * 
 * MANUAL ENTRY - Add summaries directly to this file.
 * Use the VideoSummary interface from ~/types/summaries
 */

import type { VideoSummary } from '~/types/summaries'

/**
 * All English video summaries
 * 
 * Structure: Map videoId -> VideoSummary
 */
export const summaries: Record<string, VideoSummary> = {}

/**
 * Get summary by video ID
 * @param videoId - YouTube video ID
 * @returns VideoSummary or undefined if not found
 */
export function getSummary(videoId: string): VideoSummary | undefined {
  return summaries[videoId]
}

/**
 * Get all summary metadata (for listing/searching)
 * @returns Array of SummaryMetadata
 */
export function getAllSummaryMetadata(): Array<{
  videoId: string
  wordCount: number
  characterCount: number
  locale: 'en'
  preview: string
  updatedAt?: string
  keyPoints?: string[]
  topics?: string[]
}> {
  return Object.values(summaries).map((summary) => ({
    videoId: summary.videoId,
    wordCount: summary.wordCount,
    characterCount: summary.characterCount,
    locale: 'en' as const,
    preview: summary.summary.substring(0, 200),
    updatedAt: summary.updatedAt,
    keyPoints: summary.metadata?.keyPoints,
    topics: summary.metadata?.topics,
  }))
}
