# Story 8.2: Text Analysis Utilities & Core Functions

**Epic:** Epic 8 - Video Transcript Data Analysis & Analytics  
**Status:** done  
**Story ID:** 8-2-text-analysis-utilities-core-functions

## User Story

As a developer,
I want text analysis utilities for processing video transcripts,
So that I can generate various analytics reports.

## Acceptance Criteria

**Given** I have video transcripts
**When** I use analysis utilities
**Then** I have:
- Word frequency analysis (count occurrences of words/phrases)
- Case-insensitive and case-sensitive search options
- Phrase/name mention counting (e.g., "Andrew Huberman", "health")
- Multi-word phrase detection
- Text normalization (remove punctuation, handle Persian/English)
- Stop word filtering (optional)
- Stemming support (optional, for advanced analysis)
- Performance optimized for large text corpus (127 videos)

**Prerequisites:** Story 8.1

## Technical Requirements

### Core Functions

**Location:** `app/utils/text-analysis.ts`

**Functions:**
- `normalizeText(text, locale)` - Normalize text for analysis
- `tokenize(text, locale)` - Tokenize text into words
- `countWordOccurrences(text, word, options)` - Count word occurrences
- `countPhraseOccurrences(text, phrase, options)` - Count phrase occurrences
- `getWordFrequency(text, options)` - Get word frequency analysis
- `findMentions(text, searchTerms, options)` - Find mentions of terms
- `getTopWords(text, topN, options)` - Get top N words by frequency

### Options & Types

**Interfaces:**
- `AnalysisOptions` - Options for analysis operations
- `FrequencyOptions` - Options for frequency analysis
- `WordFrequency` - Word frequency result
- `MentionResult` - Mention result for search terms

### Features

- Support for both Persian and English text
- Case-sensitive and case-insensitive search
- Stop word filtering (default lists for EN/FA)
- Custom stop word lists
- Text normalization (punctuation removal, whitespace normalization)
- Word boundary detection for accurate counting
- Configurable minimum word length
- Sorting options (by count or alphabetical)
- Result limiting

## Tasks

- [x] Task 1: Create text-analysis.ts utility file
- [x] Task 2: Implement normalizeText function
- [x] Task 3: Implement tokenize function
- [x] Task 4: Implement countWordOccurrences function
- [x] Task 5: Implement countPhraseOccurrences function
- [x] Task 6: Implement getWordFrequency function
- [x] Task 7: Implement findMentions function
- [x] Task 8: Implement getTopWords helper function
- [x] Task 9: Add stop words lists (English and Persian)
- [x] Task 10: Add TypeScript interfaces and types
- [x] Task 11: Add JSDoc comments

## Implementation Notes

- Text normalization handles both Persian and English properly
- Persian text normalization preserves RTL characters
- English normalization converts to lowercase
- Stop words filtering is optional and configurable
- Word boundary detection ensures accurate counting
- Performance optimized with efficient algorithms
- Ready for memoization if needed for large corpus

## Completed Features

- ✅ Text normalization for Persian and English
- ✅ Word tokenization
- ✅ Word occurrence counting
- ✅ Phrase occurrence counting
- ✅ Word frequency analysis
- ✅ Mention finding
- ✅ Stop word filtering
- ✅ Configurable options
- ✅ TypeScript types and interfaces
- ✅ JSDoc documentation

