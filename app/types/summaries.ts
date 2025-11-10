/**
 * Type definitions for video summary data
 */

/**
 * Video summary with metadata
 */
export interface VideoSummary {
  /** Video ID (YouTube video ID) */
  videoId: string
  /** Extended summary text */
  summary: string
  /** Word count */
  wordCount: number
  /** Character count (including spaces) */
  characterCount: number
  /** Character count (excluding spaces) */
  characterCountNoSpaces: number
  /** Locale ('fa' | 'en') */
  locale: 'fa' | 'en'
  /** Timestamp when summary was created/updated */
  updatedAt?: string
  /** Additional metadata */
  metadata?: {
    /** Key points extracted from summary */
    keyPoints?: string[]
    /** Main topics covered */
    topics?: string[]
    /** Summary reading time estimate (in minutes) */
    readingTimeMinutes?: number
    /** Summary quality score (0-1) */
    qualityScore?: number
  }
}

/**
 * Summary metadata summary (for listing/searching)
 */
export interface SummaryMetadata {
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
  /** Key points (if available) */
  keyPoints?: string[]
  /** Topics (if available) */
  topics?: string[]
}

