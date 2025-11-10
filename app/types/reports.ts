/**
 * Type definitions for analysis reports
 */

import type { VideoTranscript } from './transcripts'

/**
 * Word frequency report
 */
export interface WordFrequencyReport {
  /** The word */
  word: string
  /** Number of occurrences */
  count: number
  /** Percentage of total words */
  percentage: number
  /** Total word count across all analyzed transcripts */
  totalWords: number
  /** Video IDs where this word appears */
  videoIds: string[]
  /** Number of videos containing this word */
  videoCount: number
}

/**
 * Mention report for a specific term
 */
export interface MentionReport {
  /** The search term */
  term: string
  /** Total number of occurrences across all transcripts */
  count: number
  /** Video IDs where term appears */
  videoIds: string[]
  /** Number of videos containing this term */
  videoCount: number
  /** Detailed mentions per video */
  videoMentions: Array<{
    videoId: string
    count: number
    positions: number[]
    contexts?: string[]
  }>
  /** Timestamps if available */
  timestamps?: Array<{
    videoId: string
    timestamp: number
    text: string
  }>
}

/**
 * Trend report showing term frequency over time
 */
export interface TrendReport {
  /** The search term */
  term: string
  /** Data points over time */
  dataPoints: Array<{
    /** Video ID */
    videoId: string
    /** Date (video upload date or transcript date) */
    date: string
    /** Count in this video */
    count: number
    /** Cumulative count up to this point */
    cumulativeCount: number
  }>
  /** Total count across all videos */
  totalCount: number
  /** Trend direction ('increasing' | 'decreasing' | 'stable') */
  trend: 'increasing' | 'decreasing' | 'stable'
  /** Percentage change from first to last data point */
  changePercentage: number
}

/**
 * Comparison report comparing multiple terms
 */
export interface ComparisonReport {
  /** Terms being compared */
  terms: string[]
  /** Comparison data */
  comparisons: Array<{
    /** The term */
    term: string
    /** Total count */
    count: number
    /** Percentage of total mentions */
    percentage: number
    /** Video IDs where term appears */
    videoIds: string[]
    /** Number of videos containing this term */
    videoCount: number
  }>
  /** Total mentions across all terms */
  totalMentions: number
  /** Date range of analysis */
  dateRange?: {
    start: string
    end: string
  }
}

/**
 * Top words report
 */
export interface TopWordsReport {
  /** Top N words */
  topWords: WordFrequencyReport[]
  /** Total unique words analyzed */
  totalUniqueWords: number
  /** Total word count */
  totalWords: number
  /** Analysis date range */
  dateRange?: {
    start: string
    end: string
  }
  /** Video IDs analyzed */
  videoIds: string[]
  /** Number of videos analyzed */
  videoCount: number
}

/**
 * Category-based analysis report
 */
export interface CategoryAnalysisReport {
  /** Category ID */
  categoryId: string
  /** Category name */
  categoryName: string
  /** Top words in this category */
  topWords: WordFrequencyReport[]
  /** Total word count in category */
  totalWords: number
  /** Video IDs in this category */
  videoIds: string[]
  /** Number of videos in category */
  videoCount: number
}

/**
 * Skill-based analysis report
 */
export interface SkillAnalysisReport {
  /** Skill ID */
  skillId: number
  /** Skill name */
  skillName: string
  /** Top words related to this skill */
  topWords: WordFrequencyReport[]
  /** Total word count for this skill */
  totalWords: number
  /** Video IDs related to this skill */
  videoIds: string[]
  /** Number of videos related to this skill */
  videoCount: number
}

/**
 * Report generation options
 */
export interface ReportOptions {
  /** Locale ('fa' | 'en') */
  locale?: 'fa' | 'en'
  /** Include stop words (default: false) */
  includeStopWords?: boolean
  /** Minimum word length (default: 2) */
  minWordLength?: number
  /** Case sensitive search (default: false) */
  caseSensitive?: boolean
  /** Limit number of results */
  limit?: number
  /** Date range filter */
  dateRange?: {
    start: string
    end: string
  }
  /** Video IDs to include (if empty, includes all) */
  videoIds?: string[]
  /** Category IDs to include */
  categoryIds?: string[]
  /** Skill IDs to include */
  skillIds?: number[]
}

/**
 * Base report metadata
 */
export interface ReportMetadata {
  /** Report type */
  type: 'word-frequency' | 'mention' | 'trend' | 'comparison' | 'top-words' | 'category' | 'skill'
  /** Report ID */
  id: string
  /** Report title */
  title: string
  /** Report description */
  description?: string
  /** Generated timestamp */
  generatedAt: string
  /** Locale */
  locale: 'fa' | 'en'
  /** Number of transcripts analyzed */
  transcriptCount: number
  /** Total word count analyzed */
  totalWords: number
  /** Report options used */
  options: ReportOptions
}

