export interface Playlist {
  id: string
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
  videoCount: number
  videoIds: string[]
  skillIds: number[]
  categoryIds: string[]
  tags: string[]
  channelId: string
  channelName: string
}
