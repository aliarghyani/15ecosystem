# Story 9.14: Transcript Generation Stability & Data Integrity

**Epic:** Epic 9 - Content Relationships & UI Polish  
**Status:** backlog  
**Story ID:** 9-14-transcript-generation-stability  
**Priority:** High

## User Story

As a developer,
I want transcript generation scripts to only regenerate changed or new transcripts,
So that the database/data files remain stable and don't change unnecessarily on each run.

## Acceptance Criteria

**Given** I have 128 existing transcripts that are confirmed and complete  
**When** I run the transcript generation script  
**Then**:
- Locked transcripts are NEVER regenerated
- Unchanged transcripts are skipped (no file changes)
- Only new or modified transcripts are generated
- Git shows no changes if nothing actually changed
- Bilingual files (fa/en) stay in sync
- New videos are detected and processed separately
- A manifest file tracks the status of all transcripts

**Prerequisites:** Story 9.2 (Transcript audit complete)

## Problem Statement

### Current Issues

1. **Unnecessary Regeneration:** Running `pnpm generate:transcripts` regenerates ALL transcripts every time, even if nothing changed
2. **Database Instability:** Data files change significantly in git on each run
3. **Bilingual Conflicts:** Persian and English files may get out of sync
4. **No Protection:** No way to mark a transcript as "complete and locked"
5. **Inefficient Workflow:** Regenerating 128 transcripts when only 1 is new

### Core Principle

**Once a video transcript is confirmed complete, it should NEVER be regenerated or modified unless explicitly unlocked.**

## Technical Requirements

### 1. Transcript Manifest System

**File:** `app/data/transcripts/manifest.json`

```json
{
  "version": "1.0.0",
  "lastGenerated": "2025-11-23T10:00:00Z",
  "transcripts": {
    "hxnS40NolrA": {
      "videoId": "hxnS40NolrA",
      "locale": "fa",
      "status": "locked",
      "version": 1,
      "hash": "abc123def456789",
      "wordCount": 5432,
      "characterCount": 28765,
      "createdAt": "2025-11-20T10:00:00Z",
      "updatedAt": "2025-11-20T10:00:00Z",
      "confirmedAt": "2025-11-20T10:00:00Z",
      "lockedAt": "2025-11-20T10:00:00Z",
      "source": "manual"
    }
  }
}
```

**Status Definitions:**
- `draft`: Initial transcript, may need review
- `confirmed`: Reviewed and approved, can be updated if needed
- `locked`: Final version, should NEVER be regenerated

### 2. Type Definitions

**File:** `app/types/transcript-manifest.ts`

```typescript
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
  hash: string // SHA-256 hash of transcript content
  wordCount: number
  characterCount: number
  createdAt: string
  updatedAt?: string
  confirmedAt?: string
  lockedAt?: string
  source: 'manual' | 'generated' | 'api'
}
```

### 3. Content Hashing

**Purpose:** Detect if transcript content actually changed

```typescript
import crypto from 'crypto'

export function calculateTranscriptHash(content: string): string {
  // Normalize content before hashing
  const normalized = content
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\u200c/g, '') // Remove Persian ZWNJ
    .toLowerCase()
  
  return crypto
    .createHash('sha256')
    .update(normalized, 'utf8')
    .digest('hex')
}
```

### 4. Smart Generation Script

**File:** `scripts/generate-transcripts-smart.ts`

```typescript
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { calculateTranscriptHash } from './utils/hash'

interface GenerationStats {
  total: number
  generated: number
  skipped: number
  locked: number
  unchanged: number
}

async function loadManifest(): Promise<TranscriptManifest> {
  const manifestPath = join(process.cwd(), 'app', 'data', 'transcripts', 'manifest.json')
  try {
    const content = await readFile(manifestPath, 'utf-8')
    return JSON.parse(content)
  } catch {
    // Create new manifest if doesn't exist
    return {
      version: '1.0.0',
      lastGenerated: new Date().toISOString(),
      transcripts: {}
    }
  }
}

async function saveManifest(manifest: TranscriptManifest): Promise<void> {
  const manifestPath = join(process.cwd(), 'app', 'data', 'transcripts', 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
}

async function generateTranscriptsSmart(): Promise<GenerationStats> {
  const stats: GenerationStats = {
    total: 0,
    generated: 0,
    skipped: 0,
    locked: 0,
    unchanged: 0
  }

  // Load manifest
  const manifest = await loadManifest()
  
  // Read all YAML source files
  const transcriptsDir = join(process.cwd(), 'app', 'data', 'transcripts', 'fa')
  const files = await readdir(transcriptsDir)
  const yamlFiles = files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  
  stats.total = yamlFiles.length

  for (const file of yamlFiles) {
    const filePath = join(transcriptsDir, file)
    const content = await readFile(filePath, 'utf-8')
    
    // Match to video ID (from filename or parsed-videos.json)
    const videoId = await matchToVideoId(file, content)
    if (!videoId) {
      console.warn(`⚠️  Could not match ${file} to video ID`)
      continue
    }

    // Calculate content hash
    const hash = calculateTranscriptHash(content)
    
    // Get existing metadata
    const existing = manifest.transcripts[videoId]
    
    // Check if locked
    if (existing?.status === 'locked') {
      console.log(`🔒 Locked: ${videoId} (${file})`)
      stats.locked++
      continue
    }
    
    // Check if unchanged
    if (existing?.hash === hash) {
      console.log(`⏭️  Unchanged: ${videoId} (${file})`)
      stats.unchanged++
      continue
    }
    
    // Generate transcript
    console.log(`✨ Generating: ${videoId} (${file})`)
    const transcript = await parseAndGenerateTranscript(content, videoId)
    
    // Update manifest
    manifest.transcripts[videoId] = {
      videoId,
      locale: 'fa',
      status: existing?.status || 'draft',
      version: (existing?.version || 0) + 1,
      hash,
      wordCount: transcript.wordCount,
      characterCount: transcript.characterCount,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmedAt: existing?.confirmedAt,
      lockedAt: existing?.lockedAt,
      source: 'manual'
    }
    
    stats.generated++
  }
  
  // Update manifest timestamp
  manifest.lastGenerated = new Date().toISOString()
  
  // Save manifest
  await saveManifest(manifest)
  
  // Print summary
  console.log(`\n📊 Generation Summary:`)
  console.log(`Total files: ${stats.total}`)
  console.log(`Generated: ${stats.generated}`)
  console.log(`Skipped (unchanged): ${stats.unchanged}`)
  console.log(`Skipped (locked): ${stats.locked}`)
  console.log(`Skipped (other): ${stats.skipped}`)
  
  return stats
}

// Run
generateTranscriptsSmart()
  .then(stats => {
    if (stats.generated === 0) {
      console.log(`\n✅ No changes needed - all transcripts up to date!`)
    } else {
      console.log(`\n✅ Generated ${stats.generated} transcript(s)`)
    }
  })
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
```

### 5. Transcript Management Commands

**File:** `scripts/manage-transcripts.ts`

```typescript
// Lock a transcript (prevent regeneration)
async function lockTranscript(videoId: string): Promise<void> {
  const manifest = await loadManifest()
  
  if (!manifest.transcripts[videoId]) {
    throw new Error(`Transcript not found: ${videoId}`)
  }
  
  if (manifest.transcripts[videoId].status === 'locked') {
    console.log(`Already locked: ${videoId}`)
    return
  }
  
  manifest.transcripts[videoId].status = 'locked'
  manifest.transcripts[videoId].lockedAt = new Date().toISOString()
  
  await saveManifest(manifest)
  console.log(`🔒 Locked: ${videoId}`)
}

// Unlock a transcript (allow regeneration)
async function unlockTranscript(videoId: string): Promise<void> {
  const manifest = await loadManifest()
  
  if (!manifest.transcripts[videoId]) {
    throw new Error(`Transcript not found: ${videoId}`)
  }
  
  manifest.transcripts[videoId].status = 'confirmed'
  manifest.transcripts[videoId].lockedAt = undefined
  
  await saveManifest(manifest)
  console.log(`🔓 Unlocked: ${videoId}`)
}

// Confirm a transcript (mark as reviewed)
async function confirmTranscript(videoId: string): Promise<void> {
  const manifest = await loadManifest()
  
  if (!manifest.transcripts[videoId]) {
    throw new Error(`Transcript not found: ${videoId}`)
  }
  
  manifest.transcripts[videoId].status = 'confirmed'
  manifest.transcripts[videoId].confirmedAt = new Date().toISOString()
  
  await saveManifest(manifest)
  console.log(`✅ Confirmed: ${videoId}`)
}

// Lock all confirmed transcripts
async function lockAllConfirmed(): Promise<void> {
  const manifest = await loadManifest()
  let locked = 0
  
  for (const [videoId, metadata] of Object.entries(manifest.transcripts)) {
    if (metadata.status === 'confirmed') {
      metadata.status = 'locked'
      metadata.lockedAt = new Date().toISOString()
      locked++
    }
  }
  
  await saveManifest(manifest)
  console.log(`🔒 Locked ${locked} confirmed transcript(s)`)
}

// List transcript statuses
async function listTranscripts(status?: 'draft' | 'confirmed' | 'locked'): Promise<void> {
  const manifest = await loadManifest()
  
  const filtered = Object.values(manifest.transcripts)
    .filter(t => !status || t.status === status)
    .sort((a, b) => a.videoId.localeCompare(b.videoId))
  
  console.log(`\n📋 Transcripts${status ? ` (${status})` : ''}:`)
  console.log(`Total: ${filtered.length}\n`)
  
  for (const transcript of filtered) {
    const statusIcon = 
      transcript.status === 'locked' ? '🔒' :
      transcript.status === 'confirmed' ? '✅' : '📝'
    
    console.log(`${statusIcon} ${transcript.videoId} - v${transcript.version} - ${transcript.status}`)
  }
}
```

**Package.json scripts:**

```json
{
  "scripts": {
    "generate:transcripts": "tsx scripts/generate-transcripts-smart.ts",
    "transcripts:lock": "tsx scripts/manage-transcripts.ts lock",
    "transcripts:unlock": "tsx scripts/manage-transcripts.ts unlock",
    "transcripts:confirm": "tsx scripts/manage-transcripts.ts confirm",
    "transcripts:lock-all": "tsx scripts/manage-transcripts.ts lock-all",
    "transcripts:list": "tsx scripts/manage-transcripts.ts list",
    "transcripts:detect-new": "tsx scripts/detect-new-videos.ts"
  }
}
```

### 6. New Video Detection

**File:** `scripts/detect-new-videos.ts`

```typescript
async function detectNewVideos(): Promise<string[]> {
  // Load all videos from parsed-videos.json
  const videosPath = join(process.cwd(), 'docs', 'sources', 'imported', 'parsed-videos.json')
  const videosData = await readFile(videosPath, 'utf-8')
  const allVideos = JSON.parse(videosData)
  
  // Load manifest
  const manifest = await loadManifest()
  
  // Find videos without transcripts
  const newVideos = allVideos.filter((v: any) => 
    !manifest.transcripts[v.youtubeId]
  )
  
  console.log(`\n🔍 New Video Detection:`)
  console.log(`Total videos: ${allVideos.length}`)
  console.log(`Videos with transcripts: ${Object.keys(manifest.transcripts).length}`)
  console.log(`New videos (no transcript): ${newVideos.length}\n`)
  
  if (newVideos.length > 0) {
    console.log(`📹 New videos found:`)
    newVideos.forEach((v: any) => {
      console.log(`- ${v.youtubeId}: ${v.title.fa || v.title.en}`)
    })
    
    console.log(`\n💡 To fetch transcripts for new videos:`)
    console.log(`pnpm fetch:transcripts --new`)
  } else {
    console.log(`✅ All videos have transcripts!`)
  }
  
  return newVideos.map((v: any) => v.youtubeId)
}
```

## Tasks

- [ ] Task 1: Create `app/types/transcript-manifest.ts` type definitions
- [ ] Task 2: Create `scripts/utils/hash.ts` with content hashing function
- [ ] Task 3: Create `scripts/generate-transcripts-smart.ts` smart generation script
- [ ] Task 4: Create `scripts/manage-transcripts.ts` management commands
- [ ] Task 5: Create `scripts/detect-new-videos.ts` detection script
- [ ] Task 6: Create initial manifest from existing transcripts
- [ ] Task 7: Lock all existing confirmed transcripts
- [ ] Task 8: Update package.json with new scripts
- [ ] Task 9: Test generation script (should show no changes on second run)
- [ ] Task 10: Test with new video (should only generate new one)
- [ ] Task 11: Test locking/unlocking functionality
- [ ] Task 12: Document workflow in README or how-to guide
- [ ] Task 13: Add manifest.json to git

## Workflow

### Initial Setup (One-time)

```bash
# 1. Create manifest from existing transcripts
pnpm transcripts:create-manifest

# 2. Review and confirm all existing transcripts
pnpm transcripts:list

# 3. Lock all confirmed transcripts
pnpm transcripts:lock-all
```

### Regular Workflow

```bash
# 1. Detect new videos
pnpm transcripts:detect-new

# 2. Fetch transcripts for new videos
pnpm fetch:transcripts --new

# 3. Generate TypeScript files (only for new/changed)
pnpm generate:transcripts

# 4. Review new transcripts
pnpm transcripts:list --status draft

# 5. Confirm new transcripts
pnpm transcripts:confirm --video VIDEO_ID

# 6. Lock confirmed transcripts
pnpm transcripts:lock --video VIDEO_ID
```

### Updating Existing Transcript

```bash
# 1. Unlock transcript
pnpm transcripts:unlock --video VIDEO_ID

# 2. Edit YAML file
# ... make changes ...

# 3. Regenerate
pnpm generate:transcripts

# 4. Confirm changes
pnpm transcripts:confirm --video VIDEO_ID

# 5. Lock again
pnpm transcripts:lock --video VIDEO_ID
```

## Data Integrity Rules

### Rule 1: Immutability of Locked Transcripts
```typescript
if (transcript.status === 'locked') {
  throw new Error(`Cannot modify locked transcript: ${videoId}`)
}
```

### Rule 2: Content Hash Verification
```typescript
const newHash = calculateHash(newContent)
if (existingTranscript.hash === newHash) {
  return // Skip generation
}
```

### Rule 3: Version Tracking
```typescript
transcript.version = (existingTranscript?.version || 0) + 1
```

### Rule 4: Bilingual Consistency
```typescript
// Warn if Persian changes but English is locked
if (locale === 'fa' && enTranscript?.status === 'locked') {
  console.warn(`⚠️  Persian transcript changed but English is locked`)
}
```

## Testing

### Test 1: No Changes = No Regeneration
```bash
# Run generation twice
pnpm generate:transcripts
git status # Should show changes (first time)

git add .
git commit -m "Initial transcripts"

pnpm generate:transcripts
git status # Should show NO changes (second time)
```

**Expected:** No file changes on second run

### Test 2: Locked Transcripts Never Change
```bash
# Lock a transcript
pnpm transcripts:lock --video hxnS40NolrA

# Modify source YAML
echo "new content" >> app/data/transcripts/fa/video.yml

# Try to regenerate
pnpm generate:transcripts

# Verify locked transcript unchanged
git diff app/data/transcripts/fa/index.ts
```

**Expected:** Locked transcript not regenerated

### Test 3: New Videos Only
```bash
# Add new video to parsed-videos.json
# Detect new videos
pnpm transcripts:detect-new

# Fetch transcript for new video
pnpm fetch:transcript --video NEW_VIDEO_ID

# Generate
pnpm generate:transcripts

# Verify only new video generated
git status # Should only show changes for new video
```

**Expected:** Only new video transcript generated

### Test 4: Content Hash Detection
```bash
# Modify YAML (add whitespace only)
# Regenerate
pnpm generate:transcripts

# Verify skipped (hash unchanged)
```

**Expected:** Skipped due to identical content hash

## Benefits

1. ✅ **Data Stability:** No unnecessary file changes
2. ✅ **Git Cleanliness:** Only meaningful changes in commits
3. ✅ **Bilingual Safety:** Prevents accidental desync
4. ✅ **Performance:** Skip unnecessary regeneration (faster)
5. ✅ **Audit Trail:** Track all changes with versions
6. ✅ **Confidence:** Know transcripts won't change unexpectedly
7. ✅ **New Video Focus:** Only process what's needed
8. ✅ **Protected Content:** Locked transcripts are immutable

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
pnpm transcripts:lock-all
# Marks all 128 existing transcripts as locked
# Prevents future regeneration
```

### Step 3: Update Generation Scripts
- Replace old script with smart generation
- Update package.json scripts
- Test thoroughly

### Step 4: Document Workflow
- Update how-to guides
- Add workflow documentation
- Train team on new commands

## Notes

- Manifest file should be committed to git
- Hash algorithm: SHA-256 (no collision risk)
- Locked status can be unlocked if needed (with confirmation)
- New videos detected by comparing manifest to parsed-videos.json
- Bilingual consistency checked but not enforced (warning only)

---

**Estimated Effort:** 4-5 hours  
**Complexity:** Medium  
**Risk:** Low (improves stability)  
**Dependencies:** Story 9.2 (Transcript audit)

