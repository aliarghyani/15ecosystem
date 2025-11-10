# Story 6.3: Skill Navigation (Previous/Next)

**Epic:** Epic 6 - Navigation & Polish  
**Status:** done  
**Story ID:** 6-3-skill-navigation-previous-next

## User Story

As a user,
I want to navigate between skills easily,
So that I can read through skills sequentially.

## Acceptance Criteria

**Given** I am on a skill page
**When** I see navigation
**Then** I see:
- ✅ "Previous Skill" button (if not first)
- ✅ "Next Skill" button (if not last)
- ✅ "All Skills" link
- ✅ "Back to Category" link

**Given** I am on the first skill (skill 1)
**When** I see navigation
**Then** I see:
- ✅ "Previous Skill" button is hidden
- ✅ "Next Skill" button is visible
- ✅ "Back to Category" link is visible

**Given** I am on the last skill (skill 15)
**When** I see navigation
**Then** I see:
- ✅ "Previous Skill" button is visible
- ✅ "Next Skill" button is hidden
- ✅ "Back to Category" link is visible

**Given** I am on a middle skill (e.g., skill 5)
**When** I see navigation
**Then** I see:
- ✅ Both "Previous Skill" and "Next Skill" buttons are visible
- ✅ "Back to Category" link is visible

**Given** I click on navigation buttons
**When** I navigate
**Then**:
- ✅ Previous/Next buttons navigate to correct skill pages
- ✅ Back to Category navigates to correct category page
- ✅ Navigation works in both Persian and English
- ✅ Icons are correctly positioned for RTL/LTR layouts

## Technical Requirements

### Component
- Use existing `SkillNavigation` component
- Add "All Skills" link to component
- Use Nuxt UI buttons for consistency
- Support RTL/LTR layouts with proper icon positioning
- Mobile-responsive design (stack on mobile, horizontal on desktop)

### Integration
- Component already integrated in `app/pages/skills/[slug].vue`
- Ensure proper prop passing (currentSkillId, categoryId)
- Verify utility functions `getNextSkill` and `getPreviousSkill` work correctly

## Tasks

- [x] Task 1: Verify SkillNavigation component exists and works
- [x] Task 2: Verify previous/next skill logic works correctly
- [x] Task 3: Verify translations exist for all navigation labels
- [x] Task 4: Add "All Skills" link to SkillNavigation component
- [x] Task 5: Test navigation on first, middle, and last skills
- [x] Task 6: Verify RTL/LTR icon positioning
- [x] Task 7: Test mobile responsiveness

## Implementation Notes

- Component location: `app/components/skills/SkillNavigation.vue`
- Utility functions: `app/utils/skills.ts` (getNextSkill, getPreviousSkill)
- Translations: Already exist in `i18n/locales/fa.json` and `i18n/locales/en.json`
- Integration: Already used in `app/pages/skills/[slug].vue`

## Current Status

✅ **Completed:**
- SkillNavigation component exists and is functional
- Previous/Next skill buttons work correctly
- Back to Category link works
- Translations are in place
- Component is integrated in skill detail pages
- RTL/LTR support with proper icon positioning
- Mobile-responsive layout

✅ **All tasks completed!**

