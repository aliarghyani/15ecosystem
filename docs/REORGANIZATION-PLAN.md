# Documentation Reorganization Plan

**Date:** 2025-11-23  
**Purpose:** Clean and organize docs folder with logical categorization

---

## New Structure

```
docs/
├── main/                          # Core project documentation
│   ├── PRD.md
│   ├── PRD-REVIEW-SUMMARY.md
│   ├── architecture.md
│   ├── ARCHITECTURE-NOTES.md
│   ├── product-brief-15ecosystem-2025-11-06.md
│   ├── research-market-2025-11-06.md
│   └── bmm-brainstorming-session-2025-11-06.md
│
├── tracking/                      # Active tracking files
│   ├── sprint-status.yaml
│   ├── bmm-workflow-status.yaml
│   └── epics.md
│
├── guides/                        # How-to guides and references
│   ├── how-to-add-transcripts.md
│   ├── how-to-add-summaries.md
│   ├── yt-dlp-setup.md
│   ├── yaml-schema-videos.md
│   ├── youtube-url-examples.md
│   └── BMAD-IDE-COMPATIBILITY.md
│
├── epic-8/                        # Epic 8 specific documentation
│   ├── epic-8-youtube-transcripts.md
│   └── (Epic 8 stories moved from stories/)
│
├── epic-9/                        # Epic 9 specific documentation
│   ├── epic-9-content-relationships-and-polish.md
│   ├── EPIC-9-IMPLEMENTATION-PLAN.md
│   ├── brainstorm-transcript-generation-stability.md
│   ├── FINAL-SUMMARY.md
│   └── (Epic 9 stories moved from stories/)
│
├── stories/                       # Active stories (Epic 1-7)
│   └── (Epic 1-7 stories only)
│
├── sources/                       # Source data files (unchanged)
│   ├── all khashayartalks videos .xlsx
│   ├── imported/
│   └── ...
│
└── archive/                       # Historical/completed docs
    ├── brainstorming/
    ├── planning/
    ├── architecture/
    └── README.md
```

---

## Files to Move

### To `docs/main/` (Core Documentation)
1. PRD.md
2. PRD-REVIEW-SUMMARY.md
3. architecture.md
4. ARCHITECTURE-NOTES.md
5. product-brief-15ecosystem-2025-11-06.md
6. research-market-2025-11-06.md
7. bmm-brainstorming-session-2025-11-06.md

### To `docs/tracking/` (Active Tracking)
1. sprint-status.yaml
2. bmm-workflow-status.yaml
3. epics.md

### To `docs/guides/` (How-To & References)
1. how-to-add-transcripts.md
2. how-to-add-summaries.md
3. yt-dlp-setup.md
4. yaml-schema-videos.md
5. youtube-url-examples.md
6. BMAD-IDE-COMPATIBILITY.md

### To `docs/epic-8/` (Epic 8 Documentation)
1. epic-8-youtube-transcripts.md
2. All Epic 8 stories from stories/ folder

### To `docs/epic-9/` (Epic 9 Documentation)
1. epic-9-content-relationships-and-polish.md
2. EPIC-9-IMPLEMENTATION-PLAN.md
3. brainstorm-transcript-generation-stability.md
4. FINAL-SUMMARY.md
5. All Epic 9 stories from stories/ folder

### To `docs/archive/brainstorming/` (Completed Brainstorming)
1. brainstorm-youtube-videos.md
2. brainstorm-writers-and-tags.md
3. brainstorm-excel-video-integration.md
4. brainstorm-diagram-library-decision.md
5. brainstorm-key-connections-context.md
6. brainstorm-model-relationships.md

### To `docs/archive/planning/` (Completed Planning)
1. youtube-api-integration-plan.md
2. diagram-enhancements-summary.md
3. investigation-prompt-skill-relationships.md
4. implementation-readiness-report-2025-11-06.md

### To `docs/archive/architecture/` (Superseded Architecture)
1. architecture-youtube-videos.md
2. architecture-writers-and-tags.md

### To DELETE (Cleanup/Summary files - no longer needed after reorganization)
1. CLEANUP-SUMMARY.md (superseded by this file)

---

## Story Files Organization

### Epic 1 Stories (Foundation)
- 1-1-project-setup-with-i18n.md
- 1-2-component-based-project-structure.md

### Epic 2 Stories (Content Extraction)
- 2-1-parse-yaml-source-files-bilingual.md
- 2-2-organize-skills-content-3-categories.md
- 2-2-organize-skills-content-3-categories.context.xml
- 2-3-extract-book-references.md
- 2-3-extract-book-references.context.xml

### Epic 3 Stories (Page Structure)
- 3-1-landing-page-bilingual.md
- 3-2-category-pages-3-categories.md
- 3-3-skill-pages-15-pages-component-based.md

### Epic 4 Stories (Content Pages)
- 4-1-transcript-page.md
- 4-2-summary-page.md
- 4-3-books-page.md
- 4-4-inspira-book-component.md (done)
- 4-5-writers-page.md (done)
- 4-6-tags-system.md (done)

### Epic 5 Stories (Visual Diagrams)
- 5-1-category-structure-diagram-3-categories-modern-design.md
- 5-2-skill-relationship-diagram.md
- 5-3-skill-page-relationship-diagrams.md (done)

### Epic 6 Stories (Navigation & Polish)
- 6-1-main-navigation-menu-bilingual.md (done)
- 6-2-breadcrumb-navigation.md (done)
- 6-3-skill-navigation-previous-next.md (done)
- 6-4-mobile-responsiveness-modern-design-polish.md (done)
- 6-5-performance-optimization-code-quality.md (done)

### Epic 7 Stories (YouTube Videos)
- 7-1-video-data-structure-types.md (done)
- 7-2-video-data-entry-yaml-structure.md (done)
- 7-3-video-components-card-list.md (done)
- 7-4-videos-list-page.md (done)
- 7-5-video-detail-page.md (done)
- 7-6-skill-page-video-integration.md (done)
- 7-7-playlists-support.md (done)
- 7-8-navigation-integration.md (done)

### Epic 8 Stories (YouTube API & Analytics)
- 8-0-excel-import-video-data-extraction.md (done)
- 8-0a-video-summary-data-structure-storage.md (done)
- 8-0b-excel-data-enrichment-skill-category-mapping.md (done)
- 8-1-video-transcript-data-structure-storage.md (done)
- 8-1-youtube-url-extraction-from-google-sheets.md
- 8-2-text-analysis-utilities-core-functions.md (done)
- 8-3-analysis-report-types-data-models.md (done)
- 8-4-report-generation-engine.md (done)

### Epic 9 Stories (Content Relationships & UI Polish)
- 9-1-type-sharding.md
- 9-2-transcript-audit.md
- 9-4-video-card-standardization.md
- 9-6-transcript-skill-extraction.md
- 9-14-transcript-generation-stability.md

---

## Implementation Steps

### Phase 1: Create New Directories
```bash
mkdir docs/main
mkdir docs/tracking
mkdir docs/guides
mkdir docs/epic-8
mkdir docs/epic-9
```

### Phase 2: Move Core Documentation
```bash
mv docs/PRD.md docs/main/
mv docs/PRD-REVIEW-SUMMARY.md docs/main/
mv docs/architecture.md docs/main/
mv docs/ARCHITECTURE-NOTES.md docs/main/
mv docs/product-brief-15ecosystem-2025-11-06.md docs/main/
mv docs/research-market-2025-11-06.md docs/main/
mv docs/bmm-brainstorming-session-2025-11-06.md docs/main/
```

### Phase 3: Move Tracking Files
```bash
mv docs/sprint-status.yaml docs/tracking/
mv docs/bmm-workflow-status.yaml docs/tracking/
mv docs/epics.md docs/tracking/
```

### Phase 4: Move Guides
```bash
mv docs/how-to-add-transcripts.md docs/guides/
mv docs/how-to-add-summaries.md docs/guides/
mv docs/yt-dlp-setup.md docs/guides/
mv docs/yaml-schema-videos.md docs/guides/
mv docs/youtube-url-examples.md docs/guides/
mv docs/BMAD-IDE-COMPATIBILITY.md docs/guides/
```

### Phase 5: Move Epic 8 Documentation
```bash
mv docs/epic-8-youtube-transcripts.md docs/epic-8/
# Move Epic 8 stories
mv docs/stories/8-*.md docs/epic-8/
```

### Phase 6: Move Epic 9 Documentation
```bash
mv docs/epic-9-content-relationships-and-polish.md docs/epic-9/
mv docs/EPIC-9-IMPLEMENTATION-PLAN.md docs/epic-9/
mv docs/brainstorm-transcript-generation-stability.md docs/epic-9/
mv docs/FINAL-SUMMARY.md docs/epic-9/
# Move Epic 9 stories
mv docs/stories/9-*.md docs/epic-9/
```

### Phase 7: Archive Completed Documents
```bash
# Brainstorming
mv docs/brainstorm-youtube-videos.md docs/archive/brainstorming/
mv docs/brainstorm-writers-and-tags.md docs/archive/brainstorming/
mv docs/brainstorm-excel-video-integration.md docs/archive/brainstorming/
mv docs/brainstorm-diagram-library-decision.md docs/archive/brainstorming/
mv docs/brainstorm-key-connections-context.md docs/archive/brainstorming/
mv docs/brainstorm-model-relationships.md docs/archive/brainstorming/

# Planning
mv docs/youtube-api-integration-plan.md docs/archive/planning/
mv docs/diagram-enhancements-summary.md docs/archive/planning/
mv docs/investigation-prompt-skill-relationships.md docs/archive/planning/
mv docs/implementation-readiness-report-2025-11-06.md docs/archive/planning/

# Architecture
mv docs/architecture-youtube-videos.md docs/archive/architecture/
mv docs/architecture-writers-and-tags.md docs/archive/architecture/
```

### Phase 8: Cleanup
```bash
rm docs/CLEANUP-SUMMARY.md
```

---

## After Reorganization

### docs/ Root Contents
```
docs/
├── main/              # 7 files
├── tracking/          # 3 files
├── guides/            # 6 files
├── epic-8/            # 1 epic doc + ~10 story files
├── epic-9/            # 4 epic docs + 5 story files
├── stories/           # Epic 1-7 stories (~30 files)
├── sources/           # Source data (unchanged)
├── archive/           # Historical docs (~12 files)
└── REORGANIZATION-PLAN.md (this file)
```

### Benefits
1. ✅ Clear categorization by purpose
2. ✅ Epic-specific documentation grouped
3. ✅ Easy to find active vs historical docs
4. ✅ Guides separated from planning docs
5. ✅ Tracking files in dedicated folder
6. ✅ Clean root directory

---

**Status:** Ready to Execute  
**Last Updated:** 2025-11-23

