/**
 * Persian video summaries
 * 
 * This file exports all Persian video summaries.
 * Summaries are loaded on-demand for performance.
 * 
 * MANUAL ENTRY - Add summaries directly to this file.
 * Use the VideoSummary interface from ~/types/summaries
 */

import type { VideoSummary } from '~/types/summaries'

/**
 * All Persian video summaries
 * 
 * Structure: Map videoId -> VideoSummary
 */
export const summaries: Record<string, VideoSummary> = {
  "hxnS40NolrA": {
    "videoId": "hxnS40NolrA",
    "summary": "Paste your extended summary text here...\nYou can use multiple lines.\nThe text will be preserved as-is.",
    "wordCount": 17,
    "characterCount": 102,
    "characterCountNoSpaces": 86,
    "locale": "fa",
    "updatedAt": "2025-11-10T19:47:51.716Z",
    "metadata": {
      "keyPoints": [
        "Point 1",
        "Point 2",
        "Point 3"
      ],
      "topics": [
        "longevity",
        "health",
        "harvard"
      ],
      "readingTimeMinutes": 1
    }
  },
  "IFoDg0FJwnk": {
    "videoId": "IFoDg0FJwnk",
    "summary": "Paste your extended summary text here...\nYou can use multiple lines.\nThe text will be preserved as-is.",
    "wordCount": 17,
    "characterCount": 102,
    "characterCountNoSpaces": 86,
    "locale": "fa",
    "updatedAt": "2025-11-10T19:47:51.717Z",
    "metadata": {
      "keyPoints": [
        "Point 1",
        "Point 2"
      ],
      "topics": [
        "brain-health",
        "longevity",
        "peter-attia"
      ],
      "readingTimeMinutes": 1
    }
  }
}

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
  locale: 'fa'
  preview: string
  updatedAt?: string
  keyPoints?: string[]
  topics?: string[]
}> {
  return Object.values(summaries).map((summary) => ({
    videoId: summary.videoId,
    wordCount: summary.wordCount,
    characterCount: summary.characterCount,
    locale: 'fa' as const,
    preview: summary.summary.substring(0, 200),
    updatedAt: summary.updatedAt,
    keyPoints: summary.metadata?.keyPoints,
    topics: summary.metadata?.topics,
  }))
}
