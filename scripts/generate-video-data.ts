/**
 * Script to parse YAML video files and generate TypeScript data files
 * Run with: pnpm tsx scripts/generate-video-data.ts
 * 
 * This script will:
 * 1. Read YAML files from content/videos/ directory
 * 2. Parse video and playlist data
 * 3. Generate TypeScript files in app/data/fa/videos.ts and app/data/en/videos.ts
 * 4. Validate skill IDs and category IDs
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'
import type { Video, Playlist } from '../app/types'
import { extractYouTubeVideoId, getYouTubeThumbnail, isValidSkillId, isValidCategoryId } from '../app/utils/videos'

interface VideoYaml {
  id?: string
  youtubeUrl: string
  title: {
    fa: string
    en: string
  }
  description?: {
    fa?: string
    en?: string
  }
  duration?: number
  publishedAt?: string
  viewCount?: number
  playlistId?: string
  skillIds: number[]
  categoryIds: string[]
  tags?: string[]
  writerId?: string
  bookIds?: string[]
  channelId: string
  channelName: string
}

interface PlaylistYaml {
  id: string
  youtubeId?: string
  title: {
    fa: string
    en: string
  }
  description?: {
    fa?: string
    en?: string
  }
  thumbnail?: string
  videoCount: number
  videoIds: string[]
  skillIds: number[]
  categoryIds: string[]
  tags?: string[]
  channelId: string
  channelName: string
}

/**
 * Process video YAML data and convert to Video type
 */
function processVideo(videoYaml: VideoYaml): Video {
  // Extract video ID from URL if not provided
  const videoId = videoYaml.id || extractYouTubeVideoId(videoYaml.youtubeUrl)
  if (!videoId) {
    throw new Error(`Invalid YouTube URL: ${videoYaml.youtubeUrl}`)
  }

  // Generate thumbnail if not provided
  const thumbnail = videoYaml.thumbnail || getYouTubeThumbnail(videoId, 'high')

  // Validate skill IDs
  for (const skillId of videoYaml.skillIds) {
    if (!isValidSkillId(skillId)) {
      throw new Error(`Invalid skill ID: ${skillId} (must be 1-15)`)
    }
  }

  // Validate category IDs
  for (const categoryId of videoYaml.categoryIds) {
    if (!isValidCategoryId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId} (must be health, identity, or career)`)
    }
  }

  return {
    id: videoId,
    youtubeUrl: videoYaml.youtubeUrl,
    youtubeId: videoId,
    title: videoYaml.title,
    description: videoYaml.description,
    thumbnail,
    duration: videoYaml.duration,
    publishedAt: videoYaml.publishedAt,
    viewCount: videoYaml.viewCount,
    playlistId: videoYaml.playlistId,
    skillIds: videoYaml.skillIds,
    categoryIds: videoYaml.categoryIds,
    tags: videoYaml.tags || [],
    writerId: videoYaml.writerId,
    bookIds: videoYaml.bookIds,
    channelId: videoYaml.channelId,
    channelName: videoYaml.channelName,
  }
}

/**
 * Process playlist YAML data and convert to Playlist type
 */
function processPlaylist(playlistYaml: PlaylistYaml): Playlist {
  const youtubeId = playlistYaml.youtubeId || playlistYaml.id

  // Validate skill IDs
  for (const skillId of playlistYaml.skillIds) {
    if (!isValidSkillId(skillId)) {
      throw new Error(`Invalid skill ID: ${skillId} (must be 1-15)`)
    }
  }

  // Validate category IDs
  for (const categoryId of playlistYaml.categoryIds) {
    if (!isValidCategoryId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId} (must be health, identity, or career)`)
    }
  }

  return {
    id: playlistYaml.id,
    youtubeId,
    title: playlistYaml.title,
    description: playlistYaml.description,
    thumbnail: playlistYaml.thumbnail || '',
    videoCount: playlistYaml.videoCount,
    videoIds: playlistYaml.videoIds,
    skillIds: playlistYaml.skillIds,
    categoryIds: playlistYaml.categoryIds,
    tags: playlistYaml.tags || [],
    channelId: playlistYaml.channelId,
    channelName: playlistYaml.channelName,
  }
}

/**
 * Generate TypeScript file content for videos
 */
function generateVideosFile(videos: Video[], locale: 'fa' | 'en'): string {
  const localeName = locale === 'fa' ? 'Persian' : 'English'
  return `// ${localeName} video data - Auto-generated from YAML files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-video-data.ts

import type { Video } from '~/types'

export const videos: Video[] = ${JSON.stringify(videos, null, 2)}
`
}

/**
 * Generate TypeScript file content for playlists
 */
function generatePlaylistsFile(playlists: Playlist[], locale: 'fa' | 'en'): string {
  const localeName = locale === 'fa' ? 'Persian' : 'English'
  return `// ${localeName} playlist data - Auto-generated from YAML files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-video-data.ts

import type { Playlist } from '~/types'

export const playlists: Playlist[] = ${JSON.stringify(playlists, null, 2)}
`
}

/**
 * Main function
 */
function main() {
  console.log('📹 Generating video data files...')

  const contentDir = join(process.cwd(), 'content', 'videos')
  
  // Check if content directory exists
  if (!existsSync(contentDir)) {
    console.log('⚠️  Content directory not found. Creating structure...')
    console.log('📝 Please create YAML files in content/videos/ directory')
    console.log('📖 See docs/yaml-schema-videos.md for schema')
    return
  }

  // Read video YAML files
  const videosFaPath = join(contentDir, 'videos.fa.yaml')
  const videosEnPath = join(contentDir, 'videos.en.yaml')
  const playlistsFaPath = join(contentDir, 'playlists.fa.yaml')
  const playlistsEnPath = join(contentDir, 'playlists.en.yaml')

  let videosFa: Video[] = []
  let videosEn: Video[] = []
  let playlistsFa: Playlist[] = []
  let playlistsEn: Playlist[] = []

  // Parse Persian videos
  if (existsSync(videosFaPath)) {
    const content = readFileSync(videosFaPath, 'utf-8')
    const data = yaml.load(content) as { videos?: VideoYaml[] }
    if (data.videos) {
      videosFa = data.videos.map(processVideo)
      console.log(`✅ Parsed ${videosFa.length} Persian videos`)
    }
  }

  // Parse English videos
  if (existsSync(videosEnPath)) {
    const content = readFileSync(videosEnPath, 'utf-8')
    const data = yaml.load(content) as { videos?: VideoYaml[] }
    if (data.videos) {
      videosEn = data.videos.map(processVideo)
      console.log(`✅ Parsed ${videosEn.length} English videos`)
    }
  }

  // Parse Persian playlists
  if (existsSync(playlistsFaPath)) {
    const content = readFileSync(playlistsFaPath, 'utf-8')
    const data = yaml.load(content) as { playlists?: PlaylistYaml[] }
    if (data.playlists) {
      playlistsFa = data.playlists.map(processPlaylist)
      console.log(`✅ Parsed ${playlistsFa.length} Persian playlists`)
    }
  }

  // Parse English playlists
  if (existsSync(playlistsEnPath)) {
    const content = readFileSync(playlistsEnPath, 'utf-8')
    const data = yaml.load(content) as { playlists?: PlaylistYaml[] }
    if (data.playlists) {
      playlistsEn = data.playlists.map(processPlaylist)
      console.log(`✅ Parsed ${playlistsEn.length} English playlists`)
    }
  }

  // Generate TypeScript files
  const faVideosPath = join(process.cwd(), 'app', 'data', 'fa', 'videos.ts')
  const enVideosPath = join(process.cwd(), 'app', 'data', 'en', 'videos.ts')
  const faPlaylistsPath = join(process.cwd(), 'app', 'data', 'fa', 'playlists.ts')
  const enPlaylistsPath = join(process.cwd(), 'app', 'data', 'en', 'playlists.ts')

  writeFileSync(faVideosPath, generateVideosFile(videosFa, 'fa'))
  writeFileSync(enVideosPath, generateVideosFile(videosEn, 'en'))
  writeFileSync(faPlaylistsPath, generatePlaylistsFile(playlistsFa, 'fa'))
  writeFileSync(enPlaylistsPath, generatePlaylistsFile(playlistsEn, 'en'))

  console.log('✅ Generated video data files:')
  console.log(`   - ${faVideosPath}`)
  console.log(`   - ${enVideosPath}`)
  console.log(`   - ${faPlaylistsPath}`)
  console.log(`   - ${enPlaylistsPath}`)
  console.log('✨ Done!')
}

main()

