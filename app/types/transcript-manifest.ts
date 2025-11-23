export interface TranscriptManifest {
  version: string
  lastGenerated: string
  transcripts: Record<string, TranscriptMetadata>
}

export interface TranscriptMetadata {
  videoId: string
  locale: 'fa' | 'en'
  status: 'draft' | 'confirmed' | 'locked'
  version: number
  hash: string // SHA-256 hash of transcript content
  wordCount: number
  characterCount: number
  createdAt: string
  updatedAt?: string
  confirmedAt?: string
  lockedAt?: string
  source: 'manual' | 'generated' | 'api'
}
