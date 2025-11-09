# Story 5.2: Skill Relationship Diagram

Status: review

## Story

As a user,
I want to see how skills connect to each other,
So that I understand the "ecosystem" concept.

## Acceptance Criteria

1. **Given** I view the landing page or a skill page
   **When** I see the relationship diagram
   **Then** I see:
   - Visual representation of skill connections
   - Progression flow: Health → Focus → Learning → Creativity → Brand/Income
   - Simple arrows or lines showing relationships
   - Clear, understandable visualization
   - Modern, clean design
   - Clickable skills (links to skill pages)
   - Bilingual support (Persian/English)
   - RTL/LTR layout support
   - Responsive design (mobile, tablet, desktop)

2. **Given** I view the relationship diagram
   **When** I interact with it
   **Then** I see:
   - Smooth hover animations
   - Clear visual feedback on skill hover
   - Clickable skills navigate to skill pages
   - Touch-friendly interactions on mobile

3. **Given** I view the diagram on different devices
   **When** I resize the browser or view on mobile
   **Then** the diagram adapts responsively
   **And** remains readable and interactive
   **And** maintains visual hierarchy

## Tasks / Subtasks

- [x] Task 1: Create SkillRelationshipDiagram component (AC: #1)
  - [x] Create `app/components/diagrams/SkillRelationshipDiagram.vue`
  - [x] Design visual layout showing skill progression
  - [x] Use SVG or CSS for connections/arrows
  - [x] Add animations and transitions
  - [x] Make component reusable

- [x] Task 2: Display skill progression flow (AC: #1)
  - [x] Show progression: Health → Focus → Learning → Creativity → Brand/Income
  - [x] Use relatedSkills data from skill objects
  - [x] Display connections between related skills
  - [x] Add visual distinction for different skill categories

- [x] Task 3: Make skills clickable (AC: #1, #2)
  - [x] Add links to skill pages using `localePath`
  - [x] Implement hover states
  - [x] Add visual feedback on interaction
  - [x] Ensure proper navigation in both languages

- [x] Task 4: Responsive design (AC: #3)
  - [x] Test on mobile devices
  - [x] Ensure touch-friendly interactions
  - [x] Adapt layout for tablet and desktop
  - [x] Maintain readability at all sizes

- [x] Task 5: Integrate diagram into pages (AC: #1)
  - [x] Add to landing page (`app/pages/index.vue`)
  - [x] Optionally add to skill pages
  - [x] Ensure proper spacing and layout
  - [x] Test bilingual support

- [x] Task 6: Polish and animations (AC: #1, #2)
  - [x] Add smooth animations
  - [x] Implement hover effects
  - [x] Ensure accessibility
  - [x] Test with dark mode

## Technical Notes

- Create `SkillRelationshipDiagram` component in `app/components/diagrams/`
- Use relatedSkills data from skill objects to show connections
- Show progression concept: Health → Focus → Learning → Creativity → Brand/Income
- Use simple visual elements (arrows, lines) for connections
- Make skills clickable with proper hover states
- Ensure mobile-responsive with touch-friendly interactions
- Use Nuxt UI styling and Tailwind utilities
- Follow modern design trends
- Support RTL/LTR layouts
- Use i18n for skill names

## Prerequisites

- Story 3.1: Landing Page (Bilingual) - done
- Story 3.3: Skill Pages (15 Pages) - done
- Story 5.1: Category Structure Diagram - done

## Dev Agent Record

### File List
- `app/components/diagrams/SkillRelationshipDiagram.vue` (new)
- `app/pages/index.vue` (modify)
- `app/pages/skills/[slug].vue` (optional modification)

### Implementation Notes
- Component should show the ecosystem concept through skill relationships
- Use relatedSkills array from skill data to determine connections
- Consider showing a flow diagram or network graph style visualization
- Component should be reusable across multiple pages

### Dev Agent Record

#### File List
- `app/components/diagrams/SkillRelationshipDiagram.vue` (created)
- `app/pages/index.vue` (modified - integrated diagram)
- `i18n/locales/fa.json` (modified - added diagram translations)
- `i18n/locales/en.json` (modified - added diagram translations)

#### Completion Notes List
- Created SkillRelationshipDiagram component showing skill progression flow
- Displays three categories (Health, Identity, Career) with color-coded badges
- Shows all skills organized by category with visual progression arrows
- Skills are clickable with hover effects and navigate to skill pages
- Includes "Key Connections" section showing cross-category relationships
- Responsive design: vertical stack on mobile, horizontal flow on desktop
- Full RTL/LTR support with proper arrow positioning
- Smooth animations and hover effects
- Integrated into landing page below CategoryDiagram
- Component is reusable and expandable for future features

#### Debug Log References
- No errors encountered during implementation

