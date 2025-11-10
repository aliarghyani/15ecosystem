# Story 7.1: Video Data Structure & Types

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** drafted  
**Story ID:** 7-1-video-data-structure-types

## User Story

As a developer,
I want a well-defined data structure for videos and playlists,
So that I can store and retrieve video information consistently.

## Acceptance Criteria

**Given** I need to store video information
**When** I define the data structure
**Then** I have:
- Video type with all required fields (id, title, description, thumbnail, duration, etc.)
- Playlist type with video relationships
- Skill and category relationships
- Bilingual support (fa/en)
- TypeScript types defined
- Utility functions for video operations

**Prerequisites:** None

## Technical Requirements

### Type Definitions

1. **Video Interface:**
   - `id: string` - Unique video identifier (YouTube video ID)
   - `youtubeUrl: string` - Full YouTube URL (e.g., https://youtu.be/hxnS40NolrA?si=...)
   - `youtubeId: string` - YouTube video ID (extracted from URL, e.g., hxnS40NolrA)
   - `title: { fa: string, en: string }` - Bilingual title
   - `description?: { fa: string, en: string }` - Optional bilingual description
   - `thumbnail: string` - YouTube thumbnail URL (can be generated from video ID)
   - `duration?: number` - Optional duration in seconds
   - `publishedAt?: string` - Optional ISO date string
   - `viewCount?: number` - Optional view count
   - `playlistId?: string` - Optional playlist ID
   - `skillIds: number[]` - Related skill IDs (1-15)
   - `categoryIds: string[]` - Related category IDs (health, identity, career)
   - `tags: string[]` - Tags for categorization
   - `writerId?: string` - Optional writer ID if video features a writer
   - `bookIds?: string[]` - Optional related book IDs
   - `channelId: string` - YouTube channel ID (KhashayarTalks)
   - `channelName: string` - Channel name

2. **Playlist Interface:**
   - `id: string` - Unique playlist identifier (YouTube playlist ID)
   - `youtubeId: string` - YouTube playlist ID
   - `title: { fa: string, en: string }` - Bilingual title
   - `description?: { fa: string, en: string }` - Optional bilingual description
   - `thumbnail: string` - Playlist thumbnail URL
   - `videoCount: number` - Number of videos in playlist
   - `videoIds: string[]` - Array of video IDs in playlist
   - `skillIds: number[]` - Related skill IDs
   - `categoryIds: string[]` - Related category IDs
   - `tags: string[]` - Tags
   - `channelId: string` - YouTube channel ID
   - `channelName: string` - Channel name

### Utility Functions

1. **Video Utilities (`app/utils/videos.ts`):**
   - `getVideoBySlug(slug: string, locale: 'fa' | 'en'): Video | undefined`
   - `getVideosBySkillId(skillId: number, locale: 'fa' | 'en'): Video[]`
   - `getVideosByCategoryId(categoryId: string, locale: 'fa' | 'en'): Video[]`
   - `getVideosByPlaylistId(playlistId: string, locale: 'fa' | 'en'): Video[]`
   - `getAllVideos(locale: 'fa' | 'en'): Video[]`
   - `generateVideoSlug(video: Video, locale: 'fa' | 'en'): string`
   - `extractYouTubeVideoId(url: string): string | null` - Extract video ID from YouTube URL
   - `getYouTubeThumbnail(videoId: string, quality?: 'default' | 'medium' | 'high' | 'maxres'): string` - Generate thumbnail URL

2. **Playlist Utilities (`app/utils/playlists.ts`):**
   - `getPlaylistBySlug(slug: string, locale: 'fa' | 'en'): Playlist | undefined`
   - `getPlaylistsBySkillId(skillId: number, locale: 'fa' | 'en'): Playlist[]`
   - `getAllPlaylists(locale: 'fa' | 'en'): Playlist[]`
   - `generatePlaylistSlug(playlist: Playlist, locale: 'fa' | 'en'): string`

## Tasks

- [ ] Task 1: Define Video interface in `app/types/index.ts`
- [ ] Task 2: Define Playlist interface in `app/types/index.ts`
- [ ] Task 3: Create `app/utils/videos.ts` with utility functions
- [ ] Task 4: Create `app/utils/playlists.ts` with utility functions
- [ ] Task 5: Add slug generation functions
- [ ] Task 6: Add validation for skill IDs (1-15)
- [ ] Task 7: Add validation for category IDs (health, identity, career)
- [ ] Task 8: Write unit tests for utility functions

## Implementation Notes

- Follow same patterns as books and writers
- Use TypeScript strict mode
- Ensure type safety throughout
- Add JSDoc comments for functions
- Export types from `app/types/index.ts`
- Use consistent naming conventions
- Support YouTube URL formats: `youtu.be/{ID}` and `youtube.com/watch?v={ID}`
- Generate thumbnail URLs from video ID: `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`
- Videos open in new tab (no embedding)

