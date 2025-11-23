# Story 9.2: Transcript Completeness Audit

**Epic:** Epic 9 - Content Relationships & UI Polish  
**Status:** backlog  
**Story ID:** 9-2-transcript-audit  
**Priority:** High

## User Story

As a developer,
I want to verify all 128 videos have complete, valid transcripts,
So that transcript analysis and content features work correctly.

## Acceptance Criteria

**Given** I have 128 transcript files in `server/data/transcripts/`  
**When** I audit all transcript files  
**Then** I have:
- Report showing status of all 128 transcripts
- Identification of incomplete or invalid transcripts
- All transcripts with valid JSON structure
- All transcripts with non-empty `fullText` field
- All transcripts with reasonable segment counts
- Re-fetched transcripts for any incomplete ones
- 100% transcript completeness

**Prerequisites:** Epic 8 (YouTube integration)

## Technical Requirements

### Audit Script

**Location:** `scripts/audit-transcripts.ts`

**Functionality:**
1. Read all files from `server/data/transcripts/`
2. For each file:
   - Parse JSON
   - Check structure validity
   - Check `fullText` field (not empty, not null)
   - Check `segments` array (length > 0)
   - Check segment count (warn if < 10)
   - Check video ID matches filename
   - Check source field (generated, manual, unavailable)
3. Generate report
4. Identify files needing re-fetch

**Report Format:**
```json
{
  "auditDate": "2025-11-23T10:00:00Z",
  "totalFiles": 128,
  "valid": 125,
  "invalid": 3,
  "incomplete": 2,
  "empty": 1,
  "issues": [
    {
      "file": "videoId123.json",
      "videoId": "videoId123",
      "issue": "empty_fulltext",
      "segmentCount": 0,
      "source": "generated"
    }
  ],
  "summary": {
    "needsRefetch": ["videoId123", "videoId456"],
    "validTranscripts": 125,
    "invalidStructure": 1,
    "emptyContent": 2
  }
}
```

### Validation Checks

**1. File Structure:**
```typescript
interface TranscriptFile {
  videoId: string
  title: string
  fetchedAt: string
  source: 'generated' | 'manual' | 'unavailable'
  language: string
  segments: Array<{
    start: number
    end: number
    text: string
  }>
  fullText: string
}
```

**2. Validation Rules:**
- `videoId` must be non-empty string
- `segments` must be array with length > 0
- `fullText` must be non-empty string (length > 100)
- `source` must be one of: 'generated', 'manual', 'unavailable'
- `language` should be 'fa' or 'en'
- Segment count should be reasonable (> 10 for most videos)

**3. Warning Conditions:**
- Segment count < 10 (may indicate incomplete)
- `fullText` length < 500 (may indicate very short video or incomplete)
- `source` is 'unavailable' (transcript not available)

### Re-fetch Process

**For incomplete transcripts:**
1. Identify video IDs needing re-fetch
2. Use existing `/api/youtube/transcript-batch` endpoint
3. Fetch with `language: 'fa'` (or 'en' if Persian unavailable)
4. Verify new transcript is complete
5. Update audit report

## Tasks

- [ ] Task 1: Create `scripts/audit-transcripts.ts` script
- [ ] Task 2: Implement file reading and JSON parsing
- [ ] Task 3: Implement validation checks
- [ ] Task 4: Generate audit report
- [ ] Task 5: Run audit on all 128 transcripts
- [ ] Task 6: Review audit report
- [ ] Task 7: Re-fetch incomplete transcripts
- [ ] Task 8: Verify all transcripts complete
- [ ] Task 9: Save final audit report to `docs/sources/transcript-audit-report.json`
- [ ] Task 10: Document any videos with unavailable transcripts

## Script Implementation

```typescript
// scripts/audit-transcripts.ts
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface TranscriptSegment {
  start: number
  end: number
  text: string
}

interface TranscriptFile {
  videoId: string
  title: string
  fetchedAt: string
  source: 'generated' | 'manual' | 'unavailable'
  language: string
  segments: TranscriptSegment[]
  fullText: string
}

interface AuditIssue {
  file: string
  videoId: string
  issue: string
  segmentCount: number
  fullTextLength: number
  source: string
}

interface AuditReport {
  auditDate: string
  totalFiles: number
  valid: number
  invalid: number
  incomplete: number
  empty: number
  issues: AuditIssue[]
  summary: {
    needsRefetch: string[]
    validTranscripts: number
    invalidStructure: number
    emptyContent: number
    unavailable: number
  }
}

async function auditTranscripts() {
  const transcriptsDir = join(process.cwd(), 'server', 'data', 'transcripts')
  const files = await readdir(transcriptsDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  const report: AuditReport = {
    auditDate: new Date().toISOString(),
    totalFiles: jsonFiles.length,
    valid: 0,
    invalid: 0,
    incomplete: 0,
    empty: 0,
    issues: [],
    summary: {
      needsRefetch: [],
      validTranscripts: 0,
      invalidStructure: 0,
      emptyContent: 0,
      unavailable: 0
    }
  }

  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(transcriptsDir, file), 'utf-8')
      const transcript: TranscriptFile = JSON.parse(content)

      // Validate structure
      if (!transcript.videoId || !transcript.segments || !transcript.fullText) {
        report.invalid++
        report.summary.invalidStructure++
        report.issues.push({
          file,
          videoId: transcript.videoId || 'unknown',
          issue: 'invalid_structure',
          segmentCount: transcript.segments?.length || 0,
          fullTextLength: transcript.fullText?.length || 0,
          source: transcript.source || 'unknown'
        })
        continue
      }

      // Check if unavailable
      if (transcript.source === 'unavailable') {
        report.summary.unavailable++
        report.issues.push({
          file,
          videoId: transcript.videoId,
          issue: 'unavailable',
          segmentCount: 0,
          fullTextLength: 0,
          source: 'unavailable'
        })
        continue
      }

      // Check for empty content
      if (!transcript.fullText || transcript.fullText.trim().length < 100) {
        report.empty++
        report.summary.emptyContent++
        report.summary.needsRefetch.push(transcript.videoId)
        report.issues.push({
          file,
          videoId: transcript.videoId,
          issue: 'empty_fulltext',
          segmentCount: transcript.segments.length,
          fullTextLength: transcript.fullText?.length || 0,
          source: transcript.source
        })
        continue
      }

      // Check for low segment count
      if (transcript.segments.length < 10) {
        report.incomplete++
        report.summary.needsRefetch.push(transcript.videoId)
        report.issues.push({
          file,
          videoId: transcript.videoId,
          issue: 'low_segment_count',
          segmentCount: transcript.segments.length,
          fullTextLength: transcript.fullText.length,
          source: transcript.source
        })
        continue
      }

      // Valid transcript
      report.valid++
      report.summary.validTranscripts++
    } catch (error) {
      report.invalid++
      report.summary.invalidStructure++
      report.issues.push({
        file,
        videoId: 'parse_error',
        issue: `parse_error: ${error}`,
        segmentCount: 0,
        fullTextLength: 0,
        source: 'unknown'
      })
    }
  }

  // Save report
  const reportPath = join(process.cwd(), 'docs', 'sources', 'transcript-audit-report.json')
  await writeFile(reportPath, JSON.stringify(report, null, 2))

  console.log('Audit Report:')
  console.log(`Total Files: ${report.totalFiles}`)
  console.log(`Valid: ${report.valid}`)
  console.log(`Invalid: ${report.invalid}`)
  console.log(`Incomplete: ${report.incomplete}`)
  console.log(`Empty: ${report.empty}`)
  console.log(`Unavailable: ${report.summary.unavailable}`)
  console.log(`\nNeed Refetch: ${report.summary.needsRefetch.length}`)
  console.log(report.summary.needsRefetch)
  console.log(`\nReport saved to: ${reportPath}`)
}

auditTranscripts()
```

## Expected Results

### Success Metrics
- All 128 transcript files validated
- < 5% incomplete or invalid transcripts
- All incomplete transcripts re-fetched
- Final audit report shows 100% valid transcripts (excluding unavailable)

### Acceptable Exceptions
- Videos with unavailable transcripts (documented)
- Very short videos (< 1 minute) with low segment counts

## Notes

- Some videos may genuinely not have transcripts available
- Persian transcripts may not be available for all videos
- English transcripts can be used as fallback
- Manual transcripts (if any) should be preserved
- Re-fetching should not overwrite manual transcripts

---

**Estimated Effort:** 3-4 hours  
**Complexity:** Medium  
**Risk:** Low  
**Dependencies:** yt-dlp, YouTube API

