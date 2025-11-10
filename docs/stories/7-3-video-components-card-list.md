# Story 7.3: Video Components (Card, List)

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-3-video-components-card-list

## User Story

As a developer,
I want reusable video components,
So that I can display videos consistently across the platform.

## Acceptance Criteria

**Given** I need to display videos
**When** I use video components
**Then** I have:
- VideoCard component (similar to BookCard)
- VideoList component (with filtering)
- Thumbnail display with YouTube-style play icon overlay
- Click to open YouTube video in new tab
- Responsive design
- Lazy loading for thumbnails
- Bilingual support
- Accessibility features

**Prerequisites:** Story 7.1, 7.2

## Technical Requirements

### VideoCard Component

**Location:** `app/components/videos/VideoCard.vue`

**Props:**
- `video: Video` - Video object
- `showDescription?: boolean` - Show video description
- `variant?: 'default' | 'compact'` - Card variant

**Features:**
- YouTube thumbnail with lazy loading
- Play icon overlay (YouTube-style, red circle)
- Duration badge (if available)
- View count (if available)
- Related skills badges (max 3, then "+N")
- Click opens YouTube URL in new tab
- Hover effects (scale, translate, shadow)
- Responsive design
- 16:9 aspect ratio for thumbnail
- Touch-friendly (44x44px minimum)

### VideoList Component

**Location:** `app/components/videos/VideoList.vue`

**Props:**
- `videos: Video[]` - Array of videos
- `groupBy?: 'category' | 'skill' | 'playlist' | 'none'` - Grouping method
- `filterBySkillId?: number` - Filter by skill ID
- `filterByCategoryId?: string` - Filter by category ID
- `showDescription?: boolean` - Show descriptions in cards
- `variant?: 'default' | 'compact'` - Card variant

**Features:**
- Group videos by category or skill
- Filter by skill or category
- Responsive grid layout
- Empty state handling
- Bilingual support

## Tasks

- [x] Task 1: Create VideoCard component
- [x] Task 2: Add YouTube thumbnail with play icon overlay
- [x] Task 3: Add duration and view count formatting
- [x] Task 4: Add related skills badges
- [x] Task 5: Implement click to open YouTube in new tab
- [x] Task 6: Create VideoList component
- [x] Task 7: Add grouping and filtering functionality
- [x] Task 8: Add i18n translations for videos
- [x] Task 9: Ensure responsive design and accessibility

## Implementation Notes

- Uses Nuxt UI components (UCard, UBadge, UIcon)
- Uses @nuxt/image for thumbnail optimization
- Follows same design patterns as BookCard and SkillCard
- Play icon uses tw-emoji (i-twemoji-play-button)
- Red play button overlay (YouTube-style)
- Duration formatted as MM:SS or HH:MM:SS
- View count formatted as K/M (e.g., 50K, 1.2M)
- Skills badges limited to 3, then "+N" badge
- All links open in new tab with security attributes
- RTL support for Persian locale

## Completed Features

- ✅ VideoCard component with thumbnail and play icon
- ✅ VideoList component with grouping and filtering
- ✅ YouTube-style play icon overlay (red circle)
- ✅ Duration and view count display
- ✅ Related skills badges
- ✅ Click to open YouTube in new tab
- ✅ Responsive grid layout
- ✅ Lazy loading for thumbnails
- ✅ Bilingual support
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Touch-friendly targets (64x64px play button)

