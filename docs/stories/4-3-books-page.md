# Story 4.3: Books Page

Status: review

## Story

As a user,
I want to see all books mentioned in the video,
So that I can find resources to learn more.

## Acceptance Criteria

1. **Given** I navigate to books page
   **When** I view the page
   **Then** I see:
   - List of all books organized by category or skill
   - Each book shows: title, author
   - Which skill(s) each book relates to
   - Books grouped logically
   - Links back to related skills
   - Mobile-responsive layout
   - Bilingual support (Persian/English)

2. **Given** I view the books page
   **When** I scroll through content
   **Then** content is well-formatted and readable
   **And** mobile-responsive
   **And** proper spacing and typography

3. **Given** I click on a skill link
   **When** I navigate to a skill
   **Then** I am taken to the skill page
   **And** navigation works correctly in both languages

## Tasks / Subtasks

- [x] Task 1: Create books page route (AC: #1)
  - [x] Create `app/pages/books.vue`
  - [x] Use i18n routing with locale prefixes
  - [x] Add page to navigation

- [x] Task 2: Display books organized by category (AC: #1)
  - [x] Import books data from `app/data/fa/books.ts` or `app/data/en/books.ts`
  - [x] Use `getBooksByCategory()` utility function
  - [x] Group books by category (health, identity, career)
  - [x] Display books using BookCard component
  - [x] Show category headers

- [x] Task 3: Display skill links for each book (AC: #1, #3)
  - [x] Show which skill(s) each book relates to
  - [x] Convert skill IDs to clickable links
  - [x] Link to skill pages using `localePath()`
  - [x] Ensure links work in both languages

- [x] Task 4: Ensure responsive design (AC: #1, #2)
  - [x] Verify mobile-responsive layout
  - [x] Ensure content is readable on mobile
  - [x] Use grid layout for books
  - [x] Verify proper spacing and typography
  - [x] Test on different screen sizes

- [x] Task 5: Add i18n translations (AC: #1, #3)
  - [x] Add books page translations to `i18n/locales/en.json`
  - [x] Add books page translations to `i18n/locales/fa.json`
  - [x] Ensure page title and navigation use i18n keys
  - [x] Handle empty books list gracefully

- [x] Task 6: Add navigation and breadcrumbs (AC: #1)
  - [x] Add breadcrumb navigation (Home > Books)
  - [x] Add back to home link
  - [x] Ensure navigation works in both languages

- [x] Task 7: Test and verify functionality (AC: #1, #2, #3)
  - [x] Test books page loads correctly
  - [x] Test books are organized by category
  - [x] Test skill link navigation
  - [x] Test language switching
  - [x] Test breadcrumb navigation
  - [x] Verify all content displays correctly in both languages
  - [x] Verify RTL/LTR layout works correctly
  - [x] Test mobile responsiveness

## Dev Notes

### Architecture Patterns and Constraints

**Reference Architecture:** https://github.com/aliarghyani/nuxt-portfolio

**Key Architectural Decisions:**
- **Page Structure:** Use `app/pages/books.vue` for books page [Source: docs/architecture.md#Project-Structure]
- **Data Access:** Use `getBooksByCategory()` from `app/utils/books.ts` [Source: docs/stories/2-3-extract-book-references.md]
- **Component Reuse:** Use existing `BookCard` component [Source: docs/stories/3-3-skill-pages-15-pages-component-based.md]
- **Routing:** Use Nuxt routing with i18n prefixes (`/books` or `/fa/books`) [Source: docs/architecture.md#Technology-Stack-Details]

**Technical Constraints:**
- Must use existing books data from `app/data/`
- Must use existing `BookCard` component
- Must use `getBooksByCategory()` utility function
- Must support bilingual content (Persian/English)
- Must convert skill IDs to clickable links
- Must follow portfolio's component patterns

### Project Structure Notes

**Page Location:**
- `app/pages/books.vue` - Books page (to be created)

**Data Access:**
- Use `getBooksByCategory()` from `app/utils/books.ts`
- Books are linked to skills through `skillIds` array
- Books can be organized by category through their linked skills

**Component Reuse:**
- Use `BookCard` component from `app/components/books/BookCard.vue`
- Books already have `title`, `author`, and `skillIds` properties

**i18n Files:**
- `i18n/locales/en.json` - English translations
- `i18n/locales/fa.json` - Persian translations

### Testing Standards

**Functional Testing:**
- Verify books page loads correctly
- Verify books are organized by category
- Verify skill links navigate to skill pages
- Verify language switching updates content
- Verify breadcrumb navigation works
- Verify empty books list handled gracefully

**Visual Testing:**
- Verify modern, readable design
- Verify mobile responsiveness
- Verify proper spacing and typography
- Verify books grid layout works correctly
- Verify RTL/LTR layout works

### References

- [Source: docs/epics.md#Story-4.3-Books-Page] - Story acceptance criteria and technical notes
- [Source: docs/architecture.md#Project-Structure] - Page structure and component organization
- [Source: docs/stories/2-3-extract-book-references.md] - Books data structure
- [Source: docs/stories/3-3-skill-pages-15-pages-component-based.md] - BookCard component usage
- [Source: docs/stories/4-1-transcript-page.md] - Page structure patterns

### Learnings from Previous Stories

**From Story 4.1 (Status: review):**
- **Page Pattern**: Similar page structure can be reused (breadcrumb, header, content, navigation)
- **Navigation**: Breadcrumb navigation pattern established

**From Story 4.2 (Status: review):**
- **Page Pattern**: Similar page structure can be reused
- **Skill Links**: Can use `localePath('/skills/${id}')` for skill navigation

**From Story 3.3 (Status: review):**
- **BookCard Component**: Already created and can be reused
- **Book Display**: Books displayed in grid layout using BookCard

**Key Reuse Opportunities:**
- Use breadcrumb navigation pattern from transcript/summary pages
- Use page structure pattern from transcript/summary pages
- Use `BookCard` component from skill pages
- Use `localePath()` for skill links
- Use `getBooksByCategory()` utility function
- Follow responsive design patterns

**Enhancements Needed:**
- Create books page route
- Organize books by category
- Display skill links for each book
- Ensure mobile-responsive design

## Dev Agent Record

### Context Reference

<!-- Story context will be created by story-context workflow if needed -->

### Agent Model Used

Composer (BMAD DEV Agent)

### Debug Log References

**Implementation Plan:**
- Created books page route with i18n support
- Used `getBooksByCategory()` utility function to organize books
- Displayed books using existing BookCard component
- Added skill links for each book
- Added breadcrumb navigation
- Ensured responsive design and mobile support

**Design Decisions:**
- Organized books by category (health, identity, career)
- Used grid layout for books (responsive: 1 column mobile, 2 tablet, 3 desktop)
- Displayed skill links below each book card
- Used existing BookCard component for consistency
- Added category headers with descriptions

### Completion Notes List

✅ **Story 4.3 Implementation Complete** (2025-01-XX)

**Key Accomplishments:**
- Created books page route (`app/pages/books.vue`) with i18n support
- Displayed all books organized by category (health, identity, career)
- Used `getBooksByCategory()` utility function for data access
- Displayed books using existing BookCard component
- Added skill links for each book (showing which skills each book relates to)
- Added breadcrumb navigation (Home > Books)
- Added back to home navigation button
- Handled empty books list gracefully
- Ensured responsive design with mobile-first approach
- Added comprehensive i18n translations for books page

**Technical Implementation:**
- **Page Route**: Created `app/pages/books.vue` with i18n routing support
- **Data Access**: Used `getBooksByCategory()` from `app/utils/books.ts` to organize books by category
- **Component Reuse**: Used existing `BookCard` component from `app/components/books/BookCard.vue`
- **Skill Links**: Displayed skill IDs as clickable links using `localePath('/skills/${id}')`
- **Category Organization**: Books organized by category (health, identity, career) with category headers
- **Empty State**: Added graceful handling for empty books list with user-friendly message
- **Navigation**: Implemented breadcrumb navigation and back to home button using `localePath()` helper
- **RTL/LTR Support**: Automatic support through existing components and layout
- **i18n**: Added comprehensive translations for books page

**Page Features:**
- Page header with title and description (bilingual)
- Books organized by category (health, identity, career)
- Category headers with descriptions
- Books displayed in responsive grid layout (1/2/3 columns)
- Skill links below each book card
- Breadcrumb navigation (Home > Books)
- Back to Home button
- Empty state message for empty books list
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- RTL/LTR support through existing components

**Grid Layout:**
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): 3 columns
- Proper spacing and gap between cards

**i18n Translations Added:**
- `books.title` - Books page title
- `books.description` - Books page description
- `books.categoryDescription` - Category description with count
- `books.relatedToSkill` - Skill link text
- `books.noBooks` - Empty books message

**Verification Results:**
- ✅ Books page loads correctly
- ✅ Books are organized by category correctly
- ✅ Books display using BookCard component
- ✅ Skill links navigate to skill pages correctly
- ✅ Language switching updates content
- ✅ Breadcrumb navigation works correctly
- ✅ Back to home navigation works
- ✅ All content displays correctly in both languages
- ✅ RTL/LTR layout works correctly
- ✅ Mobile-responsive design verified
- ✅ Grid layout works correctly on all screen sizes

### File List

**Created Files:**
- `app/pages/books.vue` - Books page route

**Modified Files:**
- `i18n/locales/en.json` - Added books page translations
- `i18n/locales/fa.json` - Added books page translations (Persian)

