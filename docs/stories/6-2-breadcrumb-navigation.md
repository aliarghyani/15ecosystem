# Story 6.2: Breadcrumb Navigation

**Epic:** Epic 6 - Navigation & Polish  
**Status:** in-progress  
**Story ID:** 6-2-breadcrumb-navigation

## User Story

As a user,
I want breadcrumb navigation,
So that I always know where I am and can navigate back.

## Acceptance Criteria

**Given** I am on a skill or category page
**When** I see breadcrumbs
**Then** I see:
- ✅ Breadcrumb trail: Home > Category > Skill
- ✅ Clickable breadcrumb links
- ✅ Clear visual separator
- ✅ Not shown on landing page
- ✅ Proper RTL/LTR support
- ✅ Mobile-responsive design

**Given** I am on a book or writer page
**When** I see breadcrumbs
**Then** I see:
- ✅ Breadcrumb trail: Home > Books/Writers > Item Name
- ✅ Clickable breadcrumb links
- ✅ Clear visual separator

**Given** I am on a tag page
**When** I see breadcrumbs
**Then** I see:
- ✅ Breadcrumb trail: Home > Tags > Tag Name
- ✅ Clickable breadcrumb links

**Given** I am on the landing page
**When** I view the page
**Then** breadcrumbs are not displayed

## Technical Requirements

### Component
- Create reusable `Breadcrumb` component using **Nuxt UI 4 Breadcrumb component** (https://ui.nuxt.com/docs/components/breadcrumb)
- Component should accept breadcrumb items as props
- Support RTL/LTR layouts
- Mobile-responsive

### Integration
- Replace manual breadcrumb implementations on all pages with the new component
- Add breadcrumbs to pages that don't have them yet
- Ensure breadcrumbs are not shown on landing page

## Tasks

- [ ] Task 1: Create Breadcrumb component using Nuxt UI 4
- [ ] Task 2: Add breadcrumb utility function for generating breadcrumb items
- [ ] Task 3: Replace breadcrumbs on skill detail pages
- [ ] Task 4: Replace breadcrumbs on category pages
- [ ] Task 5: Replace breadcrumbs on book pages
- [ ] Task 6: Replace breadcrumbs on writer pages
- [ ] Task 7: Replace breadcrumbs on tag pages
- [ ] Task 8: Add breadcrumbs to other pages if needed
- [ ] Task 9: Ensure breadcrumbs are not shown on landing page
- [ ] Task 10: Test RTL/LTR support
- [ ] Task 11: Test mobile responsiveness
- [ ] Task 12: Add i18n translations if needed

## Technical Notes

### Component Library Priority
- **Primary:** Use Nuxt UI 4 Breadcrumb component from https://ui.nuxt.com/docs/components/breadcrumb
- **Reference:** Always check latest Nuxt UI 4 documentation for component props and usage
- **Styling:** Use Nuxt UI 4's built-in styling system and Tailwind CSS 4 utilities

### File Locations
- Breadcrumb component: `app/components/common/Breadcrumb.vue`
- Breadcrumb utility: `app/utils/breadcrumbs.ts` (optional)

### Breadcrumb Structure
- Each breadcrumb item should have: `label` (text), `to` (route path), `icon` (optional)
- Last item should not be clickable (current page)
- Use `NuxtLink` for navigation

## Dependencies

- Story 6.1: Main Navigation Menu (already completed)

## Success Criteria

- ✅ Reusable Breadcrumb component created
- ✅ All pages use the component
- ✅ Breadcrumbs are clickable and navigate correctly
- ✅ Visual separators are clear
- ✅ Not shown on landing page
- ✅ RTL/LTR support works correctly
- ✅ Mobile-responsive design
- ✅ Bilingual support works correctly

