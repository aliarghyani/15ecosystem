# Story 9.1: Type Sharding & Organization

**Epic:** Epic 9 - Content Relationships & UI Polish  
**Status:** backlog  
**Story ID:** 9-1-type-sharding  
**Priority:** High

## User Story

As a developer,
I want type definitions organized into separate files per model,
So that the codebase is more maintainable and easier to navigate.

## Acceptance Criteria

**Given** I have a large `app/types/index.ts` file with all type definitions  
**When** I shard the types into separate files  
**Then** I have:
- Separate file for each model type (`skill.ts`, `category.ts`, `video.ts`, etc.)
- Clean `index.ts` that only re-exports types
- No breaking changes to existing code
- All imports still work correctly
- Better code organization and discoverability

**Prerequisites:** None

## Technical Requirements

### Current Structure
```
app/types/
├── index.ts (all types mixed together)
├── transcripts.ts
├── summaries.ts
├── reports.ts
└── youtube.ts
```

### Target Structure
```
app/types/
├── index.ts (re-exports only)
├── skill.ts
├── category.ts
├── book.ts
├── writer.ts
├── tag.ts
├── video.ts
├── playlist.ts
├── transcripts.ts (already exists)
├── summaries.ts (already exists)
├── reports.ts (already exists)
└── youtube.ts (already exists)
```

### Type Files to Create

**1. `app/types/skill.ts`**
```typescript
export interface Skill {
  id: number
  name: {
    en: string
    fa: string
  }
  category: 'health' | 'identity' | 'career'
  whyItMatters: {
    en: string
    fa: string
  }
  howTo: {
    en: string
    fa: string
  }
  books: Book[]
  relatedSkills?: number[]
  tags?: string[]
}
```

**2. `app/types/category.ts`**
```typescript
export interface Category {
  id: string
  name: {
    en: string
    fa: string
  }
  description: {
    en: string
    fa: string
  }
  skills: number[]
  tags?: string[]
}
```

**3. `app/types/book.ts`**
```typescript
export interface Book {
  title: string
  author: string
  skillIds: number[]
  tags?: string[]
}
```

**4. `app/types/writer.ts`**
```typescript
export interface Writer {
  id: string
  name: string
  slug: string
  photo?: string
  tagline?: {
    en: string
    fa: string
  }
  biography: {
    en: string
    fa: string
  }
  books: string[]
  skillIds: number[]
  categoryIds: string[]
  links: {
    youtube?: string
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    other?: Array<{ label: string; url: string }>
  }
  tags?: string[]
}
```

**5. `app/types/tag.ts`**
```typescript
export interface Tag {
  id: string
  name: {
    en: string
    fa: string
  }
  slug: string
  description?: {
    en: string
    fa: string
  }
  color?: string
  icon?: string
  category?: 'skill' | 'book' | 'writer' | 'category' | 'general'
}
```

**6. `app/types/video.ts`**
```typescript
export interface Video {
  id: string
  youtubeUrl: string
  youtubeId: string
  title: {
    fa: string
    en: string
  }
  description?: {
    fa: string
    en: string
  }
  thumbnail: string
  duration?: number
  publishedAt?: string
  viewCount?: number
  playlistId?: string
  skillIds: number[]
  categoryIds: string[]
  tags: string[]
  writerId?: string
  bookIds?: string[]
  channelId: string
  channelName: string
}
```

**7. `app/types/playlist.ts`**
```typescript
export interface Playlist {
  id: string
  youtubeId: string
  title: {
    fa: string
    en: string
  }
  description?: {
    fa: string
    en: string
  }
  thumbnail: string
  videoCount: number
  videoIds: string[]
  skillIds: number[]
  categoryIds: string[]
  tags: string[]
  channelId: string
  channelName: string
}
```

**8. Updated `app/types/index.ts`**
```typescript
// Re-export all types from separate files
export type { Skill } from './skill'
export type { Category } from './category'
export type { Book } from './book'
export type { Writer } from './writer'
export type { Tag } from './tag'
export type { Video } from './video'
export type { Playlist } from './playlist'
export type { VideoTranscript, TranscriptMetadata } from './transcripts'
export type { VideoSummary, SummaryMetadata } from './summaries'
export type {
  WordFrequencyReport,
  MentionReport,
  TrendReport,
  ComparisonReport,
  TopWordsReport,
  CategoryAnalysisReport,
  SkillAnalysisReport,
  ReportOptions,
  ReportMetadata
} from './reports'
```

## Tasks

- [x] Task 1: Create `app/types/skill.ts` with Skill interface
- [x] Task 2: Create `app/types/category.ts` with Category interface
- [x] Task 3: Create `app/types/book.ts` with Book interface
- [x] Task 4: Create `app/types/writer.ts` with Writer interface
- [x] Task 5: Create `app/types/tag.ts` with Tag interface
- [x] Task 6: Create `app/types/video.ts` with Video interface
- [x] Task 7: Create `app/types/playlist.ts` with Playlist interface
- [x] Task 8: Update `app/types/index.ts` to re-export all types
- [x] Task 9: Verify all imports still work (run build)
- [x] Task 10: Update documentation if needed

## Testing

### Verification Steps
1. Run `pnpm build` - should succeed with no errors
2. Check all pages load correctly
3. Verify TypeScript compilation succeeds
4. Check that IDE autocomplete still works
5. Verify no broken imports

### Files to Check
- All files importing from `~/types`
- All files importing specific types
- Components using these types
- Utils using these types
- Pages using these types

## Benefits

1. **Better Organization:** Each model has its own file
2. **Easier Navigation:** Find types quickly
3. **Reduced Merge Conflicts:** Changes to different models don't conflict
4. **Better IDE Support:** Faster autocomplete, better navigation
5. **Clearer Dependencies:** See which types depend on others
6. **Easier Maintenance:** Modify one model without affecting others

## Notes

- This is a refactoring task with no functional changes
- All existing code should continue to work
- Import paths remain the same (`~/types` or `~/types/index`)
- Can import specific types: `import type { Skill } from '~/types/skill'`
- Or import from index: `import type { Skill } from '~/types'`

---

**Estimated Effort:** 2-3 hours  
**Complexity:** Low  
**Risk:** Low (pure refactoring)

