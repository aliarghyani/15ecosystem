# User Story: Video Detail Page Enhancement

**Story ID:** 9-5-video-detail-enhancement  
**Epic:** Epic 9 - Content Relationships & UI Polish  
**Priority:** Medium  
**Status:** drafted  
**Created:** 2025-11-23  
**Estimated Effort:** 5-6 hours

---

## Story Overview

**As a** user  
**I want** a comprehensive video detail page with all related content  
**So that** I can explore videos and discover related skills, books, and content

---

## Context

The video detail page should provide a complete viewing experience with the video player, metadata, and all related content (skills, videos, books, writers, transcript, summary). Skills should be shown prominently first as they are the central organizing principle of the platform.

**Dependencies:**
- Story 9-4 completion (standardized video cards)
- Existing video data with relationships
- Transcript and summary data availability

---

## Acceptance Criteria

### AC1: Video Player Embedded
**Given** a video detail page  
**When** the page loads  
**Then** YouTube iframe player is embedded and functional

### AC2: Skills Shown Prominently First
**Given** a video with related skills  
**When** the page loads  
**Then** Related Skills section appears first after video player with prominent skill badges

### AC3: All Related Content Displayed
**Given** a video with relationships  
**When** the page loads  
**Then** the following sections are displayed in order:
1. Video player
2. Title and metadata (views, date, channel)
3. Description (expandable)
4. Related Skills (prominent, first section)
5. Related Videos (same skills/category)
6. Related Books
7. Featured Writer (if applicable)
8. Tags
9. Transcript link (if available)
10. Summary link (if available)

### AC4: Clean YouTube-Inspired Design
**Given** the video detail page  
**When** viewing the layout  
**Then** design follows YouTube's clean, organized structure with proper spacing and typography

### AC5: Mobile-Friendly
**Given** the video detail page on mobile  
**When** viewing on small screens  
**Then** layout adapts responsively with proper stacking and readable text

### AC6: Links to Transcript/Summary Pages
**Given** a video with transcript or summary  
**When** user clicks the link  
**Then** navigates to transcript or summary page

---

## Tasks

### Task 1: Audit Current Video Detail Page
- [x] Review existing `/videos/[slug]` page
- [x] Identify current structure and components
- [x] Document what needs to be added/changed
- [x] Check mobile responsiveness

### Task 2: Redesign Page Layout
- [x] Create new layout structure
- [x] Add YouTube iframe embed
- [x] Add title and metadata section
- [x] Add expandable description (already present)
- [x] Organize content sections in priority order

### Task 3: Implement Related Skills Section
- [x] Create prominent skills section (first after description)
- [x] Use skill badges with links (already present)
- [x] Add section title and styling
- [x] Make skills clickable to filter

### Task 4: Implement Related Videos Section
- [x] Show videos with same skills/category
- [x] Use standardized VideoCard component
- [x] Add horizontal scroll or grid layout
- [x] Limit to 8 related videos

### Task 5: Implement Related Books Section
- [x] Show books related to video (already present)
- [x] Use book cards or list
- [x] Add links to book detail pages
- [x] Handle case when no books

### Task 6: Implement Featured Writer Section
- [x] Show writer if video has writerId (already present)
- [x] Display writer info and photo
- [x] Link to writer detail page
- [x] Handle case when no writer

### Task 7: Add Tags and Links Section
- [x] Display video tags (already present)
- [x] Add transcript link (if available)
- [x] Add summary link (if available)
- [x] Style as secondary information

### Task 8: Mobile Responsiveness
- [x] Test on mobile devices
- [x] Ensure video player is responsive
- [x] Stack sections properly on small screens
- [x] Verify touch interactions

### Task 9: Performance Optimization
- [x] Lazy load related content
- [x] Optimize video embed
- [x] Minimize layout shifts
- [x] Test page load speed

### Task 10: Testing and Polish
- [x] Test all links and navigation
- [x] Verify data displays correctly
- [x] Check accessibility
- [x] Polish spacing and typography

---

## Technical Notes

### Page Structure
```vue
<template>
  <div class="video-detail-page">
    <!-- Video Player -->
    <div class="video-player-container">
      <iframe :src="youtubeEmbedUrl" />
    </div>

    <!-- Video Info -->
    <div class="video-info">
      <h1>{{ video.title }}</h1>
      <div class="metadata">
        <span>{{ viewCount }} views</span>
        <span>{{ publishDate }}</span>
        <span>{{ channelName }}</span>
      </div>
      <div class="description expandable">
        {{ video.description }}
      </div>
    </div>

    <!-- Related Skills (FIRST) -->
    <section class="related-skills">
      <h2>Related Skills</h2>
      <div class="skill-badges">
        <SkillBadge v-for="skill in relatedSkills" />
      </div>
    </section>

    <!-- Related Videos -->
    <section class="related-videos">
      <h2>Related Videos</h2>
      <div class="video-grid">
        <VideoCard v-for="video in relatedVideos" />
      </div>
    </section>

    <!-- Related Books -->
    <section v-if="relatedBooks.length" class="related-books">
      <h2>Related Books</h2>
      <BookList :books="relatedBooks" />
    </section>

    <!-- Featured Writer -->
    <section v-if="featuredWriter" class="featured-writer">
      <h2>Featured Writer</h2>
      <WriterCard :writer="featuredWriter" />
    </section>

    <!-- Tags & Links -->
    <section class="tags-and-links">
      <div class="tags">
        <UBadge v-for="tag in video.tags" />
      </div>
      <div class="links">
        <NuxtLink v-if="hasTranscript" to="/transcript">View Transcript</NuxtLink>
        <NuxtLink v-if="hasSummary" to="/summary">View Summary</NuxtLink>
      </div>
    </section>
  </div>
</template>
```

### YouTube Embed URL
```typescript
const youtubeEmbedUrl = computed(() => {
  return `https://www.youtube.com/embed/${video.youtubeId}`
})
```

### Related Videos Logic
```typescript
const relatedVideos = computed(() => {
  return allVideos.filter(v => 
    v.id !== video.id && 
    (v.skillIds.some(id => video.skillIds.includes(id)) ||
     v.categoryIds.some(id => video.categoryIds.includes(id)))
  ).slice(0, 6)
})
```

---

## Definition of Done

- [x] Video player embedded and functional
- [x] Skills section prominent and first
- [x] All related content sections implemented
- [x] Clean YouTube-inspired design
- [x] Mobile responsive
- [x] Links to transcript/summary working
- [x] Performance optimized
- [x] Accessibility requirements met
- [x] All sections display correctly with data
- [x] Testing complete

---

## Related Stories

- **9-4-video-card-standardization**: Uses standardized video cards for related videos
- **9-6-transcript-skill-extraction**: Will enhance skill relationships shown on this page

---

## Dev Agent Record

### Context Reference
- Story Context: `docs/stories/9-5-video-detail-enhancement.context.xml` (to be generated)

### Implementation Notes
- Start Date: 2025-11-23
- Completion Date: 2025-11-23
- Actual Effort: ~1 hour
- Blockers: None

### Implementation Summary
Enhanced video detail page with key improvements:

**Key Changes:**
1. **YouTube Iframe Embed** - Replaced thumbnail with actual YouTube player for direct playback
2. **Related Videos Section** - Added section showing 8 videos with same skills/categories using VideoCard component
3. **Transcript/Summary Links** - Added action buttons to view transcript and summary (with availability checks)
4. **Improved Metadata** - Added publish date with relative formatting
5. **Better Organization** - Skills section prominently first, followed by related videos, books, writer, and tags

**Features:**
- YouTube iframe with full controls (autoplay, fullscreen, etc.)
- Related videos filtered by shared skills or categories
- Transcript and summary buttons (conditional display)
- Responsive grid layout for related videos (1/2/3/4 columns)
- All existing sections preserved and enhanced

**Technical Details:**
- Used `getAllVideos()` to find related content
- Filter logic: same skills OR same categories, exclude current video
- Limit to 8 related videos for performance
- Added `formatRelativeDate()` for publish dates

---

**Last Updated:** 2025-11-23  
**Story Owner:** Development Team
