# Story 5.1: Category Structure Diagram (3 Categories) - Modern Design

Status: review

## Story

As a user,
I want to see a modern visual diagram of the three-category structure,
So that I can understand how skills are organized.

## Acceptance Criteria

1. **Given** I view the landing page or category pages
   **When** I see the diagram
   **Then** I see:
   - Three main categories (Health, Identity, Career) clearly shown
   - 15 skills organized under their categories
   - Visual distinction between categories with modern design
   - Clickable skills (links to skill pages)
   - Modern, compact design following UI/UX best practices
   - Component-based diagram (CategoryDiagram component)
   - Responsive design (mobile, tablet, desktop)
   - Bilingual support (Persian/English)
   - RTL/LTR layout support

2. **Given** I view the diagram
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

- [x] Task 1: Create CategoryDiagram component (AC: #1)
  - [x] Create `app/components/diagrams/CategoryDiagram.vue`
  - [x] Design modern visual layout for 3 categories
  - [x] Use SVG or CSS for visualization
  - [x] Add animations and transitions
  - [x] Make component reusable and expandable

- [x] Task 2: Display categories and skills (AC: #1)
  - [x] Import categories and skills data
  - [x] Display 3 categories (Health, Identity, Career)
  - [x] Show 15 skills organized under their categories
  - [x] Add visual distinction between categories
  - [x] Use modern design patterns

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
  - [x] Optionally add to category pages
  - [x] Ensure proper spacing and layout
  - [x] Test bilingual support

- [x] Task 6: Polish and animations (AC: #1, #2)
  - [x] Add smooth animations
  - [x] Implement hover effects
  - [x] Ensure accessibility
  - [x] Test with dark mode

## Technical Notes

- Create `CategoryDiagram` component in `app/components/diagrams/`
- Use modern visualization (SVG or CSS with animations)
- Make skills clickable with proper hover states
- Ensure mobile-responsive with touch-friendly interactions
- Use Nuxt UI styling and Tailwind utilities
- Follow modern design trends (not traditional)
- Make component expandable for future features
- Support RTL/LTR layouts
- Use i18n for category names

## Prerequisites

- Story 3.1: Landing Page (Bilingual) - done
- Story 3.2: Category Pages (3 Categories) - done

## Dev Agent Record

### File List
- `app/components/diagrams/CategoryDiagram.vue` (new)
- `app/pages/index.vue` (modify)
- `app/pages/categories/[slug].vue` (optional modification)

### Implementation Notes
- Component should be reusable across multiple pages
- Consider using SVG for crisp rendering at all sizes
- Animations should be subtle and enhance UX
- Ensure component works in both light and dark modes

### Dev Agent Record

#### File List
- `app/components/diagrams/CategoryDiagram.vue` (created)
- `app/pages/index.vue` (modified - integrated diagram)

#### Completion Notes List
- Created CategoryDiagram component with modern horizontal flow layout
- Displays all 3 categories (Health, Identity, Career) with gradient headers
- Shows all 15 skills organized under their respective categories
- Skills are clickable with hover effects and navigate to skill pages
- Responsive design: vertical stack on mobile, horizontal flow on desktop
- Connector lines between categories on desktop, flow indicators on mobile
- Full RTL/LTR support with proper connector positioning
- Smooth animations and hover effects
- Integrated into landing page under Skills Overview section
- Component is reusable and expandable for future features

#### Debug Log References
- No errors encountered during implementation

