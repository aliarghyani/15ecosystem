# Architecture: Writers Page & Tags System

**Date:** 2025-11-10  
**Architecture Type:** Feature Architecture  
**Related:** Writers Feature, Tags System, Content Linking

---

## 1. Overview

This document defines the technical architecture for implementing:
1. **Writers Page** - Similar to books page, showing all authors/writers
2. **Writer Detail Pages** - Individual pages with biography, books, links
3. **Tags System** - Cross-project tagging for skills, books, writers, categories
4. **Content Linking** - Clickable mentions of entities within text content

---

## 2. Data Architecture

### 2.1 Writer Type Definition

```typescript
// app/types/index.ts

export interface Writer {
  id: string // Unique identifier (slug-based)
  name: string // Full name
  slug: string // URL-friendly identifier
  photo?: string // URL to photo/avatar image
  tagline?: {
    en: string
    fa: string
  }
  biography: {
    en: string // Markdown or rich text
    fa: string
  }
  books: string[] // Array of book slugs
  skillIds: number[] // Skills related to this writer
  categoryIds: string[] // Categories this writer belongs to
  links: {
    youtube?: string
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    other?: Array<{ label: string; url: string }>
  }
  tags: string[] // Array of tag slugs
  createdAt?: string // Optional: when writer was added
  updatedAt?: string // Optional: last update time
}
```

### 2.2 Tag Type Definition

```typescript
// app/types/index.ts

export interface Tag {
  id: string // Unique identifier (slug-based)
  name: {
    en: string
    fa: string
  }
  slug: string // URL-friendly identifier
  description?: {
    en: string
    fa: string
  }
  color?: string // Hex color for visual distinction
  icon?: string // Optional icon identifier
  category?: 'skill' | 'book' | 'writer' | 'category' | 'general' // Tag category
}
```

### 2.3 Updated Type Definitions

**Book Interface (add tags):**
```typescript
export interface Book {
  title: string
  author: string
  skillIds: number[]
  tags?: string[] // Add tags support
}
```

**Skill Interface (add tags):**
```typescript
export interface Skill {
  // ... existing fields
  tags?: string[] // Add tags support
}
```

**Category Interface (add tags):**
```typescript
export interface Category {
  // ... existing fields
  tags?: string[] // Add tags support
}
```

---

## 3. File Structure

### 3.1 Data Files

```
app/data/
├── en/
│   ├── writers.ts      # English writers data
│   └── tags.ts         # English tags data
└── fa/
    ├── writers.ts      # Persian writers data
    └── tags.ts         # Persian tags data
```

### 3.2 Utility Files

```
app/utils/
├── writers.ts          # Writer utility functions
├── tags.ts             # Tag utility functions
└── content-parser.ts   # Content parsing and entity linking
```

### 3.3 Component Files

```
app/components/
├── writers/
│   ├── WriterCard.vue          # Writer card component (list view)
│   └── WriterDetail.vue       # Writer detail component (optional)
├── tags/
│   ├── TagBadge.vue            # Tag badge component
│   └── TagList.vue             # Tag list component
└── content/
    └── ClickableContent.vue    # Clickable content parser component
```

### 3.4 Page Files

```
app/pages/
├── writers/
│   ├── index.vue               # Writers list page
│   └── [slug].vue              # Writer detail page
└── tags/
    ├── index.vue                # Tags list page
    └── [slug].vue               # Tag detail page
```

---

## 4. Utility Functions

### 4.1 Writers Utilities (`app/utils/writers.ts`)

```typescript
/**
 * Get all writers
 */
export function getAllWriters(locale: 'fa' | 'en' = 'fa'): Writer[]

/**
 * Get writer by slug
 */
export function getWriterBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Writer | undefined

/**
 * Get writers by category
 */
export function getWritersByCategory(
  category: 'health' | 'identity' | 'career',
  locale: 'fa' | 'en' = 'fa'
): Writer[]

/**
 * Get writers by skill
 */
export function getWritersBySkill(skillId: number, locale: 'fa' | 'en' = 'fa'): Writer[]

/**
 * Get writers by tag
 */
export function getWritersByTag(tagSlug: string, locale: 'fa' | 'en' = 'fa'): Writer[]

/**
 * Get writer's books
 */
export function getWriterBooks(writerSlug: string, locale: 'fa' | 'en' = 'fa'): Book[]

/**
 * Generate writer slug from name
 */
export function getWriterSlug(name: string): string
```

### 4.2 Tags Utilities (`app/utils/tags.ts`)

```typescript
/**
 * Get all tags
 */
export function getAllTags(locale: 'fa' | 'en' = 'fa'): Tag[]

/**
 * Get tag by slug
 */
export function getTagBySlug(slug: string, locale: 'fa' | 'en' = 'fa'): Tag | undefined

/**
 * Get tags for a skill
 */
export function getTagsForSkill(skillId: number, locale: 'fa' | 'en' = 'fa'): Tag[]

/**
 * Get tags for a book
 */
export function getTagsForBook(bookSlug: string, locale: 'fa' | 'en' = 'fa'): Tag[]

/**
 * Get tags for a writer
 */
export function getTagsForWriter(writerSlug: string, locale: 'fa' | 'en' = 'fa'): Tag[]

/**
 * Get tags for a category
 */
export function getTagsForCategory(categoryId: string, locale: 'fa' | 'en' = 'fa'): Tag[]

/**
 * Get content by tag
 */
export function getContentByTag(tagSlug: string, locale: 'fa' | 'en' = 'fa'): {
  skills: Skill[]
  books: Book[]
  writers: Writer[]
  categories: Category[]
}

/**
 * Generate tag slug from name
 */
export function getTagSlug(name: string): string
```

### 4.3 Content Parser Utilities (`app/utils/content-parser.ts`)

```typescript
/**
 * Parse content and detect entity mentions
 */
export function parseContentForEntities(
  content: string,
  locale: 'fa' | 'en'
): {
  text: string
  entities: Array<{
    type: 'skill' | 'book' | 'writer' | 'category'
    name: string
    slug: string
    startIndex: number
    endIndex: number
  }>
}

/**
 * Convert content with entities to HTML with links
 */
export function convertContentToClickableHTML(
  content: string,
  locale: 'fa' | 'en'
): string

/**
 * Detect skill mentions in text
 */
export function detectSkillMentions(text: string, locale: 'fa' | 'en'): Array<{
  name: string
  id: number
  startIndex: number
  endIndex: number
}>

/**
 * Detect book mentions in text
 */
export function detectBookMentions(text: string, locale: 'fa' | 'en'): Array<{
  name: string
  slug: string
  startIndex: number
  endIndex: number
}>

/**
 * Detect writer mentions in text
 */
export function detectWriterMentions(text: string, locale: 'fa' | 'en'): Array<{
  name: string
  slug: string
  startIndex: number
  endIndex: number
}>

/**
 * Detect category mentions in text
 */
export function detectCategoryMentions(text: string, locale: 'fa' | 'en'): Array<{
  name: string
  id: string
  startIndex: number
  endIndex: number
}>
```

---

## 5. Component Architecture

### 5.1 WriterCard Component

**Location:** `app/components/writers/WriterCard.vue`

**Props:**
```typescript
interface Props {
  writer: Writer
  variant?: 'default' | 'compact'
  showBio?: boolean
  showBooksCount?: boolean
  showSkills?: boolean
}
```

**Features:**
- Display writer photo/avatar
- Show writer name
- Show brief bio excerpt (if `showBio`)
- Show number of books badge (if `showBooksCount`)
- Show related skills badges (if `showSkills`)
- Clickable → navigate to writer detail page
- Hover effects

### 5.2 TagBadge Component

**Location:** `app/components/tags/TagBadge.vue`

**Props:**
```typescript
interface Props {
  tag: Tag | string // Tag object or tag slug
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'soft'
  showCount?: boolean // Show count of items with this tag
  clickable?: boolean
}
```

**Features:**
- Display tag name
- Color-coded (if tag has color)
- Icon support (if tag has icon)
- Show count badge (if `showCount`)
- Clickable → navigate to tag page (if `clickable`)
- Hover tooltip with description

### 5.3 ClickableContent Component

**Location:** `app/components/content/ClickableContent.vue`

**Props:**
```typescript
interface Props {
  content: string // Markdown or plain text
  locale: 'fa' | 'en'
  enableAutoLinking?: boolean // Auto-detect entities
  entityTypes?: Array<'skill' | 'book' | 'writer' | 'category'> // Which entities to link
}
```

**Features:**
- Parse markdown (if markdown)
- Detect entity mentions (if `enableAutoLinking`)
- Generate clickable links
- Support manual markdown links
- Render with proper styling
- Handle bilingual content

---

## 6. Page Architecture

### 6.1 Writers List Page

**Location:** `app/pages/writers/index.vue`

**Structure:**
- Page header (title, description)
- Breadcrumb navigation
- Writers grouped by category
- Writer cards in grid layout
- Empty state (if no writers)
- Navigation (back to home)

**Data Loading:**
- Use `getAllWriters()` or `getWritersByCategory()`
- Group by category
- Sort alphabetically

### 6.2 Writer Detail Page

**Location:** `app/pages/writers/[slug].vue`

**Structure:**
- Breadcrumb navigation
- Hero section (photo, name, tagline)
- Biography section (with ClickableContent)
- Related books section (Inspira Book components)
- Resources section (external links)
- Related skills section (skill cards)
- Tags section (tag badges)
- Navigation (back to writers, back to home)

**Data Loading:**
- Use `getWriterBySlug()`
- Load writer's books using `getWriterBooks()`
- Load related skills using `getSkillsByIds()`
- Load tags using `getTagsForWriter()`

### 6.3 Tags List Page

**Location:** `app/pages/tags/index.vue`

**Structure:**
- Page header (title, description)
- Breadcrumb navigation
- Tag cloud or grid
- Search/filter tags
- Tag badges with counts
- Empty state (if no tags)

**Data Loading:**
- Use `getAllTags()`
- Calculate counts for each tag
- Sort by popularity or alphabetically

### 6.4 Tag Detail Page

**Location:** `app/pages/tags/[slug].vue`

**Structure:**
- Breadcrumb navigation
- Tag header (name, description)
- Content sections:
  - Skills (skill cards)
  - Books (book cards)
  - Writers (writer cards)
  - Categories (category cards)
- Empty state (if no content)

**Data Loading:**
- Use `getTagBySlug()`
- Use `getContentByTag()` to get all content
- Group by content type

---

## 7. Routing Architecture

### 7.1 Routes

```
/writers                    → Writers list page
/writers/[slug]             → Writer detail page
/fa/writers                 → Writers list page (Persian)
/fa/writers/[slug]          → Writer detail page (Persian)

/tags                       → Tags list page
/tags/[slug]                → Tag detail page
/fa/tags                    → Tags list page (Persian)
/fa/tags/[slug]             → Tag detail page (Persian)
```

### 7.2 Route Parameters

**Writer Slug:**
- Generated from writer name
- URL-friendly (lowercase, hyphens)
- Example: `matthew-walker`, `cal-newport`

**Tag Slug:**
- Generated from tag name
- URL-friendly (lowercase, hyphens)
- Example: `productivity`, `health`, `creativity`

---

## 8. i18n Architecture

### 8.1 Translation Keys

**Writers:**
```json
{
  "writers": {
    "title": "Writers",
    "description": "All authors and thought leaders",
    "biography": "Biography",
    "relatedBooks": "Related Books",
    "resources": "Resources",
    "relatedSkills": "Related Skills",
    "tags": "Tags",
    "noWriters": "No writers found",
    "booksCount": "{count} books"
  }
}
```

**Tags:**
```json
{
  "tags": {
    "title": "Tags",
    "description": "Browse content by tags",
    "allTags": "All Tags",
    "relatedContent": "Related Content",
    "skills": "Skills",
    "books": "Books",
    "writers": "Writers",
    "categories": "Categories",
    "noTags": "No tags found",
    "itemsCount": "{count} items"
  }
}
```

---

## 9. Styling Architecture

### 9.1 Writer Card Styling

- Similar to BookCard but with photo
- Circular or rounded photo
- Name prominent
- Bio excerpt (truncated)
- Badges for books count and skills
- Hover effects (shadow, scale)

### 9.2 Tag Badge Styling

- Small, rounded rectangles
- Color-coded backgrounds
- White or dark text (based on background)
- Icon support (left side)
- Count badge (top-right corner)
- Hover: scale and show description tooltip

### 9.3 Clickable Content Styling

- Entity links: Underlined, colored
- Different colors per entity type:
  - Skills: Primary color
  - Books: Secondary color
  - Writers: Accent color
  - Categories: Tertiary color
- Hover: Darker shade, tooltip
- Visited: Lighter shade

---

## 10. Performance Considerations

### 10.1 Data Loading

- Static data (no API calls)
- Pre-render pages at build time
- Lazy load images (writer photos)
- Efficient data structures (maps for lookups)

### 10.2 Content Parsing

- Parse content at build time (if possible)
- Cache parsed results
- Client-side parsing for dynamic content
- Debounce entity detection

### 10.3 Tag Filtering

- Client-side filtering for tag pages
- Use efficient data structures (Sets, Maps)
- Debounced search input
- Virtual scrolling for large tag lists

---

## 11. SEO Considerations

### 11.1 Meta Tags

- Writer pages: Title, description, Open Graph
- Tag pages: Title, description, Open Graph
- Structured data (JSON-LD) for writers

### 11.2 Content Linking

- Proper anchor text for entity links
- Semantic HTML (`<a>` tags with proper href)
- Breadcrumb navigation for hierarchy

---

## 12. Implementation Order

1. **Phase 1:** Type definitions and data structures
2. **Phase 2:** Writers utilities and data files
3. **Phase 3:** Writers pages (list and detail)
4. **Phase 4:** Tags utilities and data files
5. **Phase 5:** Tags pages (list and detail)
6. **Phase 6:** Content parser utilities
7. **Phase 7:** ClickableContent component
8. **Phase 8:** Tag integration on detail pages
9. **Phase 9:** Content linking in biographies

---

## 13. Testing Strategy

### 13.1 Unit Tests

- Writer utilities (getWriterBySlug, etc.)
- Tag utilities (getTagBySlug, etc.)
- Content parser (entity detection)

### 13.2 Integration Tests

- Writer pages load correctly
- Tag pages load correctly
- Navigation between pages works
- Content linking works

### 13.3 E2E Tests

- User can browse writers
- User can view writer detail page
- User can click entity links in biography
- User can browse tags
- User can view tag detail page

---

## 14. Future Enhancements

- Writer search functionality
- Tag filtering and sorting
- Related writers suggestions
- Writer comparison feature
- Tag analytics (most popular tags)
- Content recommendations based on tags

