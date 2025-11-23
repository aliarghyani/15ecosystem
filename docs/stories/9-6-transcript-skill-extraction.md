# Story 9.6: Transcript Content Analysis & Skill Extraction

**Epic:** Epic 9 - Content Relationships & UI Polish  
**Status:** backlog  
**Story ID:** 9-6-transcript-skill-extraction  
**Priority:** High

## User Story

As a content curator,
I want to automatically extract skill mentions from video transcripts,
So that videos are properly tagged with related skills based on their content.

## Acceptance Criteria

**Given** I have 128 complete video transcripts  
**When** I analyze the transcript content  
**Then** I have:
- Detection of all 15 skill mentions (Persian and English names)
- Detection of book title mentions
- Detection of writer name mentions
- Count of occurrences for each mention
- Relationship suggestions (video → skills, books, writers)
- Confidence scores based on mention frequency
- Manual review capability before applying changes
- Updated video data with new relationships

**Prerequisites:** Story 9.2 (Transcript audit complete)

## Technical Requirements

### Analysis Script

**Location:** `scripts/analyze-transcripts.ts`

**Functionality:**
1. Load all 15 skills with their names (fa/en)
2. Load all books with their titles
3. Load all writers with their names
4. For each transcript:
   - Search for skill name mentions (exact and fuzzy)
   - Search for book title mentions
   - Search for writer name mentions
   - Count occurrences
   - Calculate confidence score
5. Generate relationship suggestions
6. Output results to JSON file

### Skill Names to Search

```typescript
const skillNames = {
  1: { fa: 'خواب خوب', en: 'Quality Sleep' },
  2: { fa: 'تمرکز و کار عمیق', en: 'Focus & Deep Work' },
  3: { fa: 'مدیریت دوپامین', en: 'Dopamine Management' },
  4: { fa: 'شاخص توده بدنی', en: 'Body Mass Index' },
  5: { fa: 'قدرت بدنی', en: 'Physical Strength' },
  6: { fa: 'سلامت قلب و عروق', en: 'Cardiovascular Health' },
  7: { fa: 'خودشناسی', en: 'Self-Awareness' },
  8: { fa: 'هوش هیجانی', en: 'Emotional Intelligence' },
  9: { fa: 'تفکر انتقادی', en: 'Critical Thinking' },
  10: { fa: 'خلاقیت', en: 'Creativity' },
  11: { fa: 'مهارت ارتباطی', en: 'Communication Skills' },
  12: { fa: 'رهبری', en: 'Leadership' },
  13: { fa: 'مدیریت مالی', en: 'Financial Management' },
  14: { fa: 'مهارت های فنی', en: 'Technical Skills' },
  15: { fa: 'شبکه سازی', en: 'Networking' }
}
```

### Search Strategy

**1. Exact Match:**
- Search for exact skill name in transcript
- Case-insensitive
- Persian text normalization (handle different Unicode forms)

**2. Fuzzy Match:**
- Handle typos and variations
- Use Levenshtein distance or similar
- Threshold: 85% similarity

**3. Context Matching:**
- Look for related terms (synonyms, translations)
- Example: "خواب" (sleep) related to skill #1
- Example: "دوپامین" (dopamine) related to skill #3

**4. Compound Terms:**
- Some skills are compound terms ("تمرکز و کار عمیق")
- Search for individual words and combinations
- Example: "تمرکز", "کار عمیق", "تمرکز و کار عمیق"

### Confidence Scoring

```typescript
interface ConfidenceScore {
  skill: number // Skill ID
  mentions: number // Number of mentions
  confidence: 'high' | 'medium' | 'low'
  score: number // 0-100
}

function calculateConfidence(mentions: number, transcriptLength: number): ConfidenceScore {
  // Normalize by transcript length
  const density = mentions / (transcriptLength / 1000) // mentions per 1000 words
  
  let confidence: 'high' | 'medium' | 'low'
  let score: number
  
  if (mentions >= 5 || density >= 2) {
    confidence = 'high'
    score = Math.min(100, 60 + mentions * 5)
  } else if (mentions >= 2 || density >= 0.5) {
    confidence = 'medium'
    score = 40 + mentions * 10
  } else {
    confidence = 'low'
    score = mentions * 20
  }
  
  return { mentions, confidence, score }
}
```

### Output Format

**File:** `docs/sources/transcript-analysis-results.json`

```json
{
  "analysisDate": "2025-11-23T10:00:00Z",
  "totalVideos": 128,
  "totalTranscripts": 128,
  "results": [
    {
      "videoId": "hxnS40NolrA",
      "title": "15 مهارت ضروری برای سال 2025",
      "currentSkills": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "detectedSkills": [
        {
          "skillId": 1,
          "skillName": "خواب خوب",
          "mentions": 12,
          "confidence": "high",
          "score": 95,
          "contexts": [
            "خواب خوب یکی از مهمترین عوامل سلامتی است",
            "بدون خواب کافی نمی‌توانید..."
          ]
        },
        {
          "skillId": 3,
          "skillName": "مدیریت دوپامین",
          "mentions": 8,
          "confidence": "high",
          "score": 85,
          "contexts": [
            "دوپامین نقش مهمی در انگیزه دارد",
            "مدیریت دوپامین کلید موفقیت است"
          ]
        }
      ],
      "detectedBooks": [
        {
          "bookTitle": "Why We Sleep",
          "mentions": 3,
          "confidence": "medium"
        }
      ],
      "detectedWriters": [
        {
          "writerName": "Matthew Walker",
          "mentions": 2,
          "confidence": "medium"
        }
      ],
      "suggestions": {
        "addSkills": [],
        "removeSkills": [],
        "addBooks": [],
        "addWriters": []
      }
    }
  ],
  "summary": {
    "videosWithNewSkills": 45,
    "videosWithNewBooks": 23,
    "videosWithNewWriters": 18,
    "totalNewRelationships": 156,
    "highConfidenceSuggestions": 89,
    "mediumConfidenceSuggestions": 45,
    "lowConfidenceSuggestions": 22
  }
}
```

## Tasks

- [ ] Task 1: Create `scripts/analyze-transcripts.ts` script
- [ ] Task 2: Load skill names (fa/en) from data files
- [ ] Task 3: Load book titles from data files
- [ ] Task 4: Load writer names from data files
- [ ] Task 5: Implement exact match search
- [ ] Task 6: Implement fuzzy match search (optional)
- [ ] Task 7: Implement Persian text normalization
- [ ] Task 8: Calculate confidence scores
- [ ] Task 9: Generate relationship suggestions
- [ ] Task 10: Output results to JSON file
- [ ] Task 11: Run analysis on all 128 transcripts
- [ ] Task 12: Review results manually
- [ ] Task 13: Approve high-confidence suggestions
- [ ] Task 14: Update video data files with new relationships

## Script Implementation

```typescript
// scripts/analyze-transcripts.ts
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { getAllSkills } from '../app/utils/skills'
import { getAllBooks } from '../app/utils/books'
import { getAllWriters } from '../app/utils/writers'

interface TranscriptAnalysisResult {
  videoId: string
  title: string
  currentSkills: number[]
  detectedSkills: Array<{
    skillId: number
    skillName: string
    mentions: number
    confidence: 'high' | 'medium' | 'low'
    score: number
    contexts: string[]
  }>
  detectedBooks: Array<{
    bookTitle: string
    mentions: number
    confidence: 'high' | 'medium' | 'low'
  }>
  detectedWriters: Array<{
    writerName: string
    mentions: number
    confidence: 'high' | 'medium' | 'low'
  }>
  suggestions: {
    addSkills: number[]
    removeSkills: number[]
    addBooks: string[]
    addWriters: string[]
  }
}

function normalizeText(text: string): string {
  // Normalize Persian text
  return text
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ') // Replace ZWNJ with space
    .trim()
}

function searchInTranscript(
  transcript: string,
  searchTerms: string[]
): Array<{ term: string; count: number; contexts: string[] }> {
  const normalized = normalizeText(transcript)
  const results: Array<{ term: string; count: number; contexts: string[] }> = []

  for (const term of searchTerms) {
    const normalizedTerm = normalizeText(term)
    const regex = new RegExp(normalizedTerm, 'gi')
    const matches = normalized.match(regex)
    const count = matches?.length || 0

    if (count > 0) {
      // Extract contexts (sentences containing the term)
      const sentences = transcript.split(/[.!?؟]/)
      const contexts = sentences
        .filter(s => normalizeText(s).includes(normalizedTerm))
        .slice(0, 3) // Keep first 3 contexts
        .map(s => s.trim())

      results.push({ term, count, contexts })
    }
  }

  return results
}

async function analyzeTranscripts() {
  const transcriptsDir = join(process.cwd(), 'server', 'data', 'transcripts')
  const files = await readdir(transcriptsDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  // Load reference data
  const skills = getAllSkills('fa')
  const books = getAllBooks('fa')
  const writers = getAllWriters('fa')

  // Prepare search terms
  const skillTerms = skills.map(s => [s.name.fa, s.name.en]).flat()
  const bookTerms = books.map(b => b.title)
  const writerTerms = writers.map(w => w.name)

  const results: TranscriptAnalysisResult[] = []

  for (const file of jsonFiles) {
    const content = await readFile(join(transcriptsDir, file), 'utf-8')
    const transcript = JSON.parse(content)

    if (!transcript.fullText || transcript.source === 'unavailable') {
      continue
    }

    // Search for skills
    const skillMatches = searchInTranscript(transcript.fullText, skillTerms)
    const detectedSkills = skillMatches.map(match => {
      const skill = skills.find(s => 
        normalizeText(s.name.fa) === normalizeText(match.term) ||
        normalizeText(s.name.en) === normalizeText(match.term)
      )
      
      const wordCount = transcript.fullText.split(/\s+/).length
      const confidence = match.count >= 5 ? 'high' : match.count >= 2 ? 'medium' : 'low'
      const score = Math.min(100, 20 * match.count)

      return {
        skillId: skill!.id,
        skillName: skill!.name.fa,
        mentions: match.count,
        confidence,
        score,
        contexts: match.contexts
      }
    })

    // Search for books
    const bookMatches = searchInTranscript(transcript.fullText, bookTerms)
    const detectedBooks = bookMatches.map(match => ({
      bookTitle: match.term,
      mentions: match.count,
      confidence: (match.count >= 3 ? 'high' : match.count >= 2 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
    }))

    // Search for writers
    const writerMatches = searchInTranscript(transcript.fullText, writerTerms)
    const detectedWriters = writerMatches.map(match => ({
      writerName: match.term,
      mentions: match.count,
      confidence: (match.count >= 2 ? 'high' : match.count >= 1 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
    }))

    results.push({
      videoId: transcript.videoId,
      title: transcript.title,
      currentSkills: [], // TODO: Load from video data
      detectedSkills,
      detectedBooks,
      detectedWriters,
      suggestions: {
        addSkills: detectedSkills.filter(s => s.confidence !== 'low').map(s => s.skillId),
        removeSkills: [],
        addBooks: detectedBooks.filter(b => b.confidence !== 'low').map(b => b.bookTitle),
        addWriters: detectedWriters.filter(w => w.confidence !== 'low').map(w => w.writerName)
      }
    })
  }

  // Save results
  const outputPath = join(process.cwd(), 'docs', 'sources', 'transcript-analysis-results.json')
  await writeFile(outputPath, JSON.stringify({
    analysisDate: new Date().toISOString(),
    totalVideos: jsonFiles.length,
    totalTranscripts: results.length,
    results,
    summary: {
      videosWithNewSkills: results.filter(r => r.suggestions.addSkills.length > 0).length,
      videosWithNewBooks: results.filter(r => r.suggestions.addBooks.length > 0).length,
      videosWithNewWriters: results.filter(r => r.suggestions.addWriters.length > 0).length,
      totalNewRelationships: results.reduce((sum, r) => 
        sum + r.suggestions.addSkills.length + r.suggestions.addBooks.length + r.suggestions.addWriters.length, 0
      ),
      highConfidenceSuggestions: results.reduce((sum, r) => 
        sum + r.detectedSkills.filter(s => s.confidence === 'high').length, 0
      ),
      mediumConfidenceSuggestions: results.reduce((sum, r) => 
        sum + r.detectedSkills.filter(s => s.confidence === 'medium').length, 0
      ),
      lowConfidenceSuggestions: results.reduce((sum, r) => 
        sum + r.detectedSkills.filter(s => s.confidence === 'low').length, 0
      )
    }
  }, null, 2))

  console.log(`Analysis complete. Results saved to: ${outputPath}`)
  console.log(`Analyzed ${results.length} transcripts`)
}

analyzeTranscripts()
```

## Manual Review Process

1. Open `docs/sources/transcript-analysis-results.json`
2. Review high-confidence suggestions first
3. For each suggestion:
   - Verify skill mention is relevant
   - Check if skill already exists in video data
   - Approve or reject suggestion
4. Create approved suggestions list
5. Run update script to apply changes

## Expected Results

- 60-80% of videos will have at least one new skill relationship
- Main 15 skills video should detect all 15 skills
- Videos about specific topics should detect relevant skills
- Book/writer mentions should be detected accurately

## Notes

- Persian text normalization is critical for accurate matching
- Some skills may have multiple names/variations
- Context is important - not all mentions are relevant
- Manual review prevents false positives
- Start with high-confidence suggestions only

---

**Estimated Effort:** 6-8 hours  
**Complexity:** High  
**Risk:** Medium (false positives possible)  
**Dependencies:** Complete transcripts (Story 9.2)

