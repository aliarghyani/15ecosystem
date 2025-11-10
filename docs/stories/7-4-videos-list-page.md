# Story 7.4: Videos List Page

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-4-videos-list-page

## User Story

As a user,
I want to browse all videos organized by category,
So that I can discover content related to my interests.

## Acceptance Criteria

**Given** I visit the videos page
**When** I view the list
**Then** I see:
- Videos grouped by category (Health, Identity, Career)
- Video cards with thumbnails, titles, durations
- Related skills displayed on each card
- Filter by skill dropdown (via query param)
- Breadcrumb navigation
- Bilingual content

**Prerequisites:** Story 7.3

## Technical Requirements

### Page Structure

**Location:** `app/pages/videos/index.vue`

**Features:**
- Breadcrumb navigation
- Page header with title and description
- Category sections (Health, Identity, Career)
- Video cards grouped by category
- Filter by skill (via query param: `?skill=1`)
- Empty state handling
- Navigation back to home

### Filtering

- Filter by skill via query parameter: `/videos?skill=1`
- Show filter indicator when active
- Clear filter button
- Filter applies to all category sections

### Data Loading

- Load all videos from data files
- Group by category
- Filter by skill if query param present
- Handle empty state gracefully

## Tasks

- [x] Task 1: Create videos list page (`app/pages/videos/index.vue`)
- [x] Task 2: Group videos by category
- [x] Task 3: Implement filtering by skill (query param)
- [x] Task 4: Use VideoList component
- [x] Task 5: Add breadcrumb navigation
- [x] Task 6: Add empty state handling
- [x] Task 7: Add i18n translations
- [x] Task 8: Set page meta tags

## Implementation Notes

- Follows same structure as books page
- Uses VideoList component for rendering
- Category headers are clickable (link to category page)
- Filter by skill via query parameter
- Empty state shows when no videos available
- Responsive design
- Bilingual support

## Completed Features

- ✅ Videos list page created
- ✅ Grouped by category (Health, Identity, Career)
- ✅ Filter by skill via query parameter
- ✅ Breadcrumb navigation
- ✅ Empty state handling
- ✅ Category headers link to category pages
- ✅ Responsive design
- ✅ Bilingual support
- ✅ Page meta tags

