# Story 5.3: Skill Page Relationship Diagrams

**Epic:** Epic 5 - Visual Diagrams  
**Status:** backlog  
**Story ID:** 5-3-skill-page-relationship-diagrams

## User Story

As a user viewing a skill page,
I want to see a comprehensive diagram showing which skills are prerequisites (parents) and which skills this skill enables (children),
So that I understand the complete relationship network for this specific skill.

## Acceptance Criteria

**Given** I am viewing a skill detail page (e.g., `/skills/1`)

**When** I scroll to the relationship section

**Then** I see:
- A clear diagram showing:
  - **Prerequisites Section (Top)**: Skills that are required/enable this skill (parent skills)
  - **Current Skill (Center)**: The skill I'm viewing, highlighted prominently
  - **Enabled Skills Section (Bottom)**: Skills that this skill enables (child skills)
- The diagram uses Mermaid with interactive zoom/pan controls
- All connections are clearly labeled and visually distinct
- The diagram auto-fits to viewport on initial load
- Arrow keys work for navigation
- Mouse wheel works for zooming
- Drag works for panning

**And** the diagram shows:
- Skill numbers and names (bilingual)
- Clear directional arrows showing relationships
- Color-coded sections (prerequisites, current, enabled)
- Current skill highlighted with special styling

**Given** I view different skills

**When** I navigate between skill pages

**Then** each skill page shows its own unique relationship diagram
**And** the diagram accurately reflects the skill's relationships from the updated relationship data

## Technical Requirements

### Diagram Generation
- Use `generateSkillRelationshipDiagram()` from `app/utils/skill-diagrams.ts`
- Generate Mermaid flowchart syntax programmatically
- Show bidirectional relationships clearly

### Component Integration
- Add diagram section to `app/pages/skills/[slug].vue`
- Use `MermaidDiagram` component with interactive features
- Position diagram after "Related Skills" section or in a dedicated "Skill Relationships" section

### Visual Design
- Prerequisites: Top section, light color (e.g., blue)
- Current Skill: Center, highlighted (amber/gold), larger size
- Enabled Skills: Bottom section, light color (e.g., green)
- Clear directional arrows with labels
- Auto-fit to viewport on load
- Interactive zoom/pan controls

### Data Source
- Use updated skill relationships from `app/utils/content.ts`
- Relationships are bidirectional (if A enables B, B also connects to A)
- Show all related skills comprehensively

## Tasks

- [ ] Add diagram section to skill page component
- [ ] Import and use `generateSkillRelationshipDiagram()` utility
- [ ] Integrate `MermaidDiagram` component with interactive features
- [ ] Add i18n translations for diagram section
- [ ] Style diagram sections (prerequisites, current, enabled)
- [ ] Test auto-fit functionality
- [ ] Test keyboard navigation (arrow keys)
- [ ] Test mouse wheel zoom
- [ ] Test drag to pan
- [ ] Verify all 15 skills show correct relationships
- [ ] Test bilingual display (Persian/English)
- [ ] Ensure responsive design works on mobile

## Technical Notes

### File Locations
- Skill page: `app/pages/skills/[slug].vue`
- Diagram utility: `app/utils/skill-diagrams.ts`
- Mermaid component: `app/components/common/MermaidDiagram.client.vue`
- Relationship data: `app/utils/content.ts`

### Diagram Structure
```
Prerequisites (Top)
    ↓
Current Skill (Center - Highlighted)
    ↓
Enabled Skills (Bottom)
```

### Example for Skill 1 (Quality Sleep)
- **Prerequisites**: None (foundational skill)
- **Current**: Quality Sleep (1)
- **Enabled**: Focus (2), Dopamine (3), Stress (4), Mental Health (5), Longevity (6), Creativity (7), Specific Knowledge (8), Learning (9), English (10), Content Creation (13), AI Literacy (14)

### Example for Skill 9 (Learning)
- **Prerequisites**: Quality Sleep (1), Focus (2), Dopamine (3), Stress (4), Longevity (6), Creativity (7)
- **Current**: Learning (9)
- **Enabled**: Creativity (7), Specific Knowledge (8), English (10), Content Creation (13), AI Literacy (14), Agency (15)

## Dependencies

- Story 3.3: Skill Pages (must be completed first)
- Updated skill relationships from investigation (already completed)
- MermaidDiagram component (already created)

## Success Criteria

- ✅ All 15 skill pages show relationship diagrams
- ✅ Diagrams accurately reflect updated relationship data
- ✅ Diagrams are fully visible on first load (auto-fitted)
- ✅ Interactive features work (zoom, pan, arrow keys)
- ✅ Bilingual support works correctly
- ✅ Diagrams are clear and easy to understand
- ✅ Mobile responsive

## Notes

- This story focuses on individual skill relationship visualization
- Comprehensive relationship data is already available from investigation
- MermaidDiagram component with zoom/pan is already implemented
- Need to integrate into existing skill page structure

