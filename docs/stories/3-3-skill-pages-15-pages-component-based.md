# Story 3.3: Skill Pages (15 pages) - Component-Based

Status: review

## Story

As a user,
I want to view detailed information about each skill,
So that I can learn about that specific skill.

## Acceptance Criteria

1. **Given** I navigate to a skill page
   **When** I view the skill
   **Then** I see:
   - Skill number and name prominently displayed (bilingual)
   - "Why it matters" section with content from video (bilingual)
   - "How to" section with practical guidance (bilingual)
   - Book references listed using BookCard component
   - Related skills section (if available)
   - Navigation: Previous/Next skill, Back to category
   - Breadcrumb navigation
   - Modern, compact design following UI/UX best practices

2. **Given** I view any skill page
   **When** I scroll through content
   **Then** content is well-formatted and readable
   **And** mobile-responsive
   **And** uses component-based layout (expandable)

3. **Given** I view a skill page
   **When** I interact with navigation elements
   **Then** I can navigate to previous/next skill
   **And** I can navigate back to category
   **And** navigation works correctly in both languages
   **And** breadcrumb navigation shows my location

## Tasks / Subtasks

- [x] Task 1: Create dynamic skill page route (AC: #1)
  - [x] Create `app/pages/skills/[slug].vue` for dynamic routing
  - [x] Handle skill slugs (1-15 or skill IDs)
  - [x] Validate skill slug and handle invalid routes (404)
  - [x] Use i18n routing with locale prefixes

- [x] Task 2: Create BookCard component (AC: #1)
  - [x] Create `app/components/books/BookCard.vue`
  - [x] Display book title and author
  - [x] Add optional link to book page (future)
  - [x] Ensure modern, compact design
  - [x] Support hover effects

- [x] Task 3: Create SkillNavigation component (AC: #1, #3)
  - [x] Create `app/components/skills/SkillNavigation.vue`
  - [x] Display Previous/Next skill buttons
  - [x] Display Back to Category button
  - [x] Handle edge cases (first/last skill)
  - [x] Ensure navigation works in both languages

- [x] Task 4: Display skill information (AC: #1)
  - [x] Display skill number and name prominently
  - [x] Display "Why it matters" section with content
  - [x] Display "How to" section with practical guidance
  - [x] Use skill data from utilities
  - [x] Ensure proper typography and spacing

- [x] Task 5: Display book references (AC: #1)
  - [x] Get books for skill using `getBooksBySkillId()`
  - [x] Display books using BookCard components
  - [x] Show book title and author
  - [x] Handle empty book list gracefully

- [x] Task 6: Display related skills (AC: #1)
  - [x] Get related skills using `getRelatedSkills()`
  - [x] Display related skills using SkillCard components
  - [x] Show related skills section only if available
  - [x] Ensure proper layout and spacing

- [x] Task 7: Add breadcrumb navigation (AC: #1, #3)
  - [x] Add breadcrumb navigation (Home > Category > Skill)
  - [x] Ensure breadcrumb works in both languages
  - [x] Use proper Nuxt routing with i18n prefixes

- [x] Task 8: Ensure responsive design (AC: #2)
  - [x] Verify mobile-responsive layout
  - [x] Ensure content is readable on mobile
  - [x] Verify proper spacing and typography
  - [x] Test on different screen sizes

- [x] Task 9: Add i18n translations (AC: #1, #3)
  - [x] Add skill page translations to `i18n/locales/en.json`
  - [x] Add skill page translations to `i18n/locales/fa.json`
  - [x] Ensure all text content uses i18n keys
  - [x] Add navigation translations

- [x] Task 10: Test and verify functionality (AC: #1, #2, #3)
  - [x] Test navigation to skill pages (1-15)
  - [x] Test previous/next skill navigation
  - [x] Test back to category navigation
  - [x] Test breadcrumb navigation
  - [x] Verify all content displays correctly in both languages
  - [x] Verify RTL/LTR layout works correctly
  - [x] Test mobile responsiveness

## Dev Notes

### Architecture Patterns and Constraints

**Reference Architecture:** https://github.com/aliarghyani/nuxt-portfolio

**Key Architectural Decisions:**
- **Dynamic Routing:** Use `app/pages/skills/[slug].vue` for skill pages [Source: docs/architecture.md#Implementation-Patterns]
- **Component Usage:** Create BookCard and SkillNavigation components [Source: docs/epics.md#Story-3.3]
- **Data Access:** Use `getSkillById()`, `getBooksBySkillId()`, `getRelatedSkills()` from utilities [Source: docs/stories/2-2-organize-skills-content-3-categories.md]
- **Routing:** Use Nuxt routing with i18n prefixes (`/skills/1` or `/fa/skills/1`) [Source: docs/architecture.md#Technology-Stack-Details]

**Technical Constraints:**
- Must use existing skill, book, and category utilities
- Must support dynamic routing for 15 skills
- Must create BookCard component (reusable)
- Must create SkillNavigation component (reusable)
- Must follow portfolio's component patterns
- Must support RTL/LTR switching

### Project Structure Notes

**Page Location:**
- `app/pages/skills/[slug].vue` - Dynamic skill page (to be created)

**Component Creation:**
- `app/components/books/BookCard.vue` - Book card component (to be created)
- `app/components/skills/SkillNavigation.vue` - Skill navigation component (to be created)
- Can reuse SkillCard component from Story 3.2

**Data Access:**
- Use `getSkillById()` from `app/utils/skills.ts`
- Use `getBooksBySkillId()` from `app/utils/books.ts`
- Use `getRelatedSkills()` from `app/utils/skills.ts`
- Use `getCategoryById()` from `app/utils/categories.ts` for breadcrumbs

**i18n Files:**
- `i18n/locales/en.json` - English translations
- `i18n/locales/fa.json` - Persian translations

### Testing Standards

**Functional Testing:**
- Verify all 15 skill pages load correctly
- Verify skill content displays correctly (whyItMatters, howTo)
- Verify book references display correctly
- Verify related skills display correctly
- Verify navigation (prev/next, back to category) works
- Verify breadcrumb navigation works
- Verify 404 handling for invalid skill slugs

**Visual Testing:**
- Verify modern, compact design
- Verify mobile responsiveness
- Verify content readability
- Verify proper spacing and typography
- Verify RTL/LTR layout works

### References

- [Source: docs/epics.md#Story-3.3-Skill-Pages-15-pages-Component-Based] - Story acceptance criteria and technical notes
- [Source: docs/architecture.md#Project-Structure] - Page structure and component organization
- [Source: docs/stories/2-2-organize-skills-content-3-categories.md] - Skill data structure
- [Source: docs/stories/2-3-extract-book-references.md] - Book data structure
- [Source: docs/stories/3-2-category-pages-3-categories.md] - Category page implementation learnings

### Learnings from Previous Stories

**From Story 3.2 (Status: review):**
- **SkillCard Component**: SkillCard component already created and reusable
- **Dynamic Routing**: Dynamic routing pattern established with [slug].vue
- **Navigation Patterns**: Breadcrumb navigation pattern established
- **Design Patterns**: Modern design patterns with UCard components, hover effects, responsive grids
- **i18n Integration**: Use `useI18n()` composable and `localePath()` helper

**From Story 2.2 (Status: review):**
- **Skill Utilities**: Skill utilities available: `getSkillById()`, `getRelatedSkills()`, `getNextSkill()`, `getPreviousSkill()`
- **Skill Data**: Skills have complete structure with whyItMatters, howTo, books, relatedSkills
- **Category Data**: Categories properly organized for breadcrumb navigation

**From Story 2.3 (Status: review):**
- **Book Utilities**: Book utilities available: `getBooksBySkillId()`, `getAllBooks()`
- **Book Data**: Books properly linked to skills via skillIds

**Key Reuse Opportunities:**
- Use SkillCard component for related skills display
- Use dynamic routing pattern from category pages
- Use breadcrumb navigation pattern from category pages
- Use `getSkillById()` for skill data
- Use `getBooksBySkillId()` for book references
- Use `getRelatedSkills()` for related skills
- Use `getNextSkill()` and `getPreviousSkill()` for navigation

**Enhancements Needed:**
- Create BookCard component for book display
- Create SkillNavigation component for prev/next navigation
- Create dynamic skill page route
- Add skill content sections (whyItMatters, howTo)
- Add related skills section
- Ensure mobile-responsive design

## Dev Agent Record

### Context Reference

- `docs/stories/3-3-skill-pages-15-pages-component-based.context.xml` - Technical context XML with documentation, code artifacts, constraints, interfaces, and testing guidance

### Agent Model Used

Composer (BMAD DEV Agent)

### Debug Log References

**Implementation Plan:**
- Created dynamic skill page route with [slug].vue supporting skill IDs (1-15)
- Created reusable BookCard component for book display
- Created reusable SkillNavigation component for prev/next navigation
- Integrated skill, book, and category data using utilities
- Added breadcrumb navigation (Home > Category > Skill)
- Added comprehensive i18n translations
- Ensured responsive design and mobile support

**Design Decisions:**
- Used UCard components for content sections (Why It Matters, How To)
- Created compact BookCard with icon and title/author
- Implemented responsive SkillNavigation with proper RTL/LTR icon positioning
- Used SkillCard component for related skills display
- Added proper spacing and typography for readability
- Implemented graceful handling of empty states (no books, no related skills)

### Completion Notes List

✅ **Story 3.3 Implementation Complete** (2025-01-XX)

**Key Accomplishments:**
- Created dynamic skill page route (`app/pages/skills/[slug].vue`) supporting all 15 skills (IDs 1-15)
- Created reusable BookCard component (`app/components/books/BookCard.vue`) for book display
- Created reusable SkillNavigation component (`app/components/skills/SkillNavigation.vue`) for prev/next navigation
- Displayed skill information (number, name, whyItMatters, howTo) in bilingual format
- Displayed book references using BookCard components with graceful empty state handling
- Displayed related skills using SkillCard components (only if available)
- Implemented breadcrumb navigation (Home > Category > Skill)
- Added skill navigation (Previous/Next skill, Back to Category) with edge case handling
- Ensured responsive design with mobile-first approach
- Added comprehensive i18n translations for skill pages

**Technical Implementation:**
- **Dynamic Routing**: Created `app/pages/skills/[slug].vue` with skill ID validation (1-15) and 404 handling
- **BookCard Component**: Created `app/components/books/BookCard.vue` with props for flexibility (showAuthor, variant)
- **SkillNavigation Component**: Created `app/components/skills/SkillNavigation.vue` with prev/next buttons and back to category, handles edge cases (first/last skill)
- **Skill Data**: Used `getSkillById()` from `app/utils/skills.ts` for skill information
- **Book Data**: Used `getBooksBySkillId()` from `app/utils/books.ts` for book references
- **Related Skills**: Used `getRelatedSkills()` from `app/utils/skills.ts` for related skills
- **Navigation**: Used `getNextSkill()` and `getPreviousSkill()` from `app/utils/skills.ts` for navigation
- **Category Data**: Used `getCategoryById()` from `app/utils/categories.ts` for breadcrumb navigation
- **i18n**: Added comprehensive translations for skill pages, navigation, and breadcrumbs

**Page Features:**
- Skill header with large number and name prominently displayed
- Category badge showing category name and skill count
- "Why It Matters" section with skill content in UCard
- "How To" section with practical guidance in UCard
- Book references section displaying books using BookCard components
- Related skills section displaying related skills using SkillCard components (compact variant)
- Breadcrumb navigation (Home > Category > Skill)
- Skill navigation (Previous/Next skill, Back to Category)
- 404 page for invalid skill IDs
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- RTL/LTR support

**BookCard Component Features:**
- Displays book title and author
- Icon-based design with book icon
- Optional author display
- Variant support (default, compact)
- Modern design with hover effects
- Ready for future book page links

**SkillNavigation Component Features:**
- Previous/Next skill buttons with skill numbers
- Back to Category button
- Handles edge cases (no previous for first skill, no next for last skill)
- RTL/LTR icon positioning (arrows flip for Persian)
- Responsive layout (stacked on mobile, horizontal on desktop)
- Compact mobile labels (Previous/Next) vs full labels (Previous Skill/Next Skill)

**i18n Translations Added:**
- `skills.whyItMatters` - Why It Matters section title
- `skills.howTo` - How To section title
- `skills.bookReferences` - Book References section title
- `skills.relatedSkills` - Related Skills section title
- `skills.noBooks` - No books message
- `skills.noRelatedSkills` - No related skills message
- `skills.previousSkill` - Previous Skill button label
- `skills.nextSkill` - Next Skill button label
- `skills.previous` - Previous button label (mobile)
- `skills.next` - Next button label (mobile)
- `skills.backToCategory` - Back to Category button label
- `breadcrumb.skills` - Skills breadcrumb

**Verification Results:**
- ✅ All 15 skill pages load correctly (IDs 1-15)
- ✅ Skill content displays correctly (whyItMatters, howTo)
- ✅ Book references display correctly using BookCard components
- ✅ Related skills display correctly using SkillCard components
- ✅ Navigation (prev/next, back to category) works correctly
- ✅ Breadcrumb navigation works correctly
- ✅ 404 handling for invalid skill IDs
- ✅ All content displays correctly in both languages
- ✅ RTL/LTR layout works correctly
- ✅ Mobile-responsive design verified
- ✅ Edge cases handled (first/last skill, no books, no related skills)

**Note:** BookCard component is ready for future book page links when book pages are implemented.

### File List

**Created Files:**
- `app/pages/skills/[slug].vue` - Dynamic skill page route
- `app/components/books/BookCard.vue` - Reusable book card component
- `app/components/skills/SkillNavigation.vue` - Reusable skill navigation component

**Modified Files:**
- `i18n/locales/en.json` - Added skill page, navigation, and breadcrumb translations
- `i18n/locales/fa.json` - Added skill page, navigation, and breadcrumb translations (Persian)

