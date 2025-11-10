/**
 * Type definitions for video transcript data
 */

/**
 * Video transcript with metadata
 */
export interface VideoTranscript {
  /** Video ID (YouTube video ID) */
  videoId: string
  /** Full transcript text */
  transcript: string
  /** Word count */
  wordCount: number
  /** Character count (including spaces) */
  characterCount: number
  /** Character count (excluding spaces) */
  characterCountNoSpaces: number
  /** Locale ('fa' | 'en') */
  locale: 'fa' | 'en'
  /** Timestamp when transcript was created/updated */
  updatedAt?: string
  /** Additional metadata */
  metadata?: {
    /** Language detection confidence */
    languageConfidence?: number
    /** Speaker identification (if available) */
    speakers?: string[]
    /** Timestamps for each sentence (if available) */
    timestamps?: Array<{
      start: number
      end: number
      text: string
    }>
  }
}

/**
 * Transcript metadata summary (for listing/searching)
 */
export interface TranscriptMetadata {
  /** Video ID */
  videoId: string
  /** Word count */
  wordCount: number
  /** Character count */
  characterCount: number
  /** Locale */
  locale: 'fa' | 'en'
  /** First 200 characters as preview */
  preview: string
  /** Updated timestamp */
  updatedAt?: string
}

