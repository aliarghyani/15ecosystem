# Story 7.2: Video Data Entry & YAML Structure

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-2-video-data-entry-yaml-structure

## User Story

As a content manager,
I want to define videos in YAML files,
So that I can easily add and manage video content.

## Acceptance Criteria

**Given** I need to add video content
**When** I create YAML files
**Then** I have:
- YAML structure for videos (en/fa)
- YAML structure for playlists (en/fa)
- Video metadata (title, description, YouTube ID, etc.)
- Skill mappings for each video
- Category assignments
- Data parsing script to TypeScript
- Validation of skill/category relationships

**Prerequisites:** Story 7.1

## Technical Requirements

### Data Files Created

1. **Video Data Files:**
   - `app/data/fa/videos.ts` - Persian video data
   - `app/data/en/videos.ts` - English video data

2. **Playlist Data Files:**
   - `app/data/fa/playlists.ts` - Persian playlist data
   - `app/data/en/playlists.ts` - English playlist data

### YAML Schema

1. **Video YAML Schema:**
   - Defined in `docs/yaml-schema-videos.md`
   - Supports bilingual titles and descriptions
   - Automatic video ID extraction from URL
   - Automatic thumbnail generation
   - Skill and category validation

2. **Playlist YAML Schema:**
   - Defined in `docs/yaml-schema-videos.md`
   - Links to videos via video IDs
   - Skill and category mappings

### Generation Script

1. **Script:** `scripts/generate-video-data.ts`
   - Parses YAML files from `content/videos/` directory
   - Validates skill IDs (1-15)
   - Validates category IDs (health, identity, career)
   - Generates TypeScript data files
   - Extracts video IDs from URLs
   - Generates thumbnail URLs

## Tasks

- [x] Task 1: Create data file structure (`app/data/fa/videos.ts`, `app/data/en/videos.ts`, etc.)
- [x] Task 2: Define YAML schema for videos (docs/yaml-schema-videos.md)
- [x] Task 3: Create parsing script (scripts/generate-video-data.ts)
- [x] Task 4: Update utility functions to import data files
- [x] Task 5: Add validation for skill IDs and category IDs (already in videos.ts)

## Implementation Notes

- Data files are empty arrays ready for content
- YAML schema documented for future content entry
- Generation script ready to parse YAML files when created
- Utility functions updated to import from data files
- Validation functions already implemented in Story 7.1
- Follows same patterns as books and writers data

## Next Steps

- Create YAML files in `content/videos/` directory
- Add video entries following the schema
- Run `pnpm tsx scripts/generate-video-data.ts` to generate TypeScript files
- Or manually add videos to TypeScript files for quick start

