# Story 7.5: Video Detail Page

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-5-video-detail-page

## User Story

As a user,
I want to see video information and related content,
So that I can learn more about a topic and watch the video.

## Acceptance Criteria

**Given** I click on a video
**When** I view the detail page
**Then** I see:
- Large video thumbnail (clickable, opens YouTube in new tab)
- "Watch on YouTube" button
- Video title and description
- Related skills section (with links)
- Related books section (if any)
- Related writers section (if any)
- Tags section
- Breadcrumb navigation
- Previous/next video navigation (optional)

**Prerequisites:** Story 7.3

## Technical Requirements

### Page Structure

**Location:** `app/pages/videos/[slug].vue`

**Features:**
- Breadcrumb navigation
- Large thumbnail with play icon overlay
- Clickable thumbnail opens YouTube in new tab
- "Watch on YouTube" button
- Video metadata (views, duration, channel)
- Description section
- Related skills grid
- Related books grid (if any)
- Related writer card (if any)
- Tags section
- Navigation buttons (back to videos, back to home)

### Data Loading

- Load video by slug
- Load related skills by skillIds
- Load related books by bookIds
- Load related writer by writerId
- Load tags for video
- Handle loading states
- Handle 404 errors

## Tasks

- [x] Task 1: Create video detail page (`app/pages/videos/[slug].vue`)
- [x] Task 2: Display large thumbnail with play icon overlay
- [x] Task 3: Add "Watch on YouTube" button
- [x] Task 4: Display video metadata (title, description, views, duration)
- [x] Task 5: Load and display related skills
- [x] Task 6: Load and display related books (if any)
- [x] Task 7: Load and display related writer (if any)
- [x] Task 8: Load and display tags
- [x] Task 9: Add breadcrumb navigation
- [x] Task 10: Add navigation buttons
- [x] Task 11: Add SEO meta tags
- [x] Task 12: Add i18n translations
- [x] Task 13: Add `getTagsForVideo` utility function

## Implementation Notes

- Follows same structure as book detail page
- Large thumbnail (16:9 aspect ratio) with YouTube-style play icon
- Clicking thumbnail or button opens YouTube in new tab
- Related content sections only show if data exists
- Responsive design
- Bilingual support
- SEO-friendly with Open Graph tags

## Completed Features

- ✅ Video detail page created
- ✅ Large thumbnail with play icon overlay
- ✅ "Watch on YouTube" button
- ✅ Video metadata display
- ✅ Related skills section
- ✅ Related books section
- ✅ Related writer section
- ✅ Tags section
- ✅ Breadcrumb navigation
- ✅ Navigation buttons
- ✅ SEO meta tags
- ✅ Bilingual support
- ✅ Loading and error states

