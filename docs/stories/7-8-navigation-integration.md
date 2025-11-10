# Story 7.8: Navigation Integration

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-8-navigation-integration

## User Story

As a user,
I want to access videos and playlists from the main navigation,
So that I can easily find video content.

## Acceptance Criteria

**Given** I view the navigation menu
**When** I see the menu items
**Then** I see:
- "Videos" menu item
- "Playlists" menu item
- Active state highlighting
- Mobile menu support

**Prerequisites:** Story 7.4, 7.7

## Technical Requirements

### Navigation Updates

**Location:** `app/components/common/TopNav.vue`

**Features:**
- Add "Videos" menu item (already done in Story 7.4)
- Add "Playlists" menu item
- Active state highlighting (already working)
- Mobile menu support (already working)

### Translations

**Location:** `i18n/locales/fa.json` and `i18n/locales/en.json`

**Features:**
- Add `nav.playlists` translation key

## Tasks

- [x] Task 1: Add Playlists to desktop navigation
- [x] Task 2: Add Playlists to mobile navigation
- [x] Task 3: Add i18n translations for playlists
- [x] Task 4: Verify active state highlighting works
- [x] Task 5: Verify mobile menu works

## Implementation Notes

- Videos menu item was already added in Story 7.4
- Playlists menu item added after Videos
- Uses same icon as Videos (i-twemoji-video-camera)
- Active state uses existing `isActive` function
- Mobile menu uses existing hamburger menu system
- Bilingual support

## Completed Features

- ✅ Videos menu item in navigation (from Story 7.4)
- ✅ Playlists menu item in navigation
- ✅ Active state highlighting
- ✅ Mobile menu support
- ✅ Bilingual support
- ✅ Consistent icon usage

## Notes

- Dev server restart may be required after changes
- Navigation follows same pattern as other menu items
- Both desktop and mobile navigation updated

