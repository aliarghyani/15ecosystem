# Server Utilities Documentation

This directory contains server-side utility functions for the 15ecosystem project.

## Transcript Utilities

### transcriptCache.ts
Core transcript caching and fetching utilities.

**Key Functions:**
- `hasTranscript(videoId)` - Check if transcript exists
- `getTranscript(videoId)` - Get cached transcript
- `fetchTranscript(videoId, options)` - Fetch transcript using yt-dlp
- `getAllTranscripts()` - Get all available transcript IDs
- `getTranscriptStats()` - Get transcript statistics

**Example:**
```typescript
import { getTranscript, getTranscriptStats } from '~/server/utils/transcriptCache'

// Get a transcript
const transcript = await getTranscript('abc123')
if (transcript) {
  console.log(`${transcript.title}: ${transcript.segments.length} segments`)
}

// Get statistics
const stats = await getTranscriptStats()
console.log(`Total: ${stats.total}, Available: ${stats.available}`)
```

### transcriptValidation.ts
Validation utilities for transcript data integrity.

**Key Functions:**
- `validateTranscript(transcript)` - Validate transcript object with detailed error reporting
- `validateTranscriptFile(filePath)` - Validate transcript JSON file
- `validateTranscriptStructure(data)` - Quick structure check

**Example:**
```typescript
import { validateTranscript } from '~/server/utils/transcriptValidation'

const result = validateTranscript(transcript)
if (!result.valid) {
  console.error('Validation errors:', result.errors)
  console.warn('Warnings:', result.warnings)
}
console.log('Stats:', result.stats)
```

### transcriptBatch.ts
Batch operations for processing multiple transcripts.

**Key Functions:**
- `loadAllTranscripts(onProgress?)` - Load all transcripts with progress tracking
- `validateAllTranscripts(onProgress?)` - Validate all transcripts
- `processTranscriptsBatch(processor, onProgress?)` - Custom batch processing

**Example:**
```typescript
import { validateAllTranscripts } from '~/server/utils/transcriptBatch'

const result = await validateAllTranscripts((current, total, videoId) => {
  console.log(`Validating ${current}/${total}: ${videoId}`)
})

console.log(`Valid: ${result.results.filter(r => r.valid).length}`)
console.log(`Invalid: ${result.results.filter(r => !r.valid).length}`)
```

### transcriptSearch.ts
Search utilities with Persian text support.

**Key Functions:**
- `searchTranscripts(query, options?)` - Search across all transcripts
- `searchTranscriptByVideoId(videoId, query)` - Search within specific video
- `findTranscriptSegments(videoId, keyword)` - Find matching segments with context

**Features:**
- Case-insensitive search
- Persian text normalization (ی/ي, ک/ك normalization)
- Context extraction (surrounding segments)
- Relevance scoring

**Example:**
```typescript
import { searchTranscripts } from '~/server/utils/transcriptSearch'

// Search in English
const results = await searchTranscripts('leadership', { maxResults: 10 })

// Search in Persian (with automatic normalization)
const persianResults = await searchTranscripts('رهبری', { maxResults: 10 })

results.forEach(result => {
  console.log(`${result.title}: ${result.matches.length} matches`)
  result.matches.forEach(match => {
    console.log(`  - "${match.segment.text}" (score: ${match.score})`)
  })
})
```

## YouTube API Utilities

### youtubeClient.ts
YouTube API client wrapper with rate limiting.

**Key Functions:**
- `getChannelByHandle(handle)` - Get channel data
- `getPlaylistsByChannelId(channelId)` - Get all playlists
- `getAllPlaylistItems(playlistId)` - Get playlist items (paginated)
- `getVideosByIds(videoIds)` - Get video data (batched)

### metadataCache.ts
YouTube metadata caching utilities.

**Key Functions:**
- `getCachedChannel(handle)` / `setCachedChannel(handle, data)`
- `getCachedUploads(handle)` / `setCachedUploads(handle, data)`
- `getCachedVideos(videoIds)` / `setCachedVideos(videos)`
- `clearCache()` - Clear all cache
- `getCacheStats()` - Get cache statistics

## Other Utilities

### isoDuration.ts
ISO 8601 duration parsing and formatting.

**Key Functions:**
- `parseIsoDuration(duration)` - Parse ISO duration to seconds
- `formatToIsoDuration(seconds)` - Format seconds to ISO duration
- `formatDuration(seconds)` - Format to human-readable (MM:SS or HH:MM:SS)

**Example:**
```typescript
import { parseIsoDuration, formatDuration } from '~/server/utils/isoDuration'

const seconds = parseIsoDuration('PT1H23M45S') // 5025
const formatted = formatDuration(seconds) // "1:23:45"
```

## Error Handling

All utilities follow consistent error handling patterns:
- Try-catch blocks for file system and network operations
- Meaningful error messages with context
- Error logging with `console.error`
- Graceful degradation (return null/empty array instead of throwing)

## Testing

Tests are located in `__tests__/` subdirectory. Run tests with:
```bash
pnpm test
```

## TypeScript Types

All utilities are fully typed with exported interfaces:
- `TranscriptSegment` - Transcript segment with timing
- `VideoTranscriptData` - Complete transcript data
- `TranscriptValidationResult` - Validation result with errors/warnings
- `BatchOperationResult<T>` - Batch operation result
- `SearchResult` - Search result with matches

Import types from the utility modules:
```typescript
import type { VideoTranscriptData, TranscriptSegment } from '~/server/utils/transcriptCache'
import type { TranscriptValidationResult } from '~/server/utils/transcriptValidation'
```
