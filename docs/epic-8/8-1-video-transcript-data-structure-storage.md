# Story 8.1: Video Transcript Data Structure & Storage

**Epic:** Epic 8 - Video Transcript Data Analysis & Analytics  
**Status:** done  
**Story ID:** 8-1-video-transcript-data-structure-storage

## User Story

As a developer,
I want a structured way to store and access video transcripts,
So that I can perform analysis on the full text of all videos.

## Acceptance Criteria

**Given** I have video transcripts from 127 videos
**When** I structure the data
**Then** I have:
- VideoTranscript type with video ID, transcript text, metadata
- Storage structure for all 127 video transcripts
- Efficient access methods for querying transcripts
- Support for both Persian and English transcripts
- Transcript metadata (video ID, length, word count, etc.)
- TypeScript types defined
- Utility functions for transcript operations

**Prerequisites:** Epic 7 (Video integration)

## Technical Requirements

### Type Definitions

**Location:** `app/types/transcripts.ts`

**Types:**
- `VideoTranscript` interface with:
  - `videoId`: string (YouTube video ID)
  - `transcript`: string (full transcript text)
  - `wordCount`: number
  - `characterCount`: number (including spaces)
  - `characterCountNoSpaces`: number (excluding spaces)
  - `locale`: 'fa' | 'en'
  - `updatedAt`: optional string
  - `metadata`: optional object with language confidence, speakers, timestamps

- `TranscriptMetadata` interface for listing/searching

### Data Storage

**Location:** `app/data/transcripts/fa/` and `app/data/transcripts/en/`

**Structure:**
- `index.ts` files exporting transcripts as Record<string, VideoTranscript>
- Each transcript mapped by videoId
- Lazy loading support for performance

### Utility Functions

**Location:** `app/utils/transcripts.ts`

**Functions:**
- `getTranscriptByVideoId(videoId, locale)` - Get single transcript
- `getAllTranscripts(locale)` - Get all transcripts
- `getAllTranscriptMetadata(locale)` - Get metadata for listing
- `hasTranscript(videoId, locale)` - Check if transcript exists
- `getTranscriptWordCount(videoId, locale)` - Get word count
- `getTranscriptCharacterCount(videoId, locale)` - Get character count
- `searchTranscripts(searchText, locale, caseSensitive)` - Search transcripts
- `countMentions(searchText, locale, caseSensitive)` - Count mentions

## Tasks

- [x] Task 1: Define VideoTranscript interface
- [x] Task 2: Define TranscriptMetadata interface
- [x] Task 3: Create transcript data directory structure
- [x] Task 4: Create fa/index.ts with transcript storage
- [x] Task 5: Create en/index.ts with transcript storage
- [x] Task 6: Create transcripts utility functions
- [x] Task 7: Export types from main types index
- [x] Task 8: Add search and count functions

## Implementation Notes

- Transcripts stored as Record<string, VideoTranscript> for O(1) lookup
- Support for both Persian and English transcripts
- Metadata includes word count, character count for analytics
- Search functions support case-sensitive and case-insensitive modes
- Lazy loading ready (transcripts loaded on-demand)
- Structure ready for future indexing enhancements

## Completed Features

- ✅ VideoTranscript interface defined
- ✅ TranscriptMetadata interface defined
- ✅ Data directory structure created
- ✅ Persian transcript storage structure
- ✅ English transcript storage structure
- ✅ Utility functions for transcript access
- ✅ Search functionality
- ✅ Mention counting functionality
- ✅ Type exports configured

