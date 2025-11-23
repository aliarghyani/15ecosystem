export interface Video {
  id: string
  youtubeUrl: string
  youtubeId: string
  title: {
    fa: string
    en: string
  }
  description?: {
    fa: string
    en: string
  }
  thumbnail: string
  duration?: number
  publishedAt?: string
  viewCount?: number
  playlistId?: string
  skillIds: number[]
  categoryIds: string[]
  tags: string[]
  writerId?: string
  bookIds?: string[]
  channelId: string
  channelName: string
}
