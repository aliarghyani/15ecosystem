# Story 4.5: Writers Page

**Epic:** Epic 4 - Content Pages  
**Status:** backlog  
**Story ID:** 4-5-writers-page

## User Story

As a user,
I want to see all writers/authors mentioned in the video,
So that I can explore their work, biographies, and resources.

## Acceptance Criteria

**Given** I navigate to writers page
**When** I view the page
**Then** I see:
- ✅ List of all writers organized by category
- ✅ Each writer shows: name, photo (if available), brief bio excerpt
- ✅ Number of books by each writer
- ✅ Related skills for each writer
- ✅ Writers grouped logically by category
- ✅ Links to writer detail pages
- ✅ Mobile-responsive layout
- ✅ Bilingual support (Persian/English)

**Given** I click on a writer
**When** I navigate to writer detail page
**Then** I see:
- ✅ Writer name and photo
- ✅ Complete biography with special design
- ✅ Related books (using Inspira Book components)
- ✅ External links (YouTube, website, social media)
- ✅ Related skills
- ✅ Tags (if available)
- ✅ Clickable mentions in biography (skills, books, categories)
- ✅ Mobile-responsive layout
- ✅ Bilingual support

**Given** I view a writer's biography
**When** I see mentions of skills, books, or categories
**Then** those mentions are clickable
**And** clicking navigates to the related page

## Technical Requirements

### Data Structure
- Create `Writer` type definition
- Extract unique writers from books data
- Create writers data files (`app/data/en/writers.ts`, `app/data/fa/writers.ts`)
- Link writers to books, skills, categories

### Pages
- Create `/writers` page (list view)
- Create `/writers/[slug]` page (detail view)
- Similar structure to books pages

### Components
- Create `WriterCard` component (similar to BookCard)
- Use Inspira Book components for related books
- Create `ClickableContent` component for biography parsing

### Content Linking
- Parse biography text for entity mentions
- Detect skills, books, categories, other writers
- Generate clickable links automatically
- Support markdown links as fallback

## Tasks

- [ ] Task 1: Create Writer type definition
- [ ] Task 2: Extract writers from books data
- [ ] Task 3: Create writers data files
- [ ] Task 4: Create writers utilities (`app/utils/writers.ts`)
- [ ] Task 5: Create WriterCard component
- [ ] Task 6: Create writers list page (`/writers`)
- [ ] Task 7: Create writer detail page (`/writers/[slug]`)
- [ ] Task 8: Add biography content (manual or research)
- [ ] Task 9: Add external links (YouTube, website, social media)
- [ ] Task 10: Implement ClickableContent component
- [ ] Task 11: Add content linking to biographies
- [ ] Task 12: Add writers to navigation
- [ ] Task 13: Add i18n translations
- [ ] Task 14: Test and verify functionality

## Technical Notes

### File Locations
- Writer type: `app/types/index.ts`
- Writers data: `app/data/en/writers.ts`, `app/data/fa/writers.ts`
- Writers utilities: `app/utils/writers.ts`
- WriterCard component: `app/components/writers/WriterCard.vue`
- Writers list page: `app/pages/writers/index.vue`
- Writer detail page: `app/pages/writers/[slug].vue`
- ClickableContent component: `app/components/content/ClickableContent.vue`

### Reference Implementation
- Similar to books page structure (`app/pages/books/index.vue`)
- Similar to book detail page (`app/pages/books/[slug].vue`)
- Use Inspira Book components for related books

## Dependencies

- Story 4.3: Books Page (already completed)
- Story 4.4: Inspira Book Component (already completed)

## Success Criteria

- ✅ All writers displayed on writers page
- ✅ Writer detail pages show complete information
- ✅ Biography text is clickable (skills, books, categories)
- ✅ External links work correctly
- ✅ Related books display with Inspira Book components
- ✅ Mobile-responsive design
- ✅ Bilingual support works correctly

