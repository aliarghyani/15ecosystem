// Type definitions for 15ecosystem

export interface Skill {
  id: number
  name: {
    en: string
    fa: string
  }
  category: 'health' | 'identity' | 'career'
  whyItMatters: {
    en: string
    fa: string
  }
  howTo: {
    en: string
    fa: string
  }
  books: Book[]
  relatedSkills?: number[]
  tags?: string[] // Array of tag slugs
}

export interface Category {
  id: string
  name: {
    en: string
    fa: string
  }
  description: {
    en: string
    fa: string
  }
  skills: number[]
  tags?: string[] // Array of tag slugs
}

export interface Book {
  title: string
  author: string
  skillIds: number[]
  tags?: string[] // Array of tag slugs
}

export interface Writer {
  id: string // Unique identifier (slug-based)
  name: string // Full name
  slug: string // URL-friendly identifier
  photo?: string // URL to photo/avatar image
  tagline?: {
    en: string
    fa: string
  }
  biography: {
    en: string // Markdown or rich text
    fa: string
  }
  books: string[] // Array of book slugs
  skillIds: number[] // Skills related to this writer
  categoryIds: string[] // Categories this writer belongs to
  links: {
    youtube?: string
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    other?: Array<{ label: string; url: string }>
  }
  tags?: string[] // Array of tag slugs
}

export interface Tag {
  id: string // Unique identifier (slug-based)
  name: {
    en: string
    fa: string
  }
  slug: string // URL-friendly identifier
  description?: {
    en: string
    fa: string
  }
  color?: string // Hex color for visual distinction (optional, will use Nuxt UI colors)
  icon?: string // Optional icon identifier
  category?: 'skill' | 'book' | 'writer' | 'category' | 'general' // Tag category
}

export interface Video {
  id: string // Unique video identifier (YouTube video ID)
  youtubeUrl: string // Full YouTube URL (e.g., https://youtu.be/hxnS40NolrA?si=...)
  youtubeId: string // YouTube video ID (extracted from URL, e.g., hxnS40NolrA)
  title: {
    fa: string
    en: string
  }
  description?: {
    fa: string
    en: string
  }
  thumbnail: string // YouTube thumbnail URL (can be generated from video ID)
  duration?: number // Optional duration in seconds
  publishedAt?: string // Optional ISO date string
  viewCount?: number // Optional view count
  playlistId?: string // Optional playlist ID
  skillIds: number[] // Related skill IDs (1-15)
  categoryIds: string[] // Related category IDs (health, identity, career)
  tags: string[] // Tags for categorization (array of tag slugs)
  writerId?: string // Optional writer ID if video features a writer
  bookIds?: string[] // Optional related book IDs
  channelId: string // YouTube channel ID (KhashayarTalks)
  channelName: string // Channel name
}

// Export transcript types
export type { VideoTranscript, TranscriptMetadata } from './transcripts'

// Export report types
export type {
  WordFrequencyReport,
  MentionReport,
  TrendReport,
  ComparisonReport,
  TopWordsReport,
  CategoryAnalysisReport,
  SkillAnalysisReport,
  ReportOptions,
  ReportMetadata
} from './reports'

export interface Playlist {
  id: string // Unique playlist identifier (YouTube playlist ID)
  youtubeId: string // YouTube playlist ID
  title: {
    fa: string
    en: string
  }
  description?: {
    fa: string
    en: string
  }
  thumbnail: string // Playlist thumbnail URL
  videoCount: number // Number of videos in playlist
  videoIds: string[] // Array of video IDs in playlist
  skillIds: number[] // Related skill IDs
  categoryIds: string[] // Related category IDs
  tags: string[] // Tags (array of tag slugs)
  channelId: string // YouTube channel ID
  channelName: string // Channel name
}


