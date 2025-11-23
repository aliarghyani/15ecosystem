# Brainstorm: Excel Video Data Integration & Analysis Strategy

**Date:** 2025-01-15  
**Context:** 127 videos from KhashayarTalks channel in Excel format  
**Goal:** Integrate all videos, transcripts, and summaries into 15ecosystem platform

---

## 1. Excel File Structure Analysis

### Current Structure (Based on Image Description)

**Per Sheet (Playlist):**
- **Cell A1:** Playlist URL (e.g., `https://www.youtube.com/playlist?list=PLfENCQ8wu4rYMchVpCMVIFLX9AKvsNDB7`)
- **Row 2:** Headers
  - Column A: Title (Persian)
  - Column B: URL (YouTube video URL)
  - Column C: Upload Date
  - Column D: Views
- **Rows 4+:** Video data (127 videos total across multiple playlists)

### Key Observations

1. **Playlist Organization:** Each sheet = one playlist (natural grouping)
2. **Persian Titles:** All titles are in Persian (need English translations)
3. **View Counts:** Available in format like "101K", "254K" (need parsing)
4. **Upload Dates:** Format "1 year ago" (relative, need conversion)
5. **Video URLs:** Full YouTube URLs with playlist parameters

---

## 2. Data Extraction & Processing Strategy

### Phase 1: Excel to Structured Data

#### Option A: Manual Script (Recommended for Initial Import)
**Pros:**
- Full control over data transformation
- Can handle edge cases
- Can validate data during import
- Can enrich with additional metadata

**Cons:**
- Requires Excel parsing library (xlsx, exceljs)
- One-time effort

**Implementation:**
```typescript
// scripts/import-excel-videos.ts
// 1. Read Excel file
// 2. Extract playlist URLs from A1 of each sheet
// 3. Extract video data from each sheet
// 4. Parse view counts ("101K" -> 101000)
// 5. Extract YouTube video IDs from URLs
// 6. Generate playlist metadata
// 7. Output structured JSON/YAML
```

#### Option B: CSV Export + Script
**Pros:**
- Simpler parsing (CSV is text-based)
- Can use Excel's export feature
- Easier to debug

**Cons:**
- Loses sheet structure (playlist grouping)
- Need to manually track playlist URLs

**Recommendation:** Option A (Direct Excel parsing)

### Phase 2: Data Enrichment

**Required Enrichment:**
1. **English Titles:** Translate Persian titles (manual or API)
2. **Video IDs:** Extract from URLs (already have utility)
3. **Thumbnails:** Generate from video IDs (already have utility)
4. **Playlist IDs:** Extract from playlist URLs
5. **Skill Mapping:** Map videos to skills (1-15) - **REQUIRES ANALYSIS**
6. **Category Mapping:** Map to categories (health/identity/career) - **REQUIRES ANALYSIS**
7. **Tag Extraction:** Extract tags from titles/descriptions - **REQUIRES ANALYSIS**
8. **Writer Identification:** Identify if video features a writer - **REQUIRES ANALYSIS**
9. **Book References:** Identify if video mentions books - **REQUIRES ANALYSIS**

---

## 3. Video Implementation Architecture

### Current System Capabilities

✅ **Already Implemented:**
- Video type definition (`Video` interface)
- Playlist type definition (`Playlist` interface)
- Video utility functions (extract ID, thumbnail, etc.)
- Transcript storage structure (`VideoTranscript` interface)
- Transcript utility functions
- Video display components (`VideoCard`, `VideoList`)
- Playlist display components (`PlaylistCard`)

### Recommended Implementation Flow

#### Step 1: Excel Import Script
**File:** `scripts/import-excel-videos.ts`

**Process:**
1. Parse Excel file using `xlsx` or `exceljs`
2. For each sheet:
   - Extract playlist URL from A1
   - Extract playlist ID from URL
   - Extract video data (rows 4+)
   - Parse view counts and dates
   - Generate playlist metadata
3. Output to structured format (JSON/YAML)

**Output Format:**
```json
{
  "playlists": [
    {
      "id": "PLfENCQ8wu4rYMchVpCMVIFLX9AKvsNDB7",
      "youtubeId": "PLfENCQ8wu4rYMchVpCMVIFLX9AKvsNDB7",
      "title": {
        "fa": "Sheet Name (Playlist Name)",
        "en": "Translated Playlist Name"
      },
      "videoIds": ["video1", "video2", ...],
      "videoCount": 25
    }
  ],
  "videos": [
    {
      "id": "extracted_video_id",
      "youtubeUrl": "full_url",
      "title": {
        "fa": "Persian title from Excel",
        "en": "Translated English title"
      },
      "viewCount": 101000,
      "publishedAt": "2024-01-15T00:00:00Z",
      "playlistId": "PLfENCQ8wu4rYMchVpCMVIFLX9AKvsNDB7"
    }
  ]
}
```

#### Step 2: Data Enrichment Script
**File:** `scripts/enrich-video-data.ts`

**Process:**
1. Read imported data
2. For each video:
   - Generate thumbnail URL
   - Extract video ID
   - **Map to skills** (requires analysis - see section 4)
   - **Map to categories** (requires analysis)
   - **Extract tags** (requires analysis)
   - **Identify writers** (requires analysis)
   - **Identify books** (requires analysis)
3. Generate TypeScript data files

#### Step 3: Integration with Existing System
**Files:** 
- `app/data/fa/videos.ts` (update with all 127 videos)
- `app/data/en/videos.ts` (update with all 127 videos)
- `app/data/fa/playlists.ts` (update with all playlists)
- `app/data/en/playlists.ts` (update with all playlists)

---

## 4. Data Analysis Requirements

### Critical Analysis Needed

#### 4.1 Skill Mapping (1-15)
**Question:** Which of the 15 skills does each video relate to?

**Approach:**
1. **Title Analysis:** Extract keywords from Persian titles
2. **Transcript Analysis:** Once transcripts are available, analyze content
3. **Manual Review:** Review each video title/description
4. **Keyword Matching:** Match against skill keywords

**Skills Reference:**
- Health (1-6): Sleep, Nutrition, Exercise, Longevity, Focus, Memory
- Identity (7-12): Creativity, Learning, Relationships, Communication, Emotional Intelligence, Self-Awareness
- Career (13-15): Financial Literacy, Entrepreneurship, Leadership

**Example Analysis:**
- "چطور خوابمان را تنظیم کنیم؟" → Skill 1 (Sleep)
- "چطور تمرکز خود را افزایش دهیم" → Skill 5 (Focus)
- "سواد مالی" → Skill 13 (Financial Literacy)

#### 4.2 Category Mapping
**Question:** Which category (health/identity/career) does each video belong to?

**Approach:**
- Derived from skill mapping (skills 1-6 = health, 7-12 = identity, 13-15 = career)
- Can be multiple categories if video covers multiple skills

#### 4.3 Tag Extraction
**Question:** What tags should be associated with each video?

**Approach:**
1. **Title Keywords:** Extract meaningful keywords from titles
2. **Content Analysis:** Analyze transcripts (once available)
3. **Common Tags:** 
   - "andrew-huberman" (if mentioned)
   - "peter-attia" (if mentioned)
   - "harvard" (if mentioned)
   - Topic tags: "sleep", "focus", "longevity", etc.

#### 4.4 Writer Identification
**Question:** Does the video feature or discuss a specific writer/expert?

**Approach:**
1. **Title Analysis:** Look for names in titles
   - "Andrew Huberman" → `writerId: "andrew-huberman"`
   - "Peter Attia" → `writerId: "peter-attia"`
2. **Transcript Analysis:** Once available, search for writer mentions
3. **Manual Review:** Review video descriptions

**Known Writers (from titles):**
- Andrew Huberman (mentioned in titles)
- Peter Attia (mentioned in titles)

#### 4.5 Book Reference Identification
**Question:** Does the video mention or discuss specific books?

**Approach:**
1. **Transcript Analysis:** Search transcripts for book titles
2. **Manual Review:** Review video descriptions
3. **Writer Association:** If video features a writer, check their books

---

## 5. Transcript & Summary Integration Strategy

### Current System

✅ **Transcript Structure:**
- `app/data/transcripts/fa/index.ts` - Persian transcripts
- `app/data/transcripts/en/index.ts` - English transcripts
- `VideoTranscript` interface with metadata

### Implementation Plan

#### Phase 1: Transcript Storage (127 videos)

**Structure:**
```typescript
// app/data/transcripts/fa/index.ts
export const transcripts: Record<string, VideoTranscript> = {
  'videoId1': {
    videoId: 'videoId1',
    transcript: 'Full transcript text...',
    wordCount: 1234,
    characterCount: 5678,
    characterCountNoSpaces: 4567,
    locale: 'fa',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  // ... 126 more videos
}
```

**Process:**
1. **Obtain Transcripts:** 
   - YouTube API (if available)
   - Manual extraction
   - Third-party services
2. **Process & Store:**
   - Clean transcripts (remove timestamps, etc.)
   - Calculate word/character counts
   - Store in structured format
3. **Generate Files:**
   - Script to generate transcript files
   - One file per locale (fa/en)

#### Phase 2: Summary Storage (127 videos)

**New Type Needed:**
```typescript
// app/types/summaries.ts
export interface VideoSummary {
  videoId: string
  summary: string // Extended summary text
  wordCount: number
  characterCount: number
  locale: 'fa' | 'en'
  updatedAt?: string
  metadata?: {
    keyPoints?: string[] // Key points extracted
    topics?: string[] // Main topics covered
    duration?: number // Summary reading time estimate
  }
}
```

**Storage Structure:**
```typescript
// app/data/summaries/fa/index.ts
export const summaries: Record<string, VideoSummary> = {
  'videoId1': {
    videoId: 'videoId1',
    summary: 'Extended summary text...',
    wordCount: 500,
    characterCount: 2500,
    locale: 'fa',
    updatedAt: '2025-01-15T00:00:00Z',
    metadata: {
      keyPoints: ['Point 1', 'Point 2', ...],
      topics: ['sleep', 'health']
    }
  }
}
```

**Process:**
1. **Generate Summaries:**
   - Manual creation
   - AI-assisted (GPT-4, Claude, etc.)
   - Extract from transcripts
2. **Store Summaries:**
   - Same structure as transcripts
   - Separate files for summaries

#### Phase 3: Analysis Integration

**Once Transcripts & Summaries Available:**

1. **Content Analysis:**
   - Extract keywords from transcripts
   - Identify skill mentions
   - Identify writer/book mentions
   - Generate tags automatically

2. **Cross-Reference Analysis:**
   - Link videos to skills based on content
   - Link videos to writers based on mentions
   - Link videos to books based on mentions

3. **Search & Discovery:**
   - Full-text search across transcripts
   - Search summaries
   - Find related videos by content similarity

---

## 6. Implementation Recommendations

### Priority 1: Excel Import & Basic Integration

**Tasks:**
1. ✅ Create Excel import script
2. ✅ Parse all 127 videos
3. ✅ Extract playlist information
4. ✅ Generate basic video data files
5. ✅ Map videos to playlists

**Deliverables:**
- All 127 videos in `app/data/fa/videos.ts` and `app/data/en/videos.ts`
- All playlists in `app/data/fa/playlists.ts` and `app/data/en/playlists.ts`
- Basic metadata (title, URL, views, date)

### Priority 2: Data Enrichment

**Tasks:**
1. ⚠️ Translate Persian titles to English
2. ⚠️ Map videos to skills (requires analysis)
3. ⚠️ Map videos to categories
4. ⚠️ Extract basic tags from titles
5. ⚠️ Identify writers from titles

**Deliverables:**
- Enriched video data with skill/category mappings
- Tag associations
- Writer identifications

### Priority 3: Transcript Integration

**Tasks:**
1. ⏳ Obtain 127 video transcripts
2. ⏳ Process and clean transcripts
3. ⏳ Store in transcript data files
4. ⏳ Generate transcript metadata

**Deliverables:**
- All 127 transcripts in `app/data/transcripts/fa/` and `app/data/transcripts/en/`

### Priority 4: Summary Integration

**Tasks:**
1. ⏳ Create `VideoSummary` type
2. ⏳ Generate 127 extended summaries
3. ⏳ Store summaries in data files
4. ⏳ Create summary utility functions

**Deliverables:**
- Summary type definition
- All 127 summaries stored
- Summary utility functions

### Priority 5: Advanced Analysis

**Tasks:**
1. ⏳ Content analysis from transcripts
2. ⏳ Automatic skill/category mapping
3. ⏳ Automatic tag extraction
4. ⏳ Writer/book identification from content
5. ⏳ Cross-video content analysis

**Deliverables:**
- Automated analysis scripts
- Enhanced video metadata
- Content similarity analysis

---

## 7. Technical Implementation Details

### Excel Parsing Library

**Recommended:** `xlsx` (SheetJS) or `exceljs`

**Installation:**
```bash
pnpm add xlsx
# or
pnpm add exceljs
```

**Example Usage:**
```typescript
import * as XLSX from 'xlsx'

const workbook = XLSX.readFile('docs/sources/all khashayartalks videos .xlsx')
const sheetNames = workbook.SheetNames

sheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet)
  // Process data...
})
```

### View Count Parsing

**Function:**
```typescript
function parseViewCount(viewCountStr: string): number {
  // "101K" -> 101000
  // "1.5M" -> 1500000
  const match = viewCountStr.match(/^([\d.]+)([KMB])?$/i)
  if (!match) return 0
  
  const value = parseFloat(match[1])
  const unit = match[2]?.toUpperCase()
  
  if (unit === 'K') return Math.round(value * 1000)
  if (unit === 'M') return Math.round(value * 1000000)
  if (unit === 'B') return Math.round(value * 1000000000)
  return Math.round(value)
}
```

### Date Parsing

**Challenge:** "1 year ago" format needs conversion

**Approach:**
1. Parse relative dates ("1 year ago", "2 months ago")
2. Convert to approximate ISO dates
3. Store as `publishedAt` field

**Function:**
```typescript
function parseRelativeDate(dateStr: string): string {
  // "1 year ago" -> approximate date
  const now = new Date()
  const match = dateStr.match(/(\d+)\s+(year|month|week|day)s?\s+ago/i)
  
  if (!match) return now.toISOString()
  
  const amount = parseInt(match[1])
  const unit = match[2].toLowerCase()
  
  const date = new Date(now)
  if (unit === 'year') date.setFullYear(date.getFullYear() - amount)
  else if (unit === 'month') date.setMonth(date.getMonth() - amount)
  else if (unit === 'week') date.setDate(date.getDate() - amount * 7)
  else if (unit === 'day') date.setDate(date.getDate() - amount)
  
  return date.toISOString()
}
```

---

## 8. Data Analysis Deep Dive

### Analysis Strategy for 127 Videos

#### Step 1: Title-Based Initial Mapping

**Process:**
1. Extract keywords from Persian titles
2. Match against skill keywords
3. Create initial skill mappings
4. Flag ambiguous cases for manual review

**Keyword Mapping:**
```typescript
const skillKeywords = {
  1: ['خواب', 'sleep', 'bedtime', 'insomnia'],
  5: ['تمرکز', 'focus', 'concentration', 'attention'],
  6: ['طول عمر', 'longevity', 'age', 'health'],
  13: ['سواد مالی', 'financial', 'money', 'finance'],
  // ... more mappings
}
```

#### Step 2: Transcript-Based Refinement

**Once Transcripts Available:**
1. Search transcripts for skill-related keywords
2. Calculate relevance scores
3. Refine skill mappings
4. Identify multi-skill videos

#### Step 3: Content Clustering

**Advanced Analysis:**
1. Group videos by content similarity
2. Identify topic clusters
3. Discover relationships between videos
4. Generate recommendations

---

## 9. Next Steps & Action Items

### Immediate Actions

1. **Create Excel Import Script**
   - [ ] Install Excel parsing library
   - [ ] Create `scripts/import-excel-videos.ts`
   - [ ] Parse all sheets and extract data
   - [ ] Generate initial JSON/YAML output

2. **Basic Video Integration**
   - [ ] Generate video data files with basic info
   - [ ] Generate playlist data files
   - [ ] Test video display components

3. **Title Translation**
   - [ ] Translate 127 Persian titles to English
   - [ ] Store translations in data files

### Short-Term Actions (1-2 weeks)

4. **Data Enrichment**
   - [ ] Map videos to skills (manual + automated)
   - [ ] Map videos to categories
   - [ ] Extract tags from titles
   - [ ] Identify writers

5. **Transcript Integration**
   - [ ] Obtain 127 video transcripts
   - [ ] Process and clean transcripts
   - [ ] Store in transcript data files

### Medium-Term Actions (2-4 weeks)

6. **Summary Integration**
   - [ ] Create summary type definition
   - [ ] Generate 127 extended summaries
   - [ ] Store summaries
   - [ ] Create summary utilities

7. **Advanced Analysis**
   - [ ] Content analysis from transcripts
   - [ ] Automatic skill mapping refinement
   - [ ] Cross-video analysis

---

## 10. Questions & Considerations

### Open Questions

1. **Transcript Source:**
   - How will we obtain 127 video transcripts?
   - YouTube API? Manual extraction? Third-party service?

2. **Summary Generation:**
   - Manual creation? AI-assisted? Both?
   - What length/format for summaries?

3. **Translation:**
   - Who will translate 127 titles?
   - Use translation API? Manual review?

4. **Skill Mapping:**
   - How detailed should mapping be?
   - Can videos map to multiple skills?
   - How to handle ambiguous cases?

5. **Data Updates:**
   - How to handle new videos?
   - Update process for existing videos?

### Technical Considerations

1. **Performance:**
   - 127 videos is manageable for static generation
   - Consider lazy loading for transcripts
   - Optimize thumbnail loading

2. **Maintainability:**
   - Keep Excel as source of truth?
   - Or migrate to YAML/JSON?
   - Version control strategy?

3. **Scalability:**
   - What if channel grows to 200+ videos?
   - Consider automated pipeline
   - Consider YouTube API integration

---

## 11. Conclusion

### Summary

**Current State:**
- ✅ Excel file with 127 videos organized by playlists
- ✅ Video/playlist types and utilities already implemented
- ✅ Transcript storage structure ready
- ⚠️ Need: Excel import, data enrichment, transcripts, summaries

**Recommended Approach:**
1. **Phase 1:** Excel import → Basic video data (1-2 days)
2. **Phase 2:** Data enrichment → Skill/category mapping (1 week)
3. **Phase 3:** Transcript integration → Full text analysis (2-3 weeks)
4. **Phase 4:** Summary integration → Extended summaries (2-3 weeks)
5. **Phase 5:** Advanced analysis → Content insights (ongoing)

**Key Success Factors:**
- Systematic approach to data import
- Thorough analysis for skill/category mapping
- Quality transcripts and summaries
- Maintainable data structure

### Next Immediate Step

**Create Excel Import Script** to extract all 127 videos and playlists from the Excel file, then proceed with data enrichment and analysis.

---

**Document Status:** Draft - Ready for Review  
**Last Updated:** 2025-01-15

