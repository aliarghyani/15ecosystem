# Story 7.6: Skill Page Video Integration

**Epic:** Epic 7 - YouTube Videos Integration  
**Status:** done  
**Story ID:** 7-6-skill-page-video-integration

## User Story

As a user,
I want to see videos related to a skill,
So that I can learn more about that skill.

## Acceptance Criteria

**Given** I view a skill detail page
**When** I scroll down
**Then** I see:
- "Related Videos" section
- Video cards for videos related to the skill
- Link to videos list page filtered by skill
- Videos grouped by playlist (if applicable)

**Prerequisites:** Story 7.3, 7.4

## Technical Requirements

### Page Updates

**Location:** `app/pages/skills/[slug].vue`

**Features:**
- Add "Related Videos" section after books section
- Display up to 4 videos in a grid
- Show "View All" button linking to filtered videos page
- Show "View All X Videos" button if more than 4 videos
- Use VideoCard component
- Filter videos by skill ID using `getVideosBySkillId`

### Data Loading

- Load videos using `getVideosBySkillId(skillId, locale)`
- Display videos in responsive grid
- Link to `/videos?skill={skillId}` for filtered view

## Tasks

- [x] Task 1: Import VideoCard component and getVideosBySkillId utility
- [x] Task 2: Add relatedVideos ref
- [x] Task 3: Load videos in watch function
- [x] Task 4: Add "Related Videos" section to template
- [x] Task 5: Display video cards in grid
- [x] Task 6: Add "View All" button linking to filtered videos page
- [x] Task 7: Add "View All X Videos" button for more than 4 videos
- [x] Task 8: Add i18n translations

## Implementation Notes

- Videos section placed after books section and before related skills
- Shows up to 4 videos initially
- "View All" button links to `/videos?skill={skillId}`
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop, 4 col xl)
- Uses VideoCard component with default variant
- Bilingual support

## Completed Features

- ✅ Related Videos section added to skill detail page
- ✅ Video cards displayed in responsive grid
- ✅ "View All" button linking to filtered videos page
- ✅ "View All X Videos" button for more than 4 videos
- ✅ Videos filtered by skill ID
- ✅ Responsive design
- ✅ Bilingual support

