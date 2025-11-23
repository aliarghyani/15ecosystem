# Epic 9: Content Relationships & UI Polish

**Epic ID:** epic-9  
**Status:** backlog  
**Created:** 2025-11-23  
**Priority:** High

---

## Epic Overview

This epic focuses on refining content relationships, improving UI consistency, and ensuring all models properly display related content. The goal is to create a cohesive experience where skills are the central organizing principle, and all content (videos, books, writers, transcripts, summaries) is properly interconnected.

---

## Core Principles

### 1. **Skills as Central Hub**
- Skills are the primary organizing principle
- Every other model should show related skills prominently
- Skills should appear first in all detail pages (except skill pages themselves)

### 2. **Consistent UI Patterns**
- Video cards should match YouTube aesthetics across all pages
- Related content sections should follow consistent design
- Badges and tags should be uniform

### 3. **Complete Relationships**
- All models properly linked bidirectionally
- Transcript analysis used to enhance relationships
- Skills extracted from video content

---

## Stories

### Story 9.1: Type Sharding & Organization

**Priority:** High  
**Story ID:** 9-1-type-sharding

**Goal:** Shard large type definition file into modular, maintainable pieces

**Tasks:**
- Shard `app/types/index.ts` into separate files per model
- Create `app/types/skill.ts`, `app/types/category.ts`, `app/types/video.ts`, etc.
- Update `app/types/index.ts` to re-export all types
- Verify all imports still work
- Update documentation

**Acceptance Criteria:**
- Each model has its own type file
- `index.ts` is clean and only contains re-exports
- No breaking changes to existing code
- All types properly exported

---

### Story 9.2: Transcript Completeness Audit

**Priority:** High  
**Story ID:** 9-2-transcript-audit

**Goal:** Verify all 128 videos have complete, valid transcripts

**Tasks:**
- Create script to audit all transcript files in `server/data/transcripts/`
- Check for:
  - Empty or missing `fullText` field
  - Low segment count (< 10 segments may indicate incomplete)
  - Invalid JSON structure
  - Missing video IDs
- Generate report of incomplete transcripts
- Re-fetch incomplete transcripts using yt-dlp
- Verify all transcripts are complete

**Acceptance Criteria:**
- All 128 videos have valid transcript files
- All transcripts have non-empty `fullText`
- All transcripts have reasonable segment counts
- Report generated showing transcript status

**Script Location:** `scripts/audit-transcripts.ts`

---

### Story 9.3: Server Utils Audit & Enhancement

**Priority:** Medium  
**Story ID:** 9-3-server-utils-enhancement

**Goal:** Review and improve server-side utilities

**Tasks:**
- Audit `server/utils/` directory
- Review `transcriptCache.ts` for improvements
- Add utility functions for:
  - Transcript validation
  - Batch transcript operations
  - Transcript search/indexing helpers
- Add JSDoc comments to all functions
- Add error handling improvements
- Write tests for critical functions

**Acceptance Criteria:**
- All utility functions documented
- Error handling improved
- New helper functions added
- Code quality improved

---

### Story 9.4: Video Card UI Standardization

**Priority:** High  
**Story ID:** 9-4-video-card-standardization

**Goal:** Make video cards in `/videos` match the YouTube-style design from `/dev/youtube`

**Tasks:**
- Update `VideoCard.vue` component to match `/dev/youtube` design
- Features to include:
  - Thumbnail with duration badge (bottom-right)
  - Channel avatar (small, left side)
  - Title (2 lines max, truncated)
  - Channel name below title
  - View count and publish date ("X views • Y ago")
  - Hover effects matching YouTube
- Update `VideoList.vue` to use grid layout like `/dev/youtube`
- Ensure responsive design (1/2/3/4 columns based on screen size)
- Test on mobile devices

**Acceptance Criteria:**
- Video cards look like YouTube video cards
- Consistent across all pages using VideoCard component
- Responsive grid layout
- Smooth hover animations
- Duration badge visible
- View count and date displayed

**Design Reference:** `app/pages/dev/youtube.vue` lines 154-193

---

### Story 9.5: Video Detail Page Enhancement

**Priority:** Medium  
**Story ID:** 9-5-video-detail-enhancement

**Goal:** Improve video detail page UI to match YouTube and show complete relationships

**Tasks:**
- Redesign `/videos/[slug]` page layout
- Structure:
  1. Video player embed (YouTube iframe)
  2. Title and metadata (views, date, channel)
  3. Description (expandable)
  4. **Related Skills** (first section, prominent badges)
  5. Related Videos (same skills/category)
  6. Related Books
  7. Featured Writer (if applicable)
  8. Tags
  9. Transcript link (if available)
  10. Summary link (if available)
- Add YouTube-style tabs for different sections
- Improve mobile responsiveness

**Acceptance Criteria:**
- Video player embedded
- Skills shown prominently first
- All related content displayed
- Clean, YouTube-inspired design
- Mobile-friendly
- Links to transcript/summary pages

---

### Story 9.6: Transcript Content Analysis & Skill Extraction

**Priority:** High  
**Story ID:** 9-6-transcript-skill-extraction

**Goal:** Analyze transcripts to extract skill mentions and enhance relationships

**Tasks:**
- Create analysis script: `scripts/analyze-transcripts.ts`
- For each transcript:
  - Search for mentions of 15 skill names (Persian and English)
  - Search for mentions of book titles
  - Search for mentions of writer names
  - Count occurrences of each
- Generate relationship suggestions:
  - Video → Skills (based on mentions)
  - Video → Books (based on mentions)
  - Video → Writers (based on mentions)
- Output: `docs/sources/transcript-analysis-results.json`
- Review and approve suggested relationships
- Update video data with new relationships

**Acceptance Criteria:**
- Script analyzes all 128 transcripts
- Skill mentions detected and counted
- Book/writer mentions detected
- Relationship suggestions generated
- Results reviewed and approved
- Video data updated with new relationships

**Technical Notes:**
- Use fuzzy matching for skill names (variations, typos)
- Consider Persian text normalization
- Weight by mention frequency (more mentions = stronger relationship)
- Manual review before applying changes

---

### Story 9.7: Videos Page Category Organization

**Priority:** High  
**Story ID:** 9-7-videos-page-category-organization

**Goal:** Organize videos page by categories with expansion panels and skill badges

**Tasks:**
- Update `/videos` page structure
- For each category (Health, Identity, Career):
  - Show category name and description
  - Use expansion panel (collapsible)
  - Show video count
  - Display videos in grid (YouTube-style cards)
- For "Other Videos" category:
  - Show all videos not in main 3 categories
  - Display skill badges for each video (all related skills)
  - Use expansion panel
- For main 2 videos (15 skills videos):
  - Add special "Featured" badge
  - Show at top of relevant category
- Ensure skill badges clickable (filter by skill)

**Acceptance Criteria:**
- Videos organized by category
- Expansion panels for each category
- Skill badges on all videos
- Featured badge on main 2 videos
- Clickable skill badges (filter)
- Responsive grid layout

**Design Notes:**
- Use Nuxt UI `UAccordion` or `UCard` with collapsible header
- Default: All categories expanded
- Skill badges: Use `UBadge` component, primary color
- Featured badge: Gold/star color

---

### Story 9.8: Playlists Page Redesign

**Priority:** Medium  
**Story ID:** 9-8-playlists-page-redesign

**Goal:** Redesign playlists page to use real YouTube data and show relationships

**Tasks:**
- Update `/playlists` page to use cached YouTube data
- Fetch playlist metadata from YouTube API
- Display:
  - Playlist thumbnail
  - Playlist title and description
  - Video count
  - Related skills (aggregate from videos in playlist)
  - Related categories
- Link to playlist detail page
- Show videos in playlist (preview, first 3-5)
- Add "View Full Playlist" button

**Acceptance Criteria:**
- Real YouTube playlist data displayed
- Playlist cards with thumbnails
- Related skills shown
- Video previews included
- Links to detail pages
- Responsive design

---

### Story 9.9: Summary Page Redesign

**Priority:** Medium  
**Story ID:** 9-9-summary-page-redesign

**Goal:** Make summary page match transcript page design and functionality

**Tasks:**
- Update `/summary` page to match `/transcript` page structure
- Features:
  - List of all videos with summaries
  - Search functionality (search within summaries)
  - Filter by skill, category, writer
  - Click video title to show summary
  - Summary displayed in expandable card
  - Link to full video page
  - Link to transcript page
- Special highlight for main 15 skills video (at top)
- Show summary metadata (word count, key points)

**Acceptance Criteria:**
- Page matches transcript page design
- Video list with search
- Summaries displayed on click
- Filters working (skill, category, writer)
- Main video highlighted at top
- Links to related pages

---

### Story 9.10: Transcript Page Click-to-Expand

**Priority:** Low  
**Story ID:** 9-10-transcript-click-expand

**Goal:** Add click-to-expand functionality to transcript page

**Tasks:**
- Update `/transcript` page
- Change from showing all transcripts to showing titles only
- On click:
  - Expand to show full transcript
  - Smooth animation
  - Collapse others (accordion style)
- Add search within expanded transcript
- Add copy button for transcript text
- Add download button (plain text)

**Acceptance Criteria:**
- Video titles listed
- Click to expand transcript
- Smooth animations
- Search within transcript
- Copy and download buttons
- Only one expanded at a time (accordion)

---

### Story 9.11: Hero Section Advanced Search

**Priority:** High  
**Story ID:** 9-11-hero-advanced-search

**Goal:** Add advanced search to home page hero section

**Tasks:**
- Update hero section on home page (`/`)
- Add search input with autocomplete
- Search across:
  - Video titles and descriptions
  - Transcript content
  - Summary content
  - Book titles
  - Writer names
  - Skill names
- Show suggestions as user types
- Categorize results:
  - Videos (with skill badges)
  - Books (with related skills)
  - Writers (with related skills)
  - Skills
- Click result to navigate to detail page
- Show "View All Results" link

**Acceptance Criteria:**
- Search input in hero section
- Autocomplete suggestions
- Search across all content types
- Results categorized
- Clickable results
- Fast search (< 200ms)
- Mobile-friendly

**Technical Notes:**
- Use Fuse.js for fuzzy search
- Index all content at build time
- Client-side search for speed
- Consider server-side for transcript full-text search

---

### Story 9.12: Model Relationships - Skills First

**Priority:** High  
**Story ID:** 9-12-model-relationships-skills-first

**Goal:** Ensure all model detail pages show related skills first

**Tasks:**
- Audit all detail pages:
  - `/videos/[slug]`
  - `/books/[slug]`
  - `/writers/[slug]`
  - `/playlists/[slug]`
  - `/tags/[slug]`
- Ensure "Related Skills" section is first
- Use consistent design for related skills:
  - Skill badges (clickable)
  - Grid layout
  - Skill name and category
- Add "Related Skills" to pages that don't have it
- Ensure bidirectional relationships work

**Acceptance Criteria:**
- All detail pages show related skills first
- Consistent design across pages
- Skills clickable (navigate to skill page)
- Bidirectional relationships verified
- Mobile-friendly

---

### Story 9.13: Transcript-Based Relationship Enhancement

**Priority:** Medium  
**Story ID:** 9-13-transcript-relationship-enhancement

**Goal:** Use transcript analysis to enhance all model relationships

**Tasks:**
- Based on Story 9.6 analysis results
- Update video data with detected relationships
- For each video:
  - Add skills mentioned in transcript
  - Add books mentioned in transcript
  - Add writers mentioned in transcript
- Update reverse relationships:
  - Skills → Videos (videos mentioning this skill)
  - Books → Videos (videos mentioning this book)
  - Writers → Videos (videos mentioning this writer)
- Generate relationship strength scores (mention frequency)
- Store in data files

**Acceptance Criteria:**
- Video relationships enhanced with transcript data
- Reverse relationships updated
- Relationship strength scores calculated
- Data files updated
- All relationships bidirectional

**Data Files to Update:**
- `app/data/videos/fa/index.ts`
- `app/data/videos/en/index.ts`
- `app/data/skills/fa/index.ts`
- `app/data/skills/en/index.ts`
- `app/data/books/fa/index.ts`
- `app/data/books/en/index.ts`
- `app/data/writers/fa/index.ts`
- `app/data/writers/en/index.ts`

---

### Story 9.14: Transcript Generation Stability & Data Integrity

**Priority:** High  
**Story ID:** 9-14-transcript-generation-stability

**Goal:** Ensure transcript generation scripts only regenerate changed or new transcripts, preventing unnecessary database changes

**Tasks:**
- Create transcript manifest system (`app/data/transcripts/manifest.json`)
- Add status tracking (draft/confirmed/locked)
- Implement content hashing (SHA-256)
- Create smart generation script that:
  - Skips locked transcripts
  - Skips unchanged transcripts (same hash)
  - Only generates new or modified transcripts
- Create transcript management commands:
  - Lock/unlock transcripts
  - Confirm transcripts
  - List transcript statuses
- Create new video detection script
- Implement data integrity rules
- Test stability (no changes on second run)

**Acceptance Criteria:**
- Manifest file tracks all transcript statuses
- Locked transcripts never regenerate
- Unchanged transcripts skipped (no file changes)
- Git shows no changes if nothing actually changed
- New videos detected and processed separately
- Bilingual files stay in sync
- Management commands work correctly
- Documentation updated with new workflow

**Technical Notes:**
- Use SHA-256 for content hashing
- Manifest file committed to git
- Version tracking for all transcripts
- Bilingual consistency warnings
- Protected content (locked = immutable)

---

## Epic Success Criteria

### Completion Checklist
- [ ] All 13 stories completed
- [ ] Type definitions sharded and organized
- [ ] All transcripts verified complete
- [ ] Server utils improved and documented
- [ ] Video cards match YouTube design everywhere
- [ ] Video detail pages enhanced
- [ ] Transcript analysis completed
- [ ] Relationships enhanced with transcript data
- [ ] Videos page organized by category
- [ ] Playlists page redesigned
- [ ] Summary page redesigned
- [ ] Transcript page has click-to-expand
- [ ] Hero search implemented
- [ ] Skills shown first on all detail pages

### Quality Metrics
- [ ] All pages mobile-responsive
- [ ] Page load time < 2s
- [ ] Search results < 200ms
- [ ] No broken links
- [ ] All relationships bidirectional
- [ ] Consistent UI across all pages

### Documentation
- [ ] All new features documented
- [ ] API changes documented
- [ ] User guide updated
- [ ] Developer guide updated

---

## Dependencies

### External
- YouTube API (for playlist data)
- yt-dlp (for transcript fetching)

### Internal
- Epic 8 completion (YouTube integration)
- Existing video, skill, book, writer data
- Transcript files in `server/data/transcripts/`

---

## Timeline Estimate

**Total Effort:** ~40-50 hours

**Story Breakdown:**
- 9.1: 2-3 hours
- 9.2: 3-4 hours
- 9.3: 4-5 hours
- 9.4: 4-5 hours
- 9.5: 5-6 hours
- 9.6: 6-8 hours (most complex)
- 9.7: 4-5 hours
- 9.8: 4-5 hours
- 9.9: 3-4 hours
- 9.10: 2-3 hours
- 9.11: 5-6 hours
- 9.12: 3-4 hours
- 9.13: 4-5 hours

**Recommended Order:**
1. 9.1 (Type sharding - foundation)
2. 9.2 (Transcript audit - data quality)
3. 9.6 (Transcript analysis - relationship data)
4. 9.13 (Relationship enhancement - data updates)
5. 9.4 (Video cards - UI foundation)
6. 9.12 (Skills first - relationship display)
7. 9.5, 9.7, 9.8, 9.9, 9.10 (Page enhancements)
8. 9.11 (Advanced search - final feature)
9. 9.3 (Utils enhancement - cleanup)

---

## Notes

- This epic closes out the core feature set for the 15ecosystem project
- Focus is on polish, consistency, and completeness
- Transcript analysis is key to improving content relationships
- Skills as central organizing principle must be maintained
- YouTube-style UI provides familiar, professional appearance

---

**Last Updated:** 2025-11-23  
**Epic Owner:** Development Team  
**Status:** Ready for Sprint Planning

