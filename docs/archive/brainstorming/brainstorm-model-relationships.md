# Deep Brainstorm: Model Relationships & Detail Pages

**Date:** 2025-11-06  
**Project:** 15ecosystem  
**Goal:** Establish comprehensive relationships between all models and ensure all detail pages show related content

---

## Current State Analysis

### Data Models & Their Relationships

#### Video Model
```typescript
interface Video {
  id: string
  skillIds: number[]           // ✅ Related Skills
  categoryIds: string[]         // ✅ Related Categories
  tags: string[]                // ✅ Tags
  writerId?: string             // ✅ Related Writer (single)
  bookIds?: string[]            // ✅ Related Books
  // ... other fields
}
```

#### Skill Model
```typescript
interface Skill {
  id: number
  books: Book[]                 // ✅ Related Books (embedded)
  relatedSkills: number[]       // ✅ Related Skills
  category: string              // ✅ Category
  // ... other fields
}
```

#### Book Model
```typescript
interface Book {
  id: string
  skillIds: number[]            // ✅ Related Skills
  tags?: string[]               // ✅ Tags
  // Missing: writerId or writerIds
  // Missing: videoIds
}
```

#### Writer Model
```typescript
interface Writer {
  id: string
  books: string[]               // ✅ Related Books (by slug)
  skillIds: number[]            // ✅ Related Skills
  categoryIds: string[]         // ✅ Categories
  tags?: string[]               // ✅ Tags
  // Missing: videoIds
}
```

---

## Detail Pages Current State

### ✅ Video Detail Page (`/videos/[slug]`)
**Shows:**
- ✅ Related Skills
- ✅ Related Books
- ✅ Featured Writer
- ✅ Tags

**Status:** Complete ✅

---

### ⚠️ Skill Detail Page (`/skills/[slug]`)
**Shows:**
- ✅ Books
- ✅ Videos
- ✅ Related Skills
- ✅ Tags
- ❌ **Missing: Related Writers**

**Status:** Needs Writers section

---

### ⚠️ Writer Detail Page (`/writers/[slug]`)
**Shows:**
- ✅ Books
- ✅ Related Skills
- ✅ Tags
- ❌ **Missing: Related Videos**

**Status:** Needs Videos section

---

### ⚠️ Book Detail Page (`/books/[slug]`)
**Shows:**
- ✅ Related Skills
- ✅ Tags
- ❌ **Missing: Related Videos**
- ❌ **Missing: Related Writers**

**Status:** Needs Videos and Writers sections

---

## Missing Utility Functions

### Videos Utility (`app/utils/videos.ts`)
**Missing:**
- `getVideosByWriterId(writerId: string, locale)` - Get videos featuring a writer
- `getVideosByBookId(bookSlug: string, locale)` - Get videos mentioning a book

**Existing:**
- ✅ `getVideosBySkillId(skillId, locale)`
- ✅ `getVideosByCategoryId(categoryId, locale)`
- ✅ `getVideosByPlaylistId(playlistId, locale)`

---

### Books Utility (`app/utils/books.ts`)
**Missing:**
- `getWritersByBook(bookSlug: string, locale)` - Get writers who wrote a book
- `getVideosByBook(bookSlug: string, locale)` - Get videos mentioning a book

**Existing:**
- ✅ `getBooksBySkillId(skillId, locale)`
- ✅ `getBooksByCategory(category, locale)`
- ✅ `getBooksByAuthor(author, locale)`

---

### Writers Utility (`app/utils/writers.ts`)
**Missing:**
- `getVideosByWriter(writerSlug: string, locale)` - Get videos featuring a writer

**Existing:**
- ✅ `getWritersBySkill(skillId, locale)`
- ✅ `getWritersByCategory(category, locale)`
- ✅ `getWriterBooks(writerSlug, locale)`
- ✅ `getWriterSkills(writerSlug, locale)`

---

## Relationship Matrix

| From Model | To Model | Relationship Type | Current Status | Implementation Needed |
|------------|----------|-------------------|----------------|----------------------|
| **Video** | Skill | Many-to-Many | ✅ Complete | - |
| **Video** | Book | Many-to-Many | ✅ Complete | - |
| **Video** | Writer | Many-to-One | ✅ Complete | - |
| **Video** | Tag | Many-to-Many | ✅ Complete | - |
| **Skill** | Book | Many-to-Many | ✅ Complete | - |
| **Skill** | Video | Many-to-Many | ✅ Complete | - |
| **Skill** | Writer | Many-to-Many | ❌ Missing | Add to Skill detail page |
| **Skill** | Tag | Many-to-Many | ✅ Complete | - |
| **Book** | Skill | Many-to-Many | ✅ Complete | - |
| **Book** | Video | Many-to-Many | ❌ Missing | Add utility + Book detail page |
| **Book** | Writer | Many-to-One/Many | ❌ Missing | Add utility + Book detail page |
| **Book** | Tag | Many-to-Many | ✅ Complete | - |
| **Writer** | Book | One-to-Many | ✅ Complete | - |
| **Writer** | Skill | Many-to-Many | ✅ Complete | - |
| **Writer** | Video | Many-to-Many | ❌ Missing | Add utility + Writer detail page |
| **Writer** | Tag | Many-to-Many | ✅ Complete | - |

---

## Implementation Plan

### Phase 1: Add Missing Utility Functions

#### 1.1 Add to `app/utils/videos.ts`
```typescript
/**
 * Get videos by writer ID
 * @param writerId - Writer slug/ID
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos featuring the writer
 */
export function getVideosByWriterId(
  writerId: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => video.writerId === writerId)
}

/**
 * Get videos by book slug
 * @param bookSlug - Book slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos mentioning the book
 */
export function getVideosByBookSlug(
  bookSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  const videos = getAllVideos(locale)
  return videos.filter((video) => 
    video.bookIds && video.bookIds.includes(bookSlug)
  )
}
```

#### 1.2 Add to `app/utils/books.ts`
```typescript
/**
 * Get writers who wrote a book
 * Finds writers whose books array includes this book slug
 * @param bookSlug - Book slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of writers who wrote this book
 */
export function getWritersByBook(
  bookSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Writer[] {
  // Import getAllWriters from writers utility
  const allWriters = getAllWriters(locale)
  return allWriters.filter((writer) => writer.books.includes(bookSlug))
}

/**
 * Get videos mentioning a book
 * @param bookSlug - Book slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos mentioning the book
 */
export function getVideosByBook(
  bookSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  // Import getVideosByBookSlug from videos utility
  return getVideosByBookSlug(bookSlug, locale)
}
```

#### 1.3 Add to `app/utils/writers.ts`
```typescript
/**
 * Get videos featuring a writer
 * @param writerSlug - Writer slug
 * @param locale - Locale to use ('fa' | 'en'), defaults to 'fa'
 * @returns Array of videos featuring the writer
 */
export function getVideosByWriter(
  writerSlug: string,
  locale: 'fa' | 'en' = 'fa'
): Video[] {
  // Import getVideosByWriterId from videos utility
  return getVideosByWriterId(writerSlug, locale)
}
```

---

### Phase 2: Update Detail Pages

#### 2.1 Update Skill Detail Page (`app/pages/skills/[slug].vue`)
**Add:**
- Related Writers section (after Videos section, before Tags)
- Use `getWritersBySkill(skill.id, locale)` utility

**Location:** After line 100 (after Videos section)

```vue
<!-- Related Writers Section -->
<div v-if="relatedWriters.length > 0" class="mb-8">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
    {{ $t('skills.relatedWriters') }}
  </h2>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
    {{ $t('skills.relatedWritersDescription') }}
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <WriterCard
      v-for="writer in relatedWriters"
      :key="writer.slug"
      :writer="writer"
    />
  </div>
</div>
```

---

#### 2.2 Update Writer Detail Page (`app/pages/writers/[slug].vue`)
**Add:**
- Related Videos section (after Books section, before Skills)
- Use `getVideosByWriter(writer.slug, locale)` utility

**Location:** After line 77 (after Books section)

```vue
<!-- Related Videos Section -->
<div v-if="relatedVideos.length > 0" class="mb-8">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
    {{ $t('writers.relatedVideos') }}
  </h2>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
    {{ $t('writers.relatedVideosDescription') }}
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <VideoCard
      v-for="video in relatedVideos.slice(0, 8)"
      :key="video.id"
      :video="video"
      :show-description="false"
      variant="default"
    />
  </div>
  <div v-if="relatedVideos.length > 8" class="mt-6 text-center">
    <UButton
      :to="localePath(`/videos?writer=${writer.slug}`)"
      variant="soft"
      color="primary"
    >
      {{ $t('videos.viewAllVideos', { count: relatedVideos.length }) }}
    </UButton>
  </div>
</div>
```

---

#### 2.3 Update Book Detail Page (`app/pages/books/[slug].vue`)
**Add:**
- Related Videos section (after Skills section, before Tags)
- Related Writers section (after Videos section, before Tags)
- Use `getVideosByBook(bookSlug, locale)` utility
- Use `getWritersByBook(bookSlug, locale)` utility

**Location:** After line 53 (after Skills section)

```vue
<!-- Related Videos Section -->
<div v-if="relatedVideos.length > 0" class="mb-12">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
    {{ $t('books.relatedVideos') }}
  </h2>
  <p class="text-gray-600 dark:text-gray-400 mb-6">
    {{ $t('books.relatedVideosDescription') }}
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <VideoCard
      v-for="video in relatedVideos.slice(0, 8)"
      :key="video.id"
      :video="video"
      :show-description="false"
      variant="default"
    />
  </div>
  <div v-if="relatedVideos.length > 8" class="mt-6 text-center">
    <UButton
      :to="localePath(`/videos?book=${slug}`)"
      variant="soft"
      color="primary"
    >
      {{ $t('videos.viewAllVideos', { count: relatedVideos.length }) }}
    </UButton>
  </div>
</div>

<!-- Related Writers Section -->
<div v-if="relatedWriters.length > 0" class="mb-12">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
    {{ $t('books.relatedWriters') }}
  </h2>
  <p class="text-gray-600 dark:text-gray-400 mb-6">
    {{ $t('books.relatedWritersDescription') }}
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <WriterCard
      v-for="writer in relatedWriters"
      :key="writer.slug"
      :writer="writer"
    />
  </div>
</div>
```

---

### Phase 3: Add i18n Translations

#### 3.1 Add to `i18n/locales/en.json`
```json
{
  "skills": {
    "relatedWriters": "Related Writers",
    "relatedWritersDescription": "Writers who have contributed to this skill"
  },
  "writers": {
    "relatedVideos": "Related Videos",
    "relatedVideosDescription": "Videos featuring this writer"
  },
  "books": {
    "relatedVideos": "Related Videos",
    "relatedVideosDescription": "Videos mentioning or discussing this book",
    "relatedWriters": "Authors",
    "relatedWritersDescription": "Writers who authored this book"
  }
}
```

#### 3.2 Add to `i18n/locales/fa.json`
```json
{
  "skills": {
    "relatedWriters": "نویسندگان مرتبط",
    "relatedWritersDescription": "نویسندگانی که به این مهارت کمک کرده‌اند"
  },
  "writers": {
    "relatedVideos": "ویدیوهای مرتبط",
    "relatedVideosDescription": "ویدیوهایی که این نویسنده در آن‌ها حضور دارد"
  },
  "books": {
    "relatedVideos": "ویدیوهای مرتبط",
    "relatedVideosDescription": "ویدیوهایی که این کتاب را ذکر می‌کنند یا درباره آن بحث می‌کنند",
    "relatedWriters": "نویسندگان",
    "relatedWritersDescription": "نویسندگانی که این کتاب را نوشته‌اند"
  }
}
```

---

## Data Model Enhancements (Future Consideration)

### Potential Enhancements to Book Model
Currently, books don't have explicit writer relationships. We're inferring them from Writer model's `books` array. Consider adding:

```typescript
interface Book {
  // ... existing fields
  writerIds?: string[]  // Optional: explicit writer IDs/slugs
  videoIds?: string[]   // Optional: explicit video IDs that mention this book
}
```

**Note:** This is optional since we can infer relationships from existing data. Current approach works but may be less performant.

---

## Testing Checklist

### Utility Functions
- [ ] `getVideosByWriterId` returns correct videos
- [ ] `getVideosByBookSlug` returns correct videos
- [ ] `getWritersByBook` returns correct writers
- [ ] `getVideosByWriter` returns correct videos
- [ ] All functions handle empty results correctly
- [ ] All functions handle invalid inputs correctly

### Detail Pages
- [ ] Skill detail page shows related writers
- [ ] Writer detail page shows related videos
- [ ] Book detail page shows related videos
- [ ] Book detail page shows related writers
- [ ] All sections handle empty results (no display or empty state)
- [ ] All links navigate correctly
- [ ] Bilingual support works correctly

### i18n
- [ ] All new translation keys exist in both en.json and fa.json
- [ ] Translations display correctly
- [ ] Missing translations fallback gracefully

---

## Implementation Priority

1. **High Priority:**
   - Add utility functions (Phase 1)
   - Update Skill detail page (add Writers)
   - Update Writer detail page (add Videos)
   - Update Book detail page (add Videos and Writers)

2. **Medium Priority:**
   - Add i18n translations
   - Test all relationships

3. **Low Priority (Future):**
   - Consider adding explicit relationship fields to models
   - Performance optimization for relationship queries
   - Add relationship visualization diagrams

---

## Summary

**Current Status:**
- ✅ Video detail page: Complete
- ⚠️ Skill detail page: Missing Writers
- ⚠️ Writer detail page: Missing Videos
- ⚠️ Book detail page: Missing Videos and Writers

**What Needs to Be Done:**
1. Add 4 utility functions for cross-model queries
2. Update 3 detail pages with missing sections
3. Add i18n translations for new sections
4. Test all relationships

**Estimated Effort:**
- Utility functions: 1-2 hours
- Page updates: 2-3 hours
- i18n: 30 minutes
- Testing: 1-2 hours
- **Total: 4-7 hours**

---

**Next Steps:**
1. Review this brainstorm document
2. Approve implementation plan
3. Start with Phase 1 (utility functions)
4. Proceed to Phase 2 (page updates)
5. Complete Phase 3 (i18n)
6. Test and verify all relationships work correctly

