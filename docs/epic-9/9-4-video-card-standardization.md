# Story 9.4: Video Card UI Standardization

**Epic:** Epic 9 - Content Relationships & UI Polish  
**Status:** backlog  
**Story ID:** 9-4-video-card-standardization  
**Priority:** High

## User Story

As a user,
I want video cards to look like YouTube video cards across all pages,
So that the interface feels familiar and professional.

## Acceptance Criteria

**Given** I view videos on any page (`/videos`, skill pages, category pages, etc.)  
**When** I see video cards  
**Then** they have:
- YouTube-style thumbnail with aspect ratio 16:9
- Duration badge in bottom-right corner (black background, white text)
- Channel avatar (small, circular, left side below thumbnail)
- Video title (2 lines max, truncated with ellipsis)
- Channel name below title (gray text)
- View count and publish date ("X views • Y ago")
- Smooth hover effects (scale slightly, shadow increases)
- Consistent spacing and sizing
- Responsive grid layout (1/2/3/4 columns based on screen size)

**Prerequisites:** Story 8.20 (Real data integration)

## Technical Requirements

### Component Updates

**File:** `app/components/videos/VideoCard.vue`

**Current Issues:**
- Play button overlay too prominent
- Missing channel avatar
- Missing view count and date display
- Card styling doesn't match YouTube

**Target Design (from `/dev/youtube`):**
```vue
<template>
  <div class="group cursor-pointer">
    <!-- Thumbnail -->
    <div class="relative mb-3 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
      <img 
        :src="video.thumbnails?.medium?.url || video.thumbnails?.default?.url"
        class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
        :alt="video.title" 
      />
      <!-- Duration Badge -->
      <div class="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
        {{ formatDuration(video.durationSeconds) }}
      </div>
    </div>

    <!-- Video Info -->
    <div class="flex gap-3">
      <!-- Channel Avatar (small) -->
      <img 
        v-if="channel" 
        :src="channel.raw.snippet.thumbnails?.default?.url"
        class="w-9 h-9 rounded-full flex-shrink-0 mt-1" 
        :alt="channel.title" 
      />

      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            :title="video.title">
          {{ video.title }}
        </h3>

        <!-- Channel Name -->
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {{ channel?.title }}
        </p>

        <!-- Views & Date -->
        <div class="text-xs text-gray-600 dark:text-gray-400">
          <span>{{ formatNumber(video.stats.viewCount) }} views</span>
          <span class="mx-1">•</span>
          <span>{{ formatRelativeTime(video.publishedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Required Props

```typescript
interface Props {
  video: Video // Must include: thumbnail, duration, viewCount, publishedAt, title
  channel?: {
    title: string
    thumbnails: {
      default: { url: string }
    }
  }
  showDescription?: boolean
  variant?: 'default' | 'compact'
}
```

### Helper Functions

**Format Duration:**
```typescript
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
```

**Format Number:**
```typescript
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
```

**Format Relative Time:**
```typescript
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
```

### Grid Layout

**File:** `app/components/videos/VideoList.vue`

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <VideoCard 
      v-for="video in videos" 
      :key="video.id" 
      :video="video"
      :channel="channelInfo"
    />
  </div>
</template>
```

### Responsive Breakpoints
- Mobile (< 768px): 1 column
- Tablet (768px - 1024px): 2 columns
- Desktop (1024px - 1280px): 3 columns
- Large Desktop (> 1280px): 4 columns

## Tasks

- [ ] Task 1: Update `VideoCard.vue` component structure
- [ ] Task 2: Remove prominent play button overlay (or make subtle)
- [ ] Task 3: Add channel avatar support
- [ ] Task 4: Add view count display
- [ ] Task 5: Add publish date display (relative time)
- [ ] Task 6: Update duration badge styling (bottom-right, black background)
- [ ] Task 7: Update title styling (2 lines, truncate)
- [ ] Task 8: Add hover effects (scale, color change)
- [ ] Task 9: Update `VideoList.vue` to use grid layout
- [ ] Task 10: Test responsive design on all screen sizes
- [ ] Task 11: Update all pages using VideoCard component
- [ ] Task 12: Verify consistent appearance across all pages

## Pages to Update

1. `/videos` - Main videos page
2. `/videos/[slug]` - Video detail page (related videos)
3. `/skills/[slug]` - Skill page (related videos)
4. `/categories/[slug]` - Category page (related videos)
5. `/writers/[slug]` - Writer page (related videos)
6. `/books/[slug]` - Book page (related videos)
7. `/playlists/[slug]` - Playlist page (videos in playlist)
8. `/tags/[slug]` - Tag page (related videos)

## Design Specifications

### Colors
- Duration badge: `bg-black/90 text-white`
- Title hover: `text-blue-600 dark:text-blue-400`
- Channel name: `text-gray-600 dark:text-gray-400`
- Views/date: `text-gray-600 dark:text-gray-400`

### Spacing
- Gap between cards: `gap-4` (16px)
- Gap between avatar and info: `gap-3` (12px)
- Margin below thumbnail: `mb-3` (12px)
- Padding in duration badge: `px-1.5 py-0.5`

### Typography
- Title: `text-sm font-semibold`
- Channel name: `text-xs`
- Views/date: `text-xs`
- Duration: `text-xs font-semibold`

### Transitions
- Thumbnail scale: `transition-transform duration-200`
- Title color: `transition-colors`
- Hover scale: `group-hover:scale-105`

## Testing Checklist

- [ ] Video cards display correctly on all pages
- [ ] Duration badge shows in correct position
- [ ] Channel avatar displays (if available)
- [ ] View count formats correctly (K, M)
- [ ] Relative time displays correctly
- [ ] Hover effects work smoothly
- [ ] Responsive grid works on all screen sizes
- [ ] Mobile view (1 column) works
- [ ] Tablet view (2 columns) works
- [ ] Desktop view (3-4 columns) works
- [ ] Dark mode styling correct
- [ ] RTL support works (Persian)
- [ ] Accessibility (keyboard navigation, screen readers)

## Notes

- Keep skill badges below video info (existing feature)
- Maintain link to video detail page
- Ensure accessibility (alt text, ARIA labels)
- Test with videos that have missing data (no duration, no views, etc.)
- Fallback for missing channel avatar (use placeholder or hide)

---

**Estimated Effort:** 4-5 hours  
**Complexity:** Medium  
**Risk:** Low  
**Dependencies:** Real YouTube data (Story 8.20)

