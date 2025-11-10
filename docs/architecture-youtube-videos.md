# Architecture: YouTube Videos Integration

**Date:** 2025-01-15  
**Feature:** YouTube Videos from KhashayarTalks Channel  
**Epic:** Epic 7 - Video Content Integration

## Overview

This document describes the architecture for integrating YouTube videos from the KhashayarTalks channel into the 15ecosystem platform. Videos will be organized by skills, categories, and playlists, similar to how books and writers are currently structured.

## Architecture Principles

1. **Consistency:** Follow the same patterns used for books and writers
2. **Static First:** Store video metadata statically (YAML → TypeScript)
3. **Performance:** Lazy load videos and optimize thumbnails
4. **Expandability:** Structure allows future dynamic fetching if needed
5. **Bilingual:** Full Persian/English support

## Data Structure

### Video Type

```typescript
interface Video {
  id: string // YouTube video ID (extracted from URL)
  youtubeUrl: string // Full YouTube URL (e.g., https://youtu.be/hxnS40NolrA?si=...)
  youtubeId: string // YouTube video ID (e.g., hxnS40NolrA)
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
  tags: string[] // Tags for categorization
  writerId?: string // Optional writer ID if video features a writer
  bookIds?: string[] // Optional related book IDs
  channelId: string // YouTube channel ID (KhashayarTalks)
  channelName: string // Channel name
}
```

### Playlist Type

```typescript
interface Playlist {
  id: string // YouTube playlist ID
  youtubeId: string // Same as id
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
  tags: string[] // Tags
  channelId: string
  channelName: string
}
```

## File Structure

```
app/
├── data/
│   ├── en/
│   │   ├── videos.ts        # English video data
│   │   └── playlists.ts     # English playlist data
│   └── fa/
│       ├── videos.ts        # Persian video data
│       └── playlists.ts     # Persian playlist data
├── types/
│   └── index.ts             # Video and Playlist types
├── utils/
│   ├── videos.ts            # Video utility functions
│   └── playlists.ts         # Playlist utility functions
├── components/
│   ├── videos/
│   │   ├── VideoCard.vue    # Video card component
│   │   ├── VideoPlayer.vue  # YouTube embed player
│   │   └── VideoList.vue    # Video list component
│   └── playlists/
│       ├── PlaylistCard.vue # Playlist card component
│       └── PlaylistDetail.vue # Playlist detail component
└── pages/
    ├── videos/
    │   ├── index.vue        # Videos list page
    │   └── [slug].vue       # Video detail page
    └── playlists/
        ├── index.vue         # Playlists list page
        └── [slug].vue       # Playlist detail page
```

## Data Flow

### Build Time

1. **Manual Data Entry:**
   - Videos and playlists defined in YAML files
   - Skill mappings manually assigned
   - Data parsed to TypeScript files at build time

2. **Data Generation:**
   - Script reads YAML files
   - Generates TypeScript data files
   - Validates skill/category relationships

### Runtime

1. **Page Load:**
   - Load video/playlist data from TypeScript files
   - Filter by skill/category as needed
   - Render components

2. **Video Embedding:**
   - Use YouTube iframe API
   - Lazy load player on scroll
   - Responsive player sizing

## Component Architecture

### VideoCard Component

**Purpose:** Display video information in a card format with thumbnail

**Props:**
- `video: Video`
- `showDescription?: boolean`
- `showPlaylist?: boolean`
- `variant?: 'default' | 'compact'`

**Features:**
- Thumbnail image (lazy loaded, YouTube thumbnail)
- Title (bilingual)
- Duration badge (if available)
- View count (if available)
- Related skills badges
- Click to open YouTube video in new tab
- Play icon overlay on thumbnail (YouTube-style)
- Hover effect (scale/translate)

### Video Thumbnail Helper

**Purpose:** Generate YouTube thumbnail URL from video ID

**Function:**
- `getYouTubeThumbnail(videoId: string, quality?: 'default' | 'medium' | 'high' | 'maxres'): string`
- Returns YouTube thumbnail URL
- Default quality: 'high' (480x360)
- Max quality: 'maxres' (1280x720) if available

### VideoList Component

**Purpose:** Display list of videos with filtering

**Props:**
- `videos: Video[]`
- `groupBy?: 'category' | 'skill' | 'playlist'`
- `filterBySkillId?: number`
- `filterByCategoryId?: string`

**Features:**
- Group videos by category/skill
- Filter functionality
- Grid/list view toggle
- Pagination (if needed)

## Page Architecture

### Videos List Page (`/videos`)

**Structure:**
- Page header with title and description
- Category sections (Health, Identity, Career)
- Video cards grouped by category
- Filter by skill dropdown
- Search functionality (future)

**Data Loading:**
- Load all videos from data files
- Group by category
- Filter by skill if query param present

### Video Detail Page (`/videos/[slug]`)

**Structure:**
- Breadcrumb navigation
- Large video thumbnail (clickable, opens YouTube)
- Video title and description
- "Watch on YouTube" button (opens in new tab)
- Related skills section
- Related books section (if any)
- Related writers section (if any)
- Tags section
- Navigation (previous/next video)

**Data Loading:**
- Load video by slug
- Load related skills
- Load related books/writers
- Load previous/next videos

**Note:** Video plays on YouTube, not embedded on site

### Playlists List Page (`/playlists`)

**Structure:**
- Page header
- Playlist cards
- Grouped by category
- Filter by skill

### Playlist Detail Page (`/playlists/[slug]`)

**Structure:**
- Playlist header
- Description
- List of videos in playlist
- Related skills
- Related categories

## Integration Points

### Skill Detail Page Integration

**Changes to `app/pages/skills/[slug].vue`:**
- Add "Related Videos" section
- Display videos related to the skill
- Show video cards with thumbnails
- Link to video detail pages

### Category Detail Page Integration

**Changes to `app/pages/categories/[slug].vue`:**
- Add "Videos" section
- Display videos in category
- Group by skill if needed

### Navigation Integration

**Changes to `app/components/common/TopNav.vue`:**
- Add "Videos" menu item
- Add "Playlists" menu item (optional)

## Utility Functions

### Video Utilities (`app/utils/videos.ts`)

```typescript
// Get video by slug
export function getVideoBySlug(slug: string, locale: 'fa' | 'en'): Video | undefined

// Get videos by skill ID
export function getVideosBySkillId(skillId: number, locale: 'fa' | 'en'): Video[]

// Get videos by category ID
export function getVideosByCategoryId(categoryId: string, locale: 'fa' | 'en'): Video[]

// Get videos by playlist ID
export function getVideosByPlaylistId(playlistId: string, locale: 'fa' | 'en'): Video[]

// Get all videos
export function getAllVideos(locale: 'fa' | 'en'): Video[]

// Generate video slug
export function generateVideoSlug(video: Video, locale: 'fa' | 'en'): string
```

### Playlist Utilities (`app/utils/playlists.ts`)

```typescript
// Get playlist by slug
export function getPlaylistBySlug(slug: string, locale: 'fa' | 'en'): Playlist | undefined

// Get playlists by skill ID
export function getPlaylistsBySkillId(skillId: number, locale: 'fa' | 'en'): Playlist[]

// Get all playlists
export function getAllPlaylists(locale: 'fa' | 'en'): Playlist[]

// Generate playlist slug
export function generatePlaylistSlug(playlist: Playlist, locale: 'fa' | 'en'): string
```

## YouTube Integration

### Thumbnail Strategy

1. **Generate Thumbnail URLs:**
   - YouTube provides standard thumbnail URLs
   - Format: `https://img.youtube.com/vi/{VIDEO_ID}/{quality}.jpg`
   - Quality options: `default`, `mqdefault`, `hqdefault`, `sddefault`, `maxresdefault`
   - Use `hqdefault` (480x360) as default
   - Use `maxresdefault` (1280x720) if available

2. **Thumbnail Optimization:**
   - Use @nuxt/image for optimization
   - Lazy load thumbnails
   - Responsive sizing
   - WebP/AVIF formats

3. **Video Link Handling:**
   - Extract video ID from YouTube URL
   - Support both formats: `youtu.be/{ID}` and `youtube.com/watch?v={ID}`
   - Open in new tab with `target="_blank"` and `rel="noopener noreferrer"`

### URL Parsing

**Function:** `extractYouTubeVideoId(url: string): string | null`
- Extract video ID from various YouTube URL formats
- Handle `youtu.be/{ID}`, `youtube.com/watch?v={ID}`, etc.
- Return null if invalid URL

## Performance Considerations

1. **Lazy Loading:**
   - Lazy load thumbnails
   - Code split video components

2. **Image Optimization:**
   - Use @nuxt/image for thumbnails
   - WebP/AVIF formats
   - Responsive sizes
   - YouTube thumbnails are already optimized

3. **Code Splitting:**
   - Separate video components
   - No iframe/player code needed

4. **Caching:**
   - Static generation for all pages
   - Cache video metadata at build time
   - Thumbnails cached by YouTube CDN

## SEO Considerations

1. **Meta Tags:**
   - Video title in page title
   - Video description in meta description
   - Open Graph tags for video (with thumbnail)
   - Video schema markup (YouTube video)

2. **URLs:**
   - SEO-friendly slugs
   - Bilingual URLs
   - Breadcrumb navigation
   - External links to YouTube (nofollow optional)

## Accessibility

1. **Video Links:**
   - Clear link text ("Watch on YouTube")
   - Screen reader support
   - Keyboard navigation
   - External link indicators

2. **Video Cards:**
   - Alt text for thumbnails (video title)
   - Proper heading hierarchy
   - ARIA labels
   - Link role for clickable cards

## Internationalization

1. **Bilingual Support:**
   - Video titles (fa/en)
   - Descriptions (fa/en)
   - Page content (fa/en)
   - URLs (fa/en)

2. **RTL/LTR:**
   - Proper layout for Persian
   - Video player positioning

## Testing Strategy

1. **Unit Tests:**
   - Video utility functions
   - Playlist utility functions
   - Slug generation

2. **Component Tests:**
   - VideoCard component
   - VideoPlayer component
   - VideoList component

3. **Integration Tests:**
   - Video detail page
   - Videos list page
   - Skill page integration

4. **E2E Tests:**
   - Video navigation
   - Video playback
   - Filter functionality

## Migration Path

1. **Phase 1:** Data structure and types
2. **Phase 2:** Basic components (VideoCard, VideoPlayer)
3. **Phase 3:** Pages (list and detail)
4. **Phase 4:** Integration with skills/categories
5. **Phase 5:** Playlists support
6. **Phase 6:** Polish and optimization

## Future Enhancements

1. **Dynamic Fetching:**
   - YouTube Data API integration (see [YouTube API Integration Plan](./youtube-api-integration-plan.md))
   - Real-time video metadata
   - Automated video link and statistics fetching

2. **Video Analytics:**
   - View tracking
   - Watch time tracking

3. **Video Recommendations:**
   - Related videos
   - Personalized suggestions

4. **Video Playlists:**
   - User-created playlists
   - Playlist sharing

5. **Video Comments:**
   - Comment system
   - Discussion threads

6. **Video Transcripts:**
   - Auto-generated transcripts
   - Searchable transcripts

