# Story 4.4: Inspira UI Book Component Integration

**Epic:** Epic 4 - Content Pages  
**Status:** in-progress  
**Story ID:** 4-4-inspira-book-component

## User Story

As a user,
I want to see book cards displayed as beautiful 3D book components,
So that the books are visually appealing and engaging.

## Acceptance Criteria

**Given** I view books on any page (books page, skill pages)
**When** I see book cards
**Then** I see:
- ✅ 3D book components with hover animations
- ✅ Book title and author displayed clearly
- ✅ Clickable books that navigate to book detail pages
- ✅ Consistent sizing across all pages
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Proper color gradients matching theme

**Given** I hover over a book
**When** I interact with it
**Then** the book animates with a 3D rotation effect
**And** the animation is smooth and not jarring

**Given** I view books on different pages
**When** I see the book components
**Then** they are consistently sized and styled
**And** they work well in grid layouts

## Technical Requirements

### Component Integration
- Use Inspira UI Book component from https://inspira-ui.com/docs/components/miscellaneous/book
- Replace existing `BookCard` component with Inspira Book component
- Maintain clickable functionality (navigation to book detail pages)
- Support bilingual content (Persian/English)

### Sizing & Layout
- Test and optimize sizing for best UI/UX
- Ensure books look good in grid layouts (1, 2, 3 columns)
- Mobile-responsive sizing
- Consistent spacing between books

### Styling
- Match color scheme with app theme
- Support dark/light mode
- Smooth hover animations
- Proper text display (title, author)

## Tasks

- [x] Create story file
- [ ] Create Inspira Book component files
- [ ] Create wrapper component that integrates Book with navigation
- [ ] Replace BookCard in books/index.vue
- [ ] Replace BookCard in skills/[slug].vue
- [ ] Test sizing on different screen sizes
- [ ] Optimize sizing for best UI/UX
- [ ] Test hover animations
- [ ] Verify dark/light mode support
- [ ] Test bilingual content display

## Technical Notes

### File Locations
- Book component: `app/components/inspira/Book.vue` (and related files)
- Book wrapper: `app/components/books/BookCard.vue` (refactored)
- Books page: `app/pages/books/index.vue`
- Skill pages: `app/pages/skills/[slug].vue`

### Component Structure
Based on Inspira UI documentation:
- `Book.vue` - Main book component
- `BookHeader.vue` - Book header slot
- `BookTitle.vue` - Book title slot
- `BookDescription.vue` - Book description slot
- `index.ts` - Exports and type definitions

### Reference Implementation
- Checked `E:\NEXA\artemis-website\app\components\inspira\AnimatedBookCard.vue` for reference
- Similar approach but using official Inspira UI component

## Dependencies

- Story 4.3: Books Page (already completed)
- Story 3.3: Skill Pages (already completed)

## Success Criteria

- ✅ All book cards replaced with Inspira Book components
- ✅ 3D hover animations work smoothly
- ✅ Books are properly sized for all screen sizes
- ✅ Navigation to book detail pages works
- ✅ Dark/light mode support works
- ✅ Bilingual content displays correctly
- ✅ Consistent styling across all pages

## Notes

- Using Inspira UI Book component for modern 3D book visualization
- Need to test sizing in browser for optimal UI/UX
- Reference project shows similar implementation approach

