# Story 7.7: Playlists Support

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-7-playlists-support

## User Story

As a user,
I want to browse playlists and see all videos in a playlist,
So that I can follow structured learning paths.

## Acceptance Criteria

**Given** I visit the playlists page
**When** I view playlists
**Then** I see:
- Playlist cards with thumbnails and video counts
- Playlists grouped by category
- Filter by skill
- Click to view playlist detail page

**Given** I view a playlist detail page
**When** I see the playlist
**Then** I see:
- Playlist header with title and description
- List of all videos in playlist
- Related skills
- Related categories
- Breadcrumb navigation

**Prerequisites:** Story 7.3, 7.4

## Technical Requirements

### Components

**Location:** `app/components/playlists/PlaylistCard.vue`

**Features:**
- Thumbnail with play icon overlay
- Video count badge
- Title and optional description
- Related skills badges
- Clickable card linking to playlist detail page

### Pages

**Location:** `app/pages/playlists/index.vue`

**Features:**
- Breadcrumb navigation
- Page header
- Filter by skill (query param)
- Playlists grouped by category
- Empty state handling
- Navigation back to home

**Location:** `app/pages/playlists/[slug].vue`

**Features:**
- Breadcrumb navigation
- Large thumbnail
- Video count display
- Description section
- Videos in playlist grid
- Related skills section
- Related categories section
- Tags section
- Navigation buttons

### Data Loading

- Load playlists using `getAllPlaylists`
- Filter by category and skill
- Load videos in playlist by videoIds
- Load related skills and categories
- Load tags for playlist

## Tasks

- [x] Task 1: Fix playlists utility to use direct imports
- [x] Task 2: Create PlaylistCard component
- [x] Task 3: Create playlists index page
- [x] Task 4: Create playlist detail page
- [x] Task 5: Add getTagsForPlaylist utility function
- [x] Task 6: Add i18n translations
- [x] Task 7: Test empty state (no playlists yet)

## Implementation Notes

- PlaylistCard follows same pattern as VideoCard
- Playlists page follows same structure as videos page
- Playlist detail page follows same structure as video detail page
- Videos in playlist loaded by matching videoIds
- Empty state shows when no playlists available
- Responsive design
- Bilingual support

## Completed Features

- ✅ PlaylistCard component created
- ✅ Playlists index page created
- ✅ Playlist detail page created
- ✅ Category grouping
- ✅ Skill filtering support
- ✅ Videos in playlist display
- ✅ Related skills and categories
- ✅ Tags support
- ✅ Breadcrumb navigation
- ✅ Empty state handling
- ✅ Responsive design
- ✅ Bilingual support

