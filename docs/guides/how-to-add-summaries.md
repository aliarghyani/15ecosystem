# How to Add Video Summaries Manually

This guide explains how to manually add summaries for videos.

## File Location

**Persian Summaries:** `app/data/summaries/fa/index.ts`  
**English Summaries:** `app/data/summaries/en/index.ts`

## File Naming Convention

**Use the Persian video title as the filename:**

- Example: `app/data/summaries/fa/۷ عادت برای افزایش سلامت، قدرت و طول عمر.yml`
- You can also add summaries directly to `index.ts` if preferred

## Format

### Option 1: Add to TypeScript File Directly

Edit `app/data/summaries/fa/index.ts` and add entries to the `summaries` object:

```typescript
export const summaries: Record<string, VideoSummary> = {
  'hxnS40NolrA': {
    videoId: 'hxnS40NolrA',
    summary: `Your extended summary text here...
    Can be multiple lines.
    Use template literals for multi-line text.`,
    wordCount: 1234,
    characterCount: 5678,
    characterCountNoSpaces: 4567,
    locale: 'fa',
    updatedAt: new Date().toISOString(),
    metadata: {
      keyPoints: [
        'Key point 1',
        'Key point 2'
      ],
      topics: ['longevity', 'health'],
      readingTimeMinutes: 5
    }
  }
}
```

### Option 2: Create YAML File (Future Support)

You can also create YAML files similar to transcripts:

- `app/data/summaries/fa/۷ عادت برای افزایش سلامت، قدرت و طول عمر.yml`

```yaml
summary: |
  Your extended summary text here...
  Can be multiple lines.

keyPoints:
  - Point 1
  - Point 2
  - Point 3

topics:
  - longevity
  - health
  - harvard
```

**Note:** YAML support for summaries is not yet implemented. For now, add summaries directly to the TypeScript files.

## Helper Functions

You can use these helper functions from `app/utils/summaries.ts`:

- `calculateReadingTime(wordCount)` - Calculate reading time from word count

Example:
```typescript
import { calculateReadingTime } from '~/utils/summaries'

const wordCount = 500
const readingTime = calculateReadingTime(wordCount) // Returns minutes
```

## Calculating Word/Character Counts

**Word Count:** Count words separated by whitespace  
**Character Count:** Use `summary.length`  
**Character Count (No Spaces):** Use `summary.replace(/\s+/g, '').length`  
**Reading Time:** Use `calculateReadingTime(wordCount)` or estimate ~225 words per minute

## Notes

- Use template literals (backticks) for multi-line text
- Update `updatedAt` to current timestamp when adding/editing
- Key points and topics are optional but recommended
- Reading time is automatically calculated if you use the helper function
- File names should match the Persian video title for consistency
