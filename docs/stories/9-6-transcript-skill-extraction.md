# User Story: Transcript Content Analysis & Skill Extraction

**Story ID:** 9-6-transcript-skill-extraction  
**Epic:** Epic 9 - Content Relationships & UI Polish  
**Priority:** High  
**Status:** drafted  
**Created:** 2025-11-23  
**Estimated Effort:** 6-8 hours

---

## Story Overview

**As a** content curator  
**I want** to analyze transcripts to extract skill, book, and writer mentions  
**So that** video relationships are enhanced with data-driven insights

---

## Context

With 128 video transcripts available, we can analyze the content to automatically detect mentions of skills, books, and writers. This will enhance the relationship data and help users discover connections between content. The analysis should use fuzzy matching and Persian text normalization for accurate detection.

**Dependencies:**
- Story 9-2 completion (transcript audit - all transcripts available)
- Story 9-3 completion (transcript search utilities with Persian normalization)
- Existing skill, book, and writer data

---

## Acceptance Criteria

### AC1: Script Analyzes All 128 Transcripts
**Given** all transcript files in server/data/transcripts/  
**When** analysis script is executed  
**Then** all 128 transcripts are processed successfully

### AC2: Skill Mentions Detected and Counted
**Given** transcript content  
**When** analysis is performed  
**Then** script detects mentions of all 15 skill names (Persian and English) and counts occurrences

### AC3: Book/Writer Mentions Detected
**Given** transcript content  
**When** analysis is performed  
**Then** script detects mentions of book titles and writer names and counts occurrences

### AC4: Relationship Suggestions Generated
**Given** analysis results  
**When** script completes  
**Then** generates JSON file with suggested relationships: Video → Skills, Video → Books, Video → Writers with mention counts

### AC5: Results Reviewed and Approved
**Given** analysis results JSON  
**When** curator reviews suggestions  
**Then** can approve/reject suggestions before applying to data

### AC6: Video Data Updated with New Relationships
**Given** approved relationship suggestions  
**When** update script is executed  
**Then** video data files updated with new skillIds, bookIds, and writerId

---

## Tasks

### Task 1: Create Analysis Script Structure
- [ ] Create `scripts/analyze-transcripts.ts`
- [ ] Set up TypeScript configuration
- [ ] Import transcript utilities from story 9-3
- [ ] Set up data loading (skills, books, writers)

### Task 2: Implement Skill Detection
- [ ] Load all 15 skill names (Persian and English)
- [ ] Create fuzzy matching function for skill names
- [ ] Search transcripts for skill mentions
- [ ] Count occurrences per video
- [ ] Handle variations and typos

### Task 3: Implement Book Detection
- [ ] Load all book titles (Persian and English)
- [ ] Create fuzzy matching for book titles
- [ ] Search transcripts for book mentions
- [ ] Count occurrences per video
- [ ] Handle partial titles

### Task 4: Implement Writer Detection
- [ ] Load all writer names (Persian and English)
- [ ] Create fuzzy matching for writer names
- [ ] Search transcripts for writer mentions
- [ ] Count occurrences per video
- [ ] Handle name variations

### Task 5: Generate Analysis Results
- [ ] Create results data structure
- [ ] For each video, store detected relationships
- [ ] Include mention counts and confidence scores
- [ ] Output to `docs/sources/transcript-analysis-results.json`
- [ ] Generate summary report

### Task 6: Create Review Interface
- [ ] Create review script or UI
- [ ] Display suggested relationships
- [ ] Allow approve/reject per suggestion
- [ ] Show mention context (where in transcript)
- [ ] Save approved relationships

### Task 7: Create Update Script
- [ ] Create `scripts/update-video-relationships.ts`
- [ ] Read approved relationships
- [ ] Update video data files (fa and en)
- [ ] Maintain existing relationships
- [ ] Add new relationships
- [ ] Backup original files

### Task 8: Persian Text Normalization
- [ ] Use normalization from story 9-3
- [ ] Handle Persian character variations (ی/ي, ک/ك)
- [ ] Remove diacritics
- [ ] Normalize whitespace

### Task 9: Fuzzy Matching Implementation
- [ ] Implement Levenshtein distance or similar
- [ ] Set confidence thresholds
- [ ] Handle partial matches
- [ ] Weight by mention frequency

### Task 10: Testing and Validation
- [ ] Test on sample transcripts
- [ ] Verify detection accuracy
- [ ] Check false positives/negatives
- [ ] Run on all 128 transcripts
- [ ] Validate output format

---

## Technical Notes

### Analysis Script Structure
```typescript
// scripts/analyze-transcripts.ts
import { loadAllTranscripts } from '~/server/utils/transcriptBatch'
import { searchTranscripts } from '~/server/utils/transcriptSearch'
import { getAllSkills } from '~/utils/skills'
import { getAllBooks } from '~/utils/books'
import { getAllWriters } from '~/utils/writers'

interface AnalysisResult {
  videoId: string
  title: string
  detectedSkills: Array<{
    skillId: number
    skillName: string
    mentions: number
    confidence: number
  }>
  detectedBooks: Array<{
    bookSlug: string
    bookTitle: string
    mentions: number
    confidence: number
  }>
  detectedWriters: Array<{
    writerSlug: string
    writerName: string
    mentions: number
    confidence: number
  }>
}

async function analyzeTranscripts() {
  const transcripts = await loadAllTranscripts()
  const skills = getAllSkills('fa')
  const books = getAllBooks('fa')
  const writers = getAllWriters('fa')
  
  const results: AnalysisResult[] = []
  
  for (const transcript of transcripts.results) {
    const result = await analyzeTranscript(transcript, skills, books, writers)
    results.push(result)
  }
  
  // Save results
  await fs.writeFile(
    'docs/sources/transcript-analysis-results.json',
    JSON.stringify(results, null, 2)
  )
}
```

### Fuzzy Matching Example
```typescript
function fuzzyMatch(text: string, query: string, threshold: number = 0.8): boolean {
  const normalizedText = normalizePersianText(text.toLowerCase())
  const normalizedQuery = normalizePersianText(query.toLowerCase())
  
  // Exact match
  if (normalizedText.includes(normalizedQuery)) {
    return true
  }
  
  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(normalizedText, normalizedQuery)
  const similarity = 1 - (distance / Math.max(normalizedText.length, normalizedQuery.length))
  
  return similarity >= threshold
}
```

### Output Format
```json
{
  "videoId": "abc123",
  "title": "Video Title",
  "detectedSkills": [
    {
      "skillId": 1,
      "skillName": "خودآگاهی",
      "mentions": 5,
      "confidence": 0.95
    }
  ],
  "detectedBooks": [
    {
      "bookSlug": "atomic-habits",
      "bookTitle": "عادت‌های اتمی",
      "mentions": 3,
      "confidence": 0.90
    }
  ],
  "detectedWriters": [
    {
      "writerSlug": "james-clear",
      "writerName": "جیمز کلیر",
      "mentions": 2,
      "confidence": 0.85
    }
  ]
}
```

---

## Definition of Done

- [ ] Analysis script created and functional
- [ ] All 128 transcripts analyzed
- [ ] Skill mentions detected with counts
- [ ] Book mentions detected with counts
- [ ] Writer mentions detected with counts
- [ ] Results JSON file generated
- [ ] Review process completed
- [ ] Video data updated with approved relationships
- [ ] Fuzzy matching working correctly
- [ ] Persian text normalization applied
- [ ] Testing complete

---

## Related Stories

- **9-3-server-utils-enhancement**: Provides transcript search utilities
- **9-13-transcript-relationship-enhancement**: Will use these results to update all relationships

---

## Dev Agent Record

### Context Reference
- Story Context: `docs/stories/9-6-transcript-skill-extraction.context.xml` (to be generated)

### Implementation Notes
- Start Date: 2025-11-23
- Completion Date: 2025-11-23
- Actual Effort: 2 hours
- Blockers: None
- Key Findings:
  - 44 videos (34%) contain skill mentions
  - "زبان انگلیسی" is the most mentioned skill (326 mentions in 42 videos)
  - No book or writer mentions detected (may need fuzzy matching improvement)
  - HTML tags in transcript text required cleaning before analysis

---

**Last Updated:** 2025-11-23  
**Story Owner:** Development Team
