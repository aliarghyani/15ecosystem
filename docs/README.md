# Documentation Directory

**Project:** 15ecosystem  
**Last Updated:** 2025-11-23

---

## Directory Structure

```
docs/
├── main/              # Core project documentation
├── tracking/          # Active tracking files
├── guides/            # How-to guides and references
├── epic-8/            # Epic 8 specific documentation
├── epic-9/            # Epic 9 specific documentation
├── stories/           # Active stories (Epic 1-7)
├── sources/           # Source data files
├── archive/           # Historical/completed documentation
└── README.md          # This file
```

---

## Quick Reference

### 📋 Core Documentation (`main/`)
Essential project documents:
- **PRD.md** - Product Requirements Document
- **architecture.md** - System architecture
- **product-brief-15ecosystem-2025-11-06.md** - Product brief
- **research-market-2025-11-06.md** - Market research

### 📊 Tracking (`tracking/`)
Active project tracking:
- **sprint-status.yaml** - Current sprint status
- **bmm-workflow-status.yaml** - Workflow status
- **epics.md** - All epics documentation

### 📖 Guides (`guides/`)
How-to guides and references:
- **how-to-add-transcripts.md** - Transcript guide
- **how-to-add-summaries.md** - Summary guide
- **yt-dlp-setup.md** - yt-dlp setup
- **BMAD-IDE-COMPATIBILITY.md** - IDE compatibility

### 🎯 Epic 8 (`epic-8/`)
YouTube API Integration & Analytics:
- Epic documentation
- All Epic 8 stories
- Implementation details

### 🎯 Epic 9 (`epic-9/`)
Content Relationships & UI Polish:
- Epic documentation
- Implementation plan
- All Epic 9 stories
- Final summary

### 📝 Stories (`stories/`)
Active story files for Epic 1-7:
- Foundation (Epic 1)
- Content Extraction (Epic 2)
- Page Structure (Epic 3)
- Content Pages (Epic 4)
- Visual Diagrams (Epic 5)
- Navigation & Polish (Epic 6)
- YouTube Videos (Epic 7)

### 📦 Sources (`sources/`)
Source data files:
- Excel files
- Imported data (JSON)
- YAML files

### 🗄️ Archive (`archive/`)
Historical documentation:
- Completed brainstorming sessions
- Implemented planning documents
- Superseded architecture docs

---

## Finding What You Need

### "I want to understand the project"
→ Start with `main/PRD.md` and `main/product-brief-15ecosystem-2025-11-06.md`

### "I want to see current progress"
→ Check `tracking/sprint-status.yaml`

### "I want to add transcripts/summaries"
→ See `guides/how-to-add-transcripts.md` or `guides/how-to-add-summaries.md`

### "I want to work on Epic 9"
→ Go to `epic-9/` folder

### "I want to understand the architecture"
→ Read `main/architecture.md`

### "I want to see a specific story"
→ Check `stories/` (Epic 1-7) or `epic-8/` or `epic-9/`

### "I want to know about BMAD method"
→ See `guides/BMAD-IDE-COMPATIBILITY.md`

---

## File Naming Conventions

### Stories
- Format: `{epic}-{story}-{description}.md`
- Example: `9-1-type-sharding.md`

### Epics
- Format: `epic-{number}-{description}.md`
- Example: `epic-9-content-relationships-and-polish.md`

### Guides
- Format: `how-to-{action}.md` or descriptive name
- Example: `how-to-add-transcripts.md`

### Tracking
- Format: `{type}-status.yaml` or `{name}.md`
- Example: `sprint-status.yaml`

---

## Maintenance

### Adding New Documentation
1. Determine the appropriate folder
2. Follow naming conventions
3. Update this README if needed
4. Link from relevant documents

### Archiving Documents
1. Move to `archive/{category}/`
2. Update `archive/README.md`
3. Update references in active docs

### Updating Tracking
1. Edit files in `tracking/`
2. Keep sprint-status.yaml current
3. Update epic status as needed

---

## Document Status

### ✅ Complete
- Epic 1-8 documentation
- Core project documents
- All guides

### 🚧 In Progress
- Epic 9 implementation
- Stories being developed

### 📋 Planned
- Future epic documentation
- Additional guides as needed

---

## Related Documentation

### In Codebase
- `.cursor/rules/bmad/` - BMAD method rules
- `app/types/` - Type definitions
- `scripts/` - Utility scripts

### External
- [Nuxt Documentation](https://nuxt.com)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [YouTube Data API](https://developers.google.com/youtube/v3)

---

**For questions or clarifications, refer to the appropriate folder's documentation or create a new issue.**

