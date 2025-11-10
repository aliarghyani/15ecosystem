# Story 4.6: Tags System

**Epic:** Epic 4 - Content Pages  
**Status:** backlog  
**Story ID:** 4-6-tags-system

## User Story

As a user,
I want to browse content by tags,
So that I can discover related skills, books, writers, and categories.

## Acceptance Criteria

**Given** I navigate to tags page
**When** I view the page
**Then** I see:
- ✅ List of all available tags
- ✅ Tag badges with names and colors
- ✅ Count of items for each tag
- ✅ Tags organized logically
- ✅ Search/filter functionality
- ✅ Mobile-responsive layout
- ✅ Bilingual support (Persian/English)

**Given** I click on a tag
**When** I navigate to tag detail page
**Then** I see:
- ✅ Tag name and description
- ✅ All content with this tag:
  - Skills (with skill cards)
  - Books (with book cards)
  - Writers (with writer cards)
  - Categories (with category cards)
- ✅ Content organized by type
- ✅ Links to all related content
- ✅ Mobile-responsive layout
- ✅ Bilingual support

**Given** I view a detail page (skill, book, writer, category)
**When** I see tags section
**Then** tags are displayed as badges
**And** tags are clickable
**And** clicking navigates to tag detail page

## Technical Requirements

### Data Structure
- Create `Tag` type definition
- Create tags data files (`app/data/en/tags.ts`, `app/data/fa/tags.ts`)
- Link tags to skills, books, writers, categories
- Update existing types to include `tags` field

### Pages
- Create `/tags` page (list view)
- Create `/tags/[slug]` page (detail view)

### Components
- Create `TagBadge` component using **Nuxt UI 4 Badge component** (https://ui.nuxt.com/docs/components/badge)
- Create `TagList` component (optional) using **Nuxt UI 4 components**
- Use **Nuxt UI 4 Input** component for search/filter functionality (https://ui.nuxt.com/docs/components/input)
- Use **Nuxt UI 4 Card** component for tag display sections (https://ui.nuxt.com/docs/components/card)

### Integration
- Add tags to skill detail pages
- Add tags to book detail pages
- Add tags to writer detail pages
- Add tags to category pages

## Tasks

- [ ] Task 1: Create Tag type definition
- [ ] Task 2: Update existing types (Skill, Book, Writer, Category) to include tags
- [ ] Task 3: Create tags data files
- [ ] Task 4: Create tags utilities (`app/utils/tags.ts`)
- [ ] Task 5: Create TagBadge component
- [ ] Task 6: Create tags list page (`/tags`)
- [ ] Task 7: Create tag detail page (`/tags/[slug]`)
- [ ] Task 8: Add tags to skill detail pages
- [ ] Task 9: Add tags to book detail pages
- [ ] Task 10: Add tags to writer detail pages
- [ ] Task 11: Add tags to category pages
- [ ] Task 12: Add tags to navigation
- [ ] Task 13: Add i18n translations
- [ ] Task 14: Test and verify functionality

## Technical Notes

### Component Library Priority
- **Primary:** Use Nuxt UI 4 components (Badge, Card, Input, etc.) from https://ui.nuxt.com/docs/components
- **Reference:** Always check latest Nuxt UI 4 documentation for component props and usage
- **Styling:** Use Nuxt UI 4's built-in styling system and Tailwind CSS 4 utilities

### File Locations
- Tag type: `app/types/index.ts`
- Tags data: `app/data/en/tags.ts`, `app/data/fa/tags.ts`
- Tags utilities: `app/utils/tags.ts`
- TagBadge component: `app/components/tags/TagBadge.vue`
- Tags list page: `app/pages/tags/index.vue`
- Tag detail page: `app/pages/tags/[slug].vue`

### Tag Assignment Strategy
- Skills: Based on skill content and relationships
- Books: Based on book topics and themes
- Writers: Based on writer expertise and focus
- Categories: Based on category themes

## Dependencies

- Story 4.3: Books Page (already completed)
- Story 4.5: Writers Page (prerequisite)

## Success Criteria

- ✅ Tags displayed on all detail pages
- ✅ Tag pages show all related content
- ✅ Tags are clickable and navigate correctly
- ✅ Tag badges are visually distinct
- ✅ Tag search/filter works
- ✅ Mobile-responsive design
- ✅ Bilingual support works correctly

