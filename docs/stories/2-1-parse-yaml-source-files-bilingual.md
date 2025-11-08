# Story 2.1: Parse YAML Source Files (Bilingual)

Status: review

## Story

As a developer,
I want to parse the video transcript and summary YAML files,
So that I can extract structured bilingual content for the platform.

## Acceptance Criteria

1. **Given** source YAML files exist (`youtubevideofulltext.yml`, `summaryofyoutubevideofulltext.yml`)
   **When** I parse them
   **Then** I can extract:
   - Full video transcript text (Persian)
   - Video summary sections (Persian)
   - All 15 skills with their content (Persian)
   - Book references for each skill
   - Category groupings (Health 1-6, Identity/Career 7-15)
   - English translations prepared for all content

2. **Given** content is parsed
   **When** I structure it
   **Then** content is structured in a usable format (JSON/TypeScript types)
   **And** both Persian and English versions are available

3. **Given** parsed content
   **When** I save it
   **Then** content is saved to `app/data/fa/` and `app/data/en/` directories
   **And** TypeScript types are used for type safety

## Tasks / Subtasks

- [x] Task 1: Set up parsing utilities (AC: #1, #2)
  - [x] Create `app/utils/content.ts` for content parsing utilities
  - [x] Install/verify js-yaml dependency (not needed - files are plain text)
  - [x] Create parser functions for transcript and summary files

- [x] Task 2: Parse full transcript (AC: #1)
  - [x] Read `docs/sources/youtubevideofulltext.yml`
  - [x] Extract full transcript text
  - [x] Handle UTF-8 encoding for Persian text
  - [x] Structure transcript data

- [x] Task 3: Parse summary file (AC: #1)
  - [x] Read `docs/sources/summaryofyoutubevideofulltext.yml`
  - [x] Extract summary sections
  - [x] Extract skill information (1-15)
  - [x] Extract book references
  - [x] Extract category groupings

- [x] Task 4: Extract 15 skills content (AC: #1)
  - [x] Parse each skill (1-15) from summary
  - [x] Extract skill name (Persian)
  - [x] Extract "why it matters" content (Persian)
  - [x] Extract "how to" content (Persian)
  - [x] Extract book references for each skill
  - [x] Assign category (Health 1-6, Identity 7-12, Career 13-15)

- [x] Task 5: Create TypeScript data structures (AC: #2, #3)
  - [x] Create `app/data/fa/skills.ts` with Persian skill data
  - [x] Create `app/data/fa/categories.ts` with Persian category data
  - [x] Create `app/data/fa/books.ts` with Persian book references
  - [x] Create `app/data/fa/transcript.ts` with full transcript
  - [x] Create `app/data/fa/summary.ts` with summary content
  - [x] Use types from `app/types/index.ts`

- [x] Task 6: Prepare English translations structure (AC: #1, #2)
  - [x] Create `app/data/en/skills.ts` with English skill data structure (placeholders)
  - [x] Create `app/data/en/categories.ts` with English category data structure
  - [x] Create `app/data/en/books.ts` with English book references
  - [x] Create `app/data/en/transcript.ts` with English transcript placeholder
  - [x] Create `app/data/en/summary.ts` with English summary placeholder
  - [x] Note: English translations will be added in future stories

- [x] Task 7: Verify data structure (AC: #2, #3)
  - [x] Verify all data files compile with TypeScript
  - [x] Verify types match `app/types/index.ts` definitions
  - [x] Test importing data files
  - [x] Verify UTF-8 encoding works correctly

## Dev Notes

### Architecture Patterns and Constraints

**Reference Architecture:** https://github.com/aliarghyani/nuxt-portfolio

**Key Architectural Decisions:**
- **Data Organization:** Separate EN/FA files in `app/data/en/` and `app/data/fa/` [Source: docs/architecture.md#Project-Structure]
- **Type Safety:** Use TypeScript types from `app/types/index.ts` [Source: docs/architecture.md#Project-Structure]
- **Content Parsing:** Parse at build time, store as TypeScript modules [Source: docs/architecture.md#Technology-Stack-Details]

**Technical Constraints:**
- Must handle UTF-8 encoding for Persian text correctly
- Must use existing TypeScript types from `app/types/index.ts`
- Data files must be importable as ES modules
- English translations are placeholders for now (will be added later)

### Project Structure Notes

**Data Files Location:**
- `app/data/fa/` - Persian content (parsed from YAML sources)
- `app/data/en/` - English content (structure ready, translations to be added)

**Parser Utilities:**
- `app/utils/content.ts` - Content parsing utilities

### Testing Standards

**Parsing Verification:**
- Verify all 15 skills are extracted correctly
- Verify book references are captured
- Verify categories are assigned correctly (Health 1-6, Identity 7-12, Career 13-15)
- Verify UTF-8 encoding preserves Persian characters
- Verify TypeScript compilation succeeds

### References

- [Source: docs/epics.md#Story-2.1-Parse-YAML-Source-Files-Bilingual] - Story acceptance criteria and technical notes
- [Source: docs/architecture.md#Project-Structure] - Data organization structure
- [Source: docs/architecture.md#Technology-Stack-Details] - Content parsing approach
- [Source: app/types/index.ts] - TypeScript type definitions

### Learnings from Previous Story

**From Story 1.2:**
- Data directory structure is ready (`app/data/en/` and `app/data/fa/`)
- TypeScript types are defined in `app/types/index.ts`
- Utils directory exists for parsing utilities

## Dev Agent Record

### Context Reference

<!-- Story context will be created by story-context workflow if needed -->

### Agent Model Used

Composer (BMAD DEV Agent)

### Debug Log References

### Completion Notes List

✅ **Story 2.1 Implementation Complete** (2025-01-XX)

**Key Accomplishments:**
- Created content parsing utilities in `app/utils/content.ts`
- Successfully parsed all 15 skills from summary file
- Extracted 13 unique book references
- Generated all Persian (fa) data files with structured content
- Created English (en) placeholder files ready for translations
- All data files use TypeScript types for type safety
- UTF-8 encoding properly handles Persian characters

**Technical Implementation:**
- Created parser that handles markdown-like structure in summary file
- Correctly maps skills 1-6 (Health), 7-12 (Identity), 13-15 (Career)
- Extracts book references using regex pattern matching
- Generates TypeScript data files that can be imported as ES modules
- Created generation script: `pnpm generate:content`

**Parser Features:**
- Handles section-based skill numbering (Health section: 1-6, Identity section: 1-9 → 7-15)
- Extracts "why it matters" and "how to" content for each skill
- Collects and deduplicates book references across skills
- Preserves UTF-8 encoding for Persian text

**Generated Files:**
- `app/data/fa/skills.ts` - 15 skills with Persian content
- `app/data/fa/categories.ts` - 3 categories (Health, Identity, Career)
- `app/data/fa/books.ts` - 13 unique book references
- `app/data/fa/transcript.ts` - Full video transcript (Persian)
- `app/data/fa/summary.ts` - Video summary (Persian)
- `app/data/en/*.ts` - English placeholder files (ready for translations)

**Verification:**
- ✅ All 15 skills parsed correctly
- ✅ Categories assigned correctly (Health 1-6, Identity 7-12, Career 13-15)
- ✅ Book references extracted and linked to skills
- ✅ TypeScript types match `app/types/index.ts`
- ✅ UTF-8 encoding verified (Persian characters preserved)
- ✅ Data files can be imported successfully

**Next Steps:**
- English translations will be added in future stories
- Content can be regenerated anytime using `pnpm generate:content`

### File List

**Created Utilities:**
- `app/utils/content.ts` - Content parsing utilities (parseTranscript, parseSkillsFromSummary, parseCategories, parseSummary, collectAllBooks, extractBooks)

**Created Scripts:**
- `scripts/generate-content-data.ts` - Script to generate all data files from source YAML files

**Generated Persian Data Files:**
- `app/data/fa/skills.ts` - 15 skills with Persian content
- `app/data/fa/categories.ts` - 3 categories
- `app/data/fa/books.ts` - 13 unique book references
- `app/data/fa/transcript.ts` - Full video transcript
- `app/data/fa/summary.ts` - Video summary

**Generated English Data Files (Placeholders):**
- `app/data/en/skills.ts` - Skill structure with empty English fields
- `app/data/en/categories.ts` - Categories (English already present)
- `app/data/en/books.ts` - Book references (same as Persian)
- `app/data/en/transcript.ts` - Empty placeholder
- `app/data/en/summary.ts` - Empty placeholder

**Updated Files:**
- `package.json` - Added `generate:content` script

