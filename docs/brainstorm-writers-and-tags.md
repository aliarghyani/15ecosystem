# Brainstorming: Writers Page & Tags System

**Date:** 2025-11-10  
**Session Type:** Feature Brainstorming  
**Focus:** Writers page (similar to books) + Tags system across project

---

## 1. Problem Statement

### Current State
- We have a books page showing all books
- Books have authors but no dedicated writer/author pages
- No way to explore authors' biographies, YouTube channels, or external resources
- No tagging system for cross-referencing content
- No clickable links within content text (biographies, descriptions)

### Desired State
- Writers page similar to books page
- Individual writer pages with:
  - Biography/introduction with special design
  - Related books (using Inspira Book components)
  - YouTube channel links
  - External links (website, social media, etc.)
  - Clickable mentions of skills, categories, books within biography
- Tags system across entire project
- Tag pages showing all content with that tag
- Tags displayed on detail pages (skills, books, writers, categories)

---

## 2. Writers Feature Brainstorming

### 2.1 Writers Page Structure

**Similar to Books Page:**
- List all unique authors/writers
- Group by category (based on their books' categories)
- Use Inspira Book components or similar card design
- Show writer name, photo/avatar, brief bio preview
- Link to individual writer pages

**Writers List Page (`/writers`):**
- Header: "Writers" / "نویسندگان"
- Description: "All authors and thought leaders mentioned in the video"
- Grouped by category (Health, Identity, Career)
- Each writer card shows:
  - Name
  - Photo/avatar (if available)
  - Brief bio excerpt
  - Number of books
  - Related skills (badges)

### 2.2 Individual Writer Page Structure

**Writer Detail Page (`/writers/[slug]`):**

**Header Section:**
- Writer name (large, prominent)
- Photo/avatar (if available)
- Brief tagline or subtitle
- Category badges (Health, Identity, Career)

**Biography Section:**
- Rich text biography/introduction
- Special design (maybe quote-style, highlighted sections)
- Clickable mentions:
  - Skills → `/skills/[id]`
  - Categories → `/categories/[id]`
  - Books → `/books/[slug]`
  - Other writers → `/writers/[slug]`
- Markdown or rich text support for formatting

**Related Books Section:**
- Grid of books by this writer
- Use Inspira Book components
- Link to book detail pages

**Resources Section:**
- YouTube channel link (if available)
- Website link
- Social media links (Twitter, LinkedIn, etc.)
- Other external resources
- Links open in new tab

**Related Skills Section:**
- Skills this writer's books relate to
- Skill cards with links

**Tags Section:**
- Tags associated with this writer
- Clickable tag badges
- Link to tag pages

### 2.3 Writer Data Structure

```typescript
interface Writer {
  id: string // slug-based
  name: string
  slug: string
  photo?: string // URL to photo/avatar
  tagline?: {
    en: string
    fa: string
  }
  biography: {
    en: string // Markdown or rich text
    fa: string
  }
  books: string[] // Book slugs or IDs
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
  tags: string[] // Tag slugs
}
```

---

## 3. Tags System Brainstorming

### 3.1 Tag Structure

**Tag Model:**
```typescript
interface Tag {
  id: string // slug-based
  name: {
    en: string
    fa: string
  }
  slug: string
  description?: {
    en: string
    fa: string
  }
  color?: string // For visual distinction
  icon?: string // Optional icon
}
```

**Tagging System:**
- Tags can be applied to:
  - Skills
  - Books
  - Writers
  - Categories
  - Future: Transcript sections, Summary sections

**Tag Relationships:**
- Many-to-many: One tag can apply to multiple items
- One item can have multiple tags

### 3.2 Tag Pages

**Tag Detail Page (`/tags/[slug]`):**
- Tag name and description
- List of all content with this tag:
  - Skills (with skill cards)
  - Books (with book cards)
  - Writers (with writer cards)
  - Categories (with category cards)
- Organized by content type
- Search/filter within tag page

**Tags List Page (`/tags`):**
- All available tags
- Tag cloud or grid
- Show tag count (how many items use this tag)
- Search/filter tags

### 3.3 Tag Display on Detail Pages

**Where to Show Tags:**
- Top of page (below header, before content)
- Bottom of page (after main content)
- Sidebar (if available)
- Inline with content (as badges)

**Tag Badge Design:**
- Small, rounded badges
- Color-coded (if tag has color)
- Clickable → navigate to tag page
- Show on hover: count of items with this tag

**Example Locations:**
- Skill detail page: Show tags related to this skill
- Book detail page: Show tags related to this book
- Writer detail page: Show tags related to this writer
- Category page: Show tags related to this category

---

## 4. Clickable Text Links Brainstorming

### 4.1 Content Parsing

**Biography/Introduction Text:**
- Parse markdown or rich text
- Detect mentions of:
  - Skills: "Focus" → link to `/skills/2`
  - Categories: "Health" → link to `/categories/health`
  - Books: "Why We Sleep" → link to `/books/why-we-sleep-matthew-walker`
  - Writers: "Matthew Walker" → link to `/writers/matthew-walker`

**Pattern Matching:**
- Use regex or NLP to detect entity mentions
- Match against known entities (skills, books, writers, categories)
- Create clickable links automatically

**Manual Override:**
- Allow manual markdown links: `[Focus](/skills/2)`
- Support both automatic and manual linking

### 4.2 Link Styling

**Visual Design:**
- Underlined or colored text
- Hover effect (show tooltip with entity name)
- Different colors for different entity types:
  - Skills: Primary color
  - Books: Secondary color
  - Writers: Accent color
  - Categories: Tertiary color

**Accessibility:**
- Clear visual indication of clickable text
- ARIA labels for screen readers
- Keyboard navigation support

---

## 5. Data Architecture

### 5.1 Writers Data

**Data Source:**
- Extract from existing books data (unique authors)
- Create new data files: `app/data/en/writers.ts`, `app/data/fa/writers.ts`
- Or combine with books data

**Data Generation:**
- Script to extract unique authors from books
- Manual enrichment for biographies, links, photos
- Link writers to their books

### 5.2 Tags Data

**Data Source:**
- Create new data files: `app/data/en/tags.ts`, `app/data/fa/tags.ts`
- Define tags manually or extract from content
- Link tags to skills, books, writers, categories

**Tag Assignment:**
- Skills: Based on skill content and relationships
- Books: Based on book topics and themes
- Writers: Based on writer expertise and focus
- Categories: Based on category themes

### 5.3 Content Linking

**Entity Resolution:**
- Create utility functions to:
  - Parse text and detect entity mentions
  - Resolve entity names to slugs/IDs
  - Generate clickable links
  - Handle bilingual content (Persian/English)

**Link Generation:**
- Component: `ClickableContent.vue`
- Props: `content` (text), `locale`
- Output: HTML with clickable links

---

## 6. UI/UX Considerations

### 6.1 Writers Page Design

**Layout:**
- Similar to books page layout
- Grid of writer cards
- Grouped by category
- Responsive (1/2/3/4 columns)

**Writer Card:**
- Photo/avatar (circular or rounded)
- Name (prominent)
- Brief bio excerpt (1-2 lines)
- Number of books badge
- Related skills badges
- Hover effect (3D or shadow)

### 6.2 Writer Detail Page Design

**Layout:**
- Hero section with photo and name
- Biography section (rich text, special styling)
- Related books section (grid with Inspira Book components)
- Resources section (links with icons)
- Related skills section (skill cards)
- Tags section (tag badges)

**Special Biography Design:**
- Quote-style sections
- Highlighted key points
- Sidebar with quick facts
- Timeline or milestones (if applicable)

### 6.3 Tags Display Design

**Tag Badges:**
- Small, rounded rectangles
- Color-coded
- Icon support (optional)
- Hover: show count and description
- Click: navigate to tag page

**Tag Page:**
- Tag header with name and description
- Content organized by type (Skills, Books, Writers, Categories)
- Grid layout for each content type
- Search/filter functionality

---

## 7. Implementation Phases

### Phase 1: Writers Foundation
1. Create Writer type definition
2. Extract writers from books data
3. Create writers data files
4. Create writers utilities (`app/utils/writers.ts`)

### Phase 2: Writers Pages
1. Create writers list page (`/writers`)
2. Create writer detail page (`/writers/[slug]`)
3. Create WriterCard component
4. Add writers to navigation

### Phase 3: Writer Content Enhancement
1. Add biography content (manual or from research)
2. Add external links (YouTube, website, social media)
3. Implement clickable text parsing
4. Create ClickableContent component

### Phase 4: Tags Foundation
1. Create Tag type definition
2. Create tags data files
3. Create tags utilities (`app/utils/tags.ts`)
4. Link tags to existing content

### Phase 5: Tags Pages
1. Create tags list page (`/tags`)
2. Create tag detail page (`/tags/[slug]`)
3. Create TagBadge component
4. Add tags to navigation

### Phase 6: Tags Integration
1. Add tags to skill detail pages
2. Add tags to book detail pages
3. Add tags to writer detail pages
4. Add tags to category pages

### Phase 7: Content Linking
1. Implement entity detection in text
2. Create ClickableContent component
3. Integrate into biography sections
4. Test and refine link detection

---

## 8. Technical Considerations

### 8.1 Data Management

**Writers:**
- Extract from books: `getAllAuthors()` → create writers
- Enrich with biographies, photos, links
- Link to books via book slugs

**Tags:**
- Define tags manually based on content themes
- Link tags to content via IDs/slugs
- Support many-to-many relationships

### 8.2 Content Parsing

**Entity Detection:**
- Use regex patterns to match entity names
- Maintain entity registry (skills, books, writers, categories)
- Handle bilingual matching (Persian/English)
- Support markdown links as fallback

**Link Generation:**
- Component-based approach
- Server-side rendering for SEO
- Client-side enhancement for interactivity

### 8.3 Performance

**Data Loading:**
- Static data (no API calls)
- Pre-render pages at build time
- Lazy load images (writer photos)

**Tag Filtering:**
- Client-side filtering for tag pages
- Efficient data structures (maps, sets)
- Debounced search

---

## 9. Open Questions

1. **Writer Photos:** Where to source photos? (Gravatar, manual upload, placeholder)
2. **Biography Content:** Manual entry or AI-generated from research?
3. **Tag Colors:** Predefined palette or user-defined?
4. **Content Linking:** Automatic only or manual override?
5. **Tag Hierarchy:** Flat tags or hierarchical (parent/child)?
6. **Writer Categories:** Single category or multiple?
7. **External Links:** All links or curated list?
8. **Biography Length:** Full biography or excerpt on list page?

---

## 10. Success Criteria

### Writers Feature
- ✅ Writers page displays all authors
- ✅ Writer detail pages show complete information
- ✅ Biography text is clickable (skills, books, categories)
- ✅ External links work correctly
- ✅ Related books display with Inspira Book components
- ✅ Mobile-responsive design

### Tags Feature
- ✅ Tags displayed on all detail pages
- ✅ Tag pages show all related content
- ✅ Tags are clickable and navigate correctly
- ✅ Tag badges are visually distinct
- ✅ Tag search/filter works

### Content Linking
- ✅ Entity mentions are automatically linked
- ✅ Links navigate to correct pages
- ✅ Bilingual support (Persian/English)
- ✅ Visual distinction for different entity types

---

## Next Steps

1. Review and refine brainstorming results
2. Create architecture documentation
3. Create stories using BMAD method
4. Prioritize implementation phases
5. Start with Phase 1 (Writers Foundation)

