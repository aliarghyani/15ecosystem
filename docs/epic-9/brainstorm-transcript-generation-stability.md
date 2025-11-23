# Brainstorm: Transcript Generation Stability & Data Integrity

**Date:** 2025-11-23  
**Topic:** Prevent unnecessary database changes when running transcript generation scripts  
**Related Epic:** Epic 9 - Content Relationships & UI Polish

---

## Problem Statement

### Current Issue
When running transcript generation scripts, the database/data files change significantly each time, even for videos that already have transcripts. This causes:

1. **Data Instability:** Files change unnecessarily in git
2. **Bilingual Conflicts:** Persian and English files may get out of sync
3. **Risk of Data Loss:** Regenerating existing transcripts may overwrite good data
4. **Workflow Inefficiency:** No need to regenerate transcripts for already-shared videos

### Core Principle
**Once a video transcript is confirmed complete and generated, it should NEVER be regenerated or modified.**

---

## Current Workflow Analysis

### Transcript Generation Flow

**Current Script:** `scripts/generate-transcripts-from-yaml.ts`

```
1. Read all YAML files from app/data/transcripts/{locale}/
2. Parse each YAML file
3. Match to video ID from parsed-videos.json
4. Calculate word/character counts
5. Generate TypeScript files
6. Overwrite app/data/transcripts/{locale}/index.ts
```

**Problem:** Steps 5-6 regenerate ALL transcripts every time, even if they haven't changed.

### YouTube API Transcript Fetching Flow

**Current API:** `/api/youtube/transcript` and `/api/youtube/transcript-batch`

```
1. Receive video ID(s)
2. Check if transcript exists in server/data/transcripts/{videoId}.json
3. If exists, return cached
4. If not exists, fetch via yt-dlp
5. Save to server/data/transcripts/{videoId}.json
6. Return transcript
```

**Good:** This flow already has caching! ✅

### Data Files Affected

**1. Server-side (YouTube API):**
- `server/data/transcripts/{videoId}.json` - Individual transcript files
- These are ALREADY cached properly ✅

**2. App-side (Static data):**
- `app/data/transcripts/fa/index.ts` - Persian transcripts
- `app/data/transcripts/en/index.ts` - English transcripts
- These are REGENERATED every time ❌

---

## Root Cause Analysis

### Why Database Changes Every Time

**Issue 1: Timestamp Updates**
- Scripts may add `updatedAt` or `generatedAt` timestamps
- These change even if content is identical
- Solution: Only update timestamp if content actually changed

**Issue 2: Object Key Ordering**
- JavaScript object keys may be in different order
- JSON.stringify produces different output
- Solution: Sort keys consistently

**Issue 3: Whitespace/Formatting**
- Prettier or formatting tools may change whitespace
- Solution: Use consistent formatting rules

**Issue 4: Regenerating Unchanged Content**
- Scripts regenerate all files even if source hasn't changed
- Solution: Check if source changed before regenerating

**Issue 5: No "Locked" Status**
- No way to mark a transcript as "complete and locked"
- Solution: Add transcript status tracking

---

## Proposed Solutions

### Solution 1: Transcript Status Tracking

**Add status field to transcripts:**

```typescript
interface VideoTranscript {
  videoId: string
  transcript: string
  wordCount: number
  characterCount: number
  locale: 'fa' | 'en'
  status: 'draft' | 'confirmed' | 'locked' // NEW
  confirmedAt?: string // NEW
  lockedAt?: string // NEW
  version: number // NEW
  updatedAt?: string
}
```

**Status Definitions:**
- `draft`: Initial transcript, may need review
- `confirmed`: Reviewed and approved, but can be updated if needed
- `locked`: Final version, should NEVER be regenerated

### Solution 2: Transcript Manifest File

**Create:** `app/data/transcripts/manifest.json`

```json
{
  "version": "1.0.0",
  "lastGenerated": "2025-11-23T10:00:00Z",
  "transcripts": {
    "hxnS40NolrA": {
      "videoId": "hxnS40NolrA",
      "locale": "fa",
      "status": "locked",
      "confirmedAt": "2025-11-20T10:00:00Z",
      "lockedAt": "2025-11-20T10:00:00Z",
      "version": 1,
      "hash": "abc123def456", // Content hash
      "wordCount": 5432,
      "characterCount": 28765
    }
  }
}
```

**Benefits:**
- Track which transcripts are locked
- Detect content changes via hash
- Skip regeneration for locked transcripts
- Audit trail of changes

### Solution 3: Smart Generation Script

**Enhanced Script Logic:**

```typescript
// scripts/generate-transcripts-smart.ts

async function generateTranscriptsSmartly() {
  // 1. Load manifest
  const manifest = await loadManifest()
  
  // 2. Read all YAML source files
  const yamlFiles = await readYAMLFiles()
  
  // 3. For each YAML file:
  for (const yamlFile of yamlFiles) {
    const videoId = matchToVideoId(yamlFile)
    const content = parseYAML(yamlFile)
    const contentHash = calculateHash(content)
    
    // 4. Check if transcript is locked
    if (manifest.transcripts[videoId]?.status === 'locked') {
      console.log(`Skipping ${videoId} - locked`)
      continue
    }
    
    // 5. Check if content changed
    if (manifest.transcripts[videoId]?.hash === contentHash) {
      console.log(`Skipping ${videoId} - no changes`)
      continue
    }
    
    // 6. Generate only if needed
    console.log(`Generating ${videoId} - new or changed`)
    await generateTranscript(videoId, content)
    
    // 7. Update manifest
    manifest.transcripts[videoId] = {
      videoId,
      locale: 'fa',
      status: 'draft',
      version: (manifest.transcripts[videoId]?.version || 0) + 1,
      hash: contentHash,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      updatedAt: new Date().toISOString()
    }
  }
  
  // 8. Save manifest
  await saveManifest(manifest)
}
```

### Solution 4: New Video Detection

**For new videos only:**

```typescript
// scripts/detect-new-videos.ts

async function detectNewVideos() {
  // 1. Get all videos from parsed-videos.json
  const allVideos = await loadAllVideos()
  
  // 2. Get transcripts from manifest
  const manifest = await loadManifest()
  
  // 3. Find videos without transcripts
  const newVideos = allVideos.filter(v => 
    !manifest.transcripts[v.youtubeId]
  )
  
  // 4. Report new videos
  console.log(`Found ${newVideos.length} new videos without transcripts:`)
  newVideos.forEach(v => {
    console.log(`- ${v.youtubeId}: ${v.title.fa}`)
  })
  
  // 5. Generate transcripts for new videos only
  for (const video of newVideos) {
    await fetchAndGenerateTranscript(video.youtubeId)
  }
}
```

### Solution 5: Confirmation Workflow

**Manual confirmation step:**

```bash
# 1. Generate new transcripts (draft status)
pnpm generate:transcripts

# 2. Review generated transcripts
pnpm review:transcripts

# 3. Confirm transcripts (marks as confirmed)
pnpm confirm:transcripts --video hxnS40NolrA

# 4. Lock transcripts (marks as locked, never regenerate)
pnpm lock:transcripts --video hxnS40NolrA

# 5. Lock all confirmed transcripts
pnpm lock:transcripts --all-confirmed
```

---

## Recommended Approach

### Phase 1: Add Transcript Manifest (Immediate)

**Story 9.14: Transcript Generation Stability**

1. Create manifest file tracking all transcripts
2. Add status field (draft/confirmed/locked)
3. Add content hashing
4. Update generation script to check manifest

### Phase 2: Smart Generation (Next)

**Story 9.15: Smart Transcript Generation**

1. Skip locked transcripts
2. Skip unchanged transcripts (same hash)
3. Only generate new or changed transcripts
4. Update manifest after each generation

### Phase 3: New Video Detection (Future)

**Story 9.16: New Video Detection & Transcript Generation**

1. Detect videos without transcripts
2. Fetch transcripts for new videos only
3. Add to manifest with draft status
4. Notify for manual review

---

## Data Integrity Rules

### Rule 1: Immutability of Locked Transcripts
**Once locked, NEVER regenerate or modify.**

```typescript
if (transcript.status === 'locked') {
  throw new Error(`Cannot modify locked transcript: ${videoId}`)
}
```

### Rule 2: Content Hash Verification
**Before generating, check if content actually changed.**

```typescript
const newHash = calculateHash(newContent)
if (existingTranscript.hash === newHash) {
  return // Skip generation
}
```

### Rule 3: Version Tracking
**Increment version on each change.**

```typescript
transcript.version = (existingTranscript?.version || 0) + 1
```

### Rule 4: Bilingual Consistency
**Ensure Persian and English transcripts stay in sync.**

```typescript
if (locale === 'fa') {
  // Check if English version exists
  const enTranscript = await getTranscript(videoId, 'en')
  if (enTranscript && enTranscript.status === 'locked') {
    // Warn about potential inconsistency
    console.warn(`Persian transcript changed but English is locked`)
  }
}
```

### Rule 5: New Videos Only
**For batch operations, only process new videos.**

```typescript
const newVideos = allVideos.filter(v => 
  !manifest.transcripts[v.youtubeId]
)
```

---

## Implementation Details

### Manifest Schema

```typescript
// app/types/transcript-manifest.ts

export interface TranscriptManifest {
  version: string
  lastGenerated: string
  transcripts: Record<string, TranscriptMetadata>
}

export interface TranscriptMetadata {
  videoId: string
  locale: 'fa' | 'en'
  status: 'draft' | 'confirmed' | 'locked'
  version: number
  hash: string
  wordCount: number
  characterCount: number
  createdAt: string
  updatedAt?: string
  confirmedAt?: string
  lockedAt?: string
  source: 'manual' | 'generated' | 'api'
}
```

### Hash Calculation

```typescript
import crypto from 'crypto'

function calculateTranscriptHash(content: string): string {
  // Normalize content before hashing
  const normalized = content
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\u200c/g, '') // Remove ZWNJ
  
  return crypto
    .createHash('sha256')
    .update(normalized)
    .digest('hex')
}
```

### Generation Script Changes

```typescript
// scripts/generate-transcripts-smart.ts

async function generateTranscriptsSmart() {
  const manifest = await loadManifest()
  const yamlFiles = await readYAMLFiles()
  
  let generated = 0
  let skipped = 0
  let locked = 0
  
  for (const file of yamlFiles) {
    const videoId = matchToVideoId(file)
    const content = parseYAML(file)
    const hash = calculateTranscriptHash(content)
    
    const existing = manifest.transcripts[videoId]
    
    // Check if locked
    if (existing?.status === 'locked') {
      console.log(`🔒 Locked: ${videoId}`)
      locked++
      continue
    }
    
    // Check if unchanged
    if (existing?.hash === hash) {
      console.log(`⏭️  Unchanged: ${videoId}`)
      skipped++
      continue
    }
    
    // Generate
    console.log(`✨ Generating: ${videoId}`)
    await generateTranscript(videoId, content)
    
    // Update manifest
    manifest.transcripts[videoId] = {
      videoId,
      locale: 'fa',
      status: existing?.status || 'draft',
      version: (existing?.version || 0) + 1,
      hash,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual'
    }
    
    generated++
  }
  
  await saveManifest(manifest)
  
  console.log(`\n📊 Summary:`)
  console.log(`Generated: ${generated}`)
  console.log(`Skipped (unchanged): ${skipped}`)
  console.log(`Skipped (locked): ${locked}`)
}
```

---

## Testing Strategy

### Test 1: No Changes = No Regeneration
```bash
# Run generation twice
pnpm generate:transcripts
git status # Should show changes

git add .
git commit -m "Initial transcripts"

pnpm generate:transcripts
git status # Should show NO changes
```

### Test 2: Locked Transcripts Never Change
```bash
# Lock a transcript
pnpm lock:transcript --video hxnS40NolrA

# Modify source YAML
echo "new content" >> app/data/transcripts/fa/video.yml

# Try to regenerate
pnpm generate:transcripts

# Verify locked transcript unchanged
git diff app/data/transcripts/fa/index.ts
# Should show no changes for locked transcript
```

### Test 3: New Videos Only
```bash
# Add new video to parsed-videos.json
# Run generation
pnpm generate:transcripts

# Should only generate for new video
# Existing transcripts should be unchanged
```

---

## Migration Plan

### Step 1: Create Initial Manifest
```bash
pnpm create:manifest
# Reads all existing transcripts
# Creates manifest with current state
# Marks all as "confirmed" status
```

### Step 2: Lock Existing Transcripts
```bash
pnpm lock:transcripts --all
# Marks all existing transcripts as locked
# Prevents future regeneration
```

### Step 3: Update Generation Scripts
- Modify scripts to check manifest
- Skip locked transcripts
- Only generate new/changed

### Step 4: Test Thoroughly
- Run generation multiple times
- Verify no unnecessary changes
- Test with new videos

---

## Benefits

1. **Data Stability:** No unnecessary file changes
2. **Git Cleanliness:** Only meaningful changes in commits
3. **Bilingual Safety:** Prevents accidental desync
4. **Performance:** Skip unnecessary regeneration
5. **Audit Trail:** Track all changes with versions
6. **Confidence:** Know transcripts won't change unexpectedly
7. **New Video Focus:** Only process what's needed

---

## Risks & Mitigation

### Risk 1: Manifest Out of Sync
**Mitigation:** Add validation script to verify manifest matches actual files

### Risk 2: Hash Collisions
**Mitigation:** Use SHA-256 (extremely unlikely to collide)

### Risk 3: Accidentally Locking Wrong Transcript
**Mitigation:** Add unlock command, require confirmation for lock

### Risk 4: Missing New Videos
**Mitigation:** Add detection script that runs regularly

---

## Conclusion

The solution involves:
1. **Manifest file** to track transcript status
2. **Content hashing** to detect real changes
3. **Status system** (draft/confirmed/locked)
4. **Smart generation** that skips unnecessary work
5. **New video detection** for targeted processing

This ensures transcripts are stable, data integrity is maintained, and the bilingual system stays consistent.

---

**Next Step:** Create Story 9.14 with detailed implementation plan

