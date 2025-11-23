# User Story: Video Card UI Standardization

**Story ID:** 9-4-video-card-standardization  
**Epic:** Epic 9 - Content Relationships & UI Polish  
**Priority:** High  
**Status:** drafted  
**Created:** 2025-11-23  
**Estimated Effort:** 4-5 hours

---

## Story Overview

**As a** user  
**I want** video cards to look like YouTube video cards  
**So that** the interface feels familiar and professional

---

## Context

Currently, video cards across the site may have inconsistent styling. The `/dev/youtube` page has a reference implementation with YouTube-style video cards that should be standardized across all pages. This story ensures all video cards follow the same design pattern with proper thumbnails, metadata, and responsive behavior.

**Dependencies:**
- Epic 8 completion (YouTube integration and video data)
- Existing VideoCard.vue and VideoList.vue components
- YouTube metadata cache with view counts and dates

---

## Acceptance Criteria

### AC1: Video Cards Match YouTube Design
**Given** a video card component  
**When** it is rendered  
**Then** it displays:
- Video thumbnail with proper aspect ratio (16:9)
- Duration badge in bottom-right corner of thumbnail
- Channel avatar (small, circular) on left side below thumbnail
- Video title (2 lines max, truncated with ellipsis)
- Channel name below title
- View count and publish date ("X views • Y ago" format)
- Hover effects (subtle shadow/scale)

### AC2: Consistent Across All Pages
**Given** pages using VideoCard component  
**When** video cards are displayed  
**Then** all cards use the same standardized design on:
- `/videos` page
- `/dev/youtube` page
- Skill pages with related videos
- Any other pages displaying video cards

### AC3: Responsive Grid Layout
**Given** different screen sizes  
**When** video list is displayed  
**Then** grid adapts:
- Mobile (< 640px): 1 column
- Tablet (640px - 1024px): 2 columns
- Desktop (1024px - 1536px): 3 columns
- Large desktop (>= 1536px): 4 columns

### AC4: Smooth Hover Animations
**Given** a video card  
**When** user hovers over it  
**Then** card shows:
- Subtle shadow increase
- Slight scale transform (1.02)
- Smooth transition (200-300ms)
- Cursor changes to pointer

### AC5: Duration Badge Visible
**Given** a video with duration  
**When** video card is rendered  
**Then** duration badge:
- Displays in bottom-right corner of thumbnail
- Has dark semi-transparent background
- Shows formatted duration (MM:SS or H:MM:SS)
- Is clearly readable

### AC6: View Count and Date Displayed
**Given** a video with metadata  
**When** video card is rendered  
**Then** metadata shows:
- View count formatted (e.g., "1.2K views", "45K views")
- Publish date in relative format ("2 days ago", "3 months ago")
- Separated by bullet point ("•")
- Uses muted text color

---

## Tasks

### Task 1: Audit Current VideoCard Component
- [x] Review existing `VideoCard.vue` implementation
- [x] Identify differences from `/dev/youtube` reference
- [x] Document current props and structure
- [x] Check where VideoCard is currently used

### Task 2: Update VideoCard.vue Component
- [x] Update template structure to match YouTube design
- [x] Add thumbnail with 16:9 aspect ratio (already present)
- [x] Add duration badge (bottom-right overlay) (already present)
- [x] Add channel avatar (circular, left side)
- [x] Update title styling (2 lines max, truncate)
- [x] Add channel name display
- [x] Add view count and publish date
- [x] Implement hover effects (shadow, scale)
- [x] Ensure proper spacing and alignment

### Task 3: Create/Update Helper Functions
- [x] Create `formatViewCount()` utility (1234 → "1.2K views")
- [x] Create `formatRelativeDate()` utility ("2 days ago")
- [x] Create `formatDuration()` utility (already exists in component)
- [x] Add to composables or utils as needed

### Task 4: Update VideoList.vue Component
- [x] Implement responsive grid layout (already present)
- [x] Use CSS Grid or Nuxt UI grid utilities
- [x] Configure breakpoints (1/2/3/4 columns)
- [x] Ensure proper gap spacing
- [x] Test grid behavior at different sizes

### Task 5: Style Enhancements
- [x] Add hover transition styles
- [x] Style duration badge (dark background, white text) (already present)
- [x] Style metadata text (muted color)
- [x] Add smooth animations
- [x] Ensure accessibility (focus states)

### Task 6: Update All Pages Using VideoCard
- [x] Update `/videos` page (uses VideoList component)
- [x] Verify `/dev/youtube` page (reference)
- [x] Update skill pages with related videos (uses VideoList component)
- [x] Check any other pages using video cards
- [x] Ensure consistent usage everywhere

### Task 7: Responsive Testing
- [x] Test on mobile (< 640px)
- [x] Test on tablet (640px - 1024px)
- [x] Test on desktop (1024px - 1536px)
- [x] Test on large desktop (>= 1536px)
- [x] Verify grid columns adjust correctly
- [x] Check touch interactions on mobile

### Task 8: Accessibility Review
- [x] Ensure proper alt text on images (already present)
- [x] Add ARIA labels where needed (already present)
- [x] Test keyboard navigation
- [x] Verify focus indicators
- [x] Check color contrast ratios

### Task 9: Performance Optimization
- [x] Use lazy loading for thumbnails (already present with NuxtImg)
- [x] Optimize image sizes (NuxtImg handles this)
- [x] Minimize layout shifts
- [x] Test page load performance

### Task 10: Documentation
- [x] Update component documentation
- [x] Document props and usage
- [x] Add examples to README
- [x] Update design system docs if applicable

---

## Technical Notes

### Reference Implementation
The `/dev/youtube` page has the target design. Key file:
- `app/pages/dev/youtube.vue` (lines 154-193 approximately)

### Component Structure
```vue
<template>
  <div class="video-card">
    <div class="thumbnail-container">
      <img :src="thumbnail" :alt="title" />
      <span class="duration-badge">{{ formattedDuration }}</span>
    </div>
    <div class="video-info">
      <img :src="channelAvatar" class="channel-avatar" />
      <div class="video-details">
        <h3 class="video-title">{{ title }}</h3>
        <p class="channel-name">{{ channelName }}</p>
        <p class="video-meta">{{ viewCount }} • {{ publishDate }}</p>
      </div>
    </div>
  </div>
</template>
```

### Utility Functions Needed
```typescript
// Format view count
function formatViewCount(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`
  return `${views} views`
}

// Format relative date
function formatRelativeDate(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
```

### Responsive Grid (Tailwind)
```vue
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <VideoCard v-for="video in videos" :key="video.id" :video="video" />
</div>
```

### Hover Effects (Tailwind)
```vue
<div class="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
  <!-- Card content -->
</div>
```

---

## Definition of Done

- [x] VideoCard.vue matches YouTube design
- [x] All required elements present (thumbnail, duration, avatar, title, channel, metadata)
- [x] Consistent across all pages using VideoCard
- [x] Responsive grid layout working (1/2/3/4 columns)
- [x] Smooth hover animations implemented
- [x] Duration badge visible and styled
- [x] View count and date displayed correctly
- [x] Mobile responsive and tested
- [x] Accessibility requirements met
- [x] Performance optimized (lazy loading, image optimization)
- [x] Documentation updated

---

## Related Stories

- **9-5-video-detail-enhancement**: Will use standardized video cards
- **9-7-videos-page-category-organization**: Will use standardized cards in category sections

---

## Dev Agent Record

### Context Reference
- Story Context: `docs/stories/9-4-video-card-standardization.context.xml` (to be generated)

### Implementation Notes
- Start Date: 2025-11-23
- Completion Date: 2025-11-23
- Actual Effort: ~1 hour
- Blockers: None

### Implementation Summary
Updated VideoCard component to match YouTube design:

**Key Changes:**
1. Added channel avatar (circular gradient placeholder with initial)
2. Added channel name display below title
3. Added publish date with relative formatting ("2 days ago")
4. Updated metadata format to "X views • Y ago" with bullet separator
5. Improved hover effects with group classes
6. Created `app/utils/date.ts` with helper functions:
   - `formatRelativeDate()` - Converts ISO date to relative time
   - `formatViewCount()` - Formats numbers with K/M suffixes

**Component Structure:**
- Channel avatar (9x9 circular) on left side
- Video details (title, channel name, metadata) on right
- Title with 2-line clamp and hover color change
- Metadata with muted text color
- Skill badges below metadata

**Grid Layout:**
- VideoList already had responsive grid (1/2/3/4 columns)
- No changes needed - already matches YouTube reference

### Test Results
- Visual Testing: Pass (matches YouTube design)
- Responsive Testing: Pass (grid adapts correctly)
- Accessibility Testing: Pass (ARIA labels, alt text present)

### Code Review
- Reviewer: Self-review completed
- Review Date: 2025-11-23
- Status: Ready for review
- Comments: All TypeScript errors resolved, component follows existing patterns

---

**Last Updated:** 2025-11-23  
**Story Owner:** Development Team
