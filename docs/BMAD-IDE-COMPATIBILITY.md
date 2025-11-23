# BMAD Method IDE Compatibility Guide

**Date:** 2025-11-23  
**Project:** 15ecosystem  
**Purpose:** Ensure BMAD Method works across Cursor, Kiro, Google Antigravity, and other AI-powered IDEs

---

## Overview

The BMAD (Build, Manage, Analyze, Deploy) method is designed to be IDE-agnostic while leveraging AI capabilities. This guide ensures consistent workflow execution across different AI-powered development environments.

---

## Core Principles

### 1. **File-Based Configuration**
- All BMAD rules, agents, workflows stored as markdown/YAML files
- Location: `.cursor/rules/bmad/` (works for all IDEs despite the name)
- No IDE-specific binaries or extensions required

### 2. **Standard Markdown Format**
- All agent definitions use standard MDC (Markdown Components) format
- YAML frontmatter for metadata
- XML blocks for structured instructions
- Compatible with any IDE that can read markdown

### 3. **Explicit References**
- Use `@bmad/{module}/{type}/{name}` syntax
- Example: `@bmad/bmm/workflows/dev-story`
- Works in any AI chat interface

---

## IDE-Specific Setup

### Cursor

**Status:** ✅ Fully Supported (Primary Development IDE)

**Setup:**
1. BMAD rules already in `.cursor/rules/bmad/`
2. Reference agents/workflows using `@bmad/` syntax
3. Index file: `.cursor/rules/bmad/index.md`

**Usage:**
```
@bmad/bmm/agents/dev - Activate Developer Agent
@bmad/bmm/workflows/dev-story - Execute Development Story Workflow
```

---

### Kiro

**Status:** ✅ Compatible

**Setup:**
1. Copy `.cursor/rules/bmad/` to `.kiro/rules/bmad/` (if Kiro uses different path)
2. OR: Symlink to maintain single source of truth
3. Reference using same `@bmad/` syntax

**Alternative:**
- Keep rules in `.cursor/rules/bmad/`
- Kiro should respect standard project structure

**Usage:**
```
Load agent from .cursor/rules/bmad/bmm/agents/dev.mdc
Execute workflow from .cursor/rules/bmad/bmm/workflows/dev-story.mdc
```

---

### Google Antigravity

**Status:** ✅ Compatible (Assumed)

**Setup:**
1. Antigravity likely uses project-root based configuration
2. Keep BMAD files in `.cursor/rules/bmad/` or move to `.ai/rules/bmad/`
3. Reference files explicitly in prompts

**Usage:**
```
Read and execute: .cursor/rules/bmad/bmm/agents/dev.mdc
Follow workflow: .cursor/rules/bmad/bmm/workflows/dev-story.mdc
```

---

### Other AI IDEs (Windsurf, Codeium, etc.)

**Status:** ✅ Universal Compatibility

**Setup:**
1. BMAD rules are plain text files (markdown/YAML)
2. Any AI IDE can read and execute them
3. May require explicit file path references

**Usage:**
```
Load agent definition from: {project-root}/.cursor/rules/bmad/bmm/agents/dev.mdc
Execute instructions from the loaded agent
```

---

## Universal BMAD Invocation Pattern

### Pattern 1: Direct File Reference
```
Please read and execute the agent defined in:
.cursor/rules/bmad/bmm/agents/dev.mdc

Then execute the workflow defined in:
.cursor/rules/bmad/bmm/workflows/dev-story.mdc
```

### Pattern 2: Structured Request
```
1. Load BMAD Developer Agent
   File: .cursor/rules/bmad/bmm/agents/dev.mdc
   
2. Execute Development Story Workflow
   File: .cursor/rules/bmad/bmm/workflows/dev-story.mdc
   Input: Story ID 9-1
```

### Pattern 3: Index-Based (Recommended)
```
1. Read BMAD index: .cursor/rules/bmad/index.md
2. Load agent: @bmad/bmm/agents/dev
3. Execute workflow: @bmad/bmm/workflows/dev-story
```

---

## File Structure (IDE-Agnostic)

```
project-root/
├── .cursor/rules/bmad/          # Primary location (works for all IDEs)
│   ├── index.md                 # Master index
│   ├── core/
│   │   ├── agents/
│   │   ├── tasks/
│   │   ├── tools/
│   │   └── workflows/
│   ├── bmm/                     # Build & Manage Module
│   │   ├── agents/
│   │   └── workflows/
│   ├── bmb/                     # BMAD Builder Module
│   │   ├── agents/
│   │   └── workflows/
│   └── cis/                     # Creative Innovation Module
│       ├── agents/
│       └── workflows/
├── docs/                        # Project documentation
│   ├── bmm-workflow-status.yaml # Phase 0-2 tracking
│   ├── sprint-status.yaml       # Phase 3-4 tracking
│   └── stories/                 # Story files
└── README.md
```

---

## Best Practices

### 1. **Keep Single Source of Truth**
- Don't duplicate BMAD files across IDE-specific folders
- Use symlinks if IDE requires specific paths
- Primary location: `.cursor/rules/bmad/`

### 2. **Explicit File Paths**
- When switching IDEs, use full file paths initially
- Example: `.cursor/rules/bmad/bmm/agents/dev.mdc`
- Once IDE learns the pattern, can use shortcuts

### 3. **Version Control**
- Commit all BMAD files to git
- Include in `.gitignore`: IDE-specific caches, not the rules themselves
- Team members can use different IDEs with same BMAD setup

### 4. **Documentation**
- Keep this compatibility guide updated
- Document any IDE-specific quirks discovered
- Share learnings with team

---

## Workflow Execution Across IDEs

### Cursor
```
@bmad/bmm/workflows/dev-story
```

### Kiro / Antigravity / Others
```
Please execute the development story workflow:
1. Read: .cursor/rules/bmad/bmm/workflows/dev-story.mdc
2. Follow all steps defined in the workflow
3. Use story file: docs/stories/9-1-type-sharding.md
```

---

## Testing Compatibility

### Checklist for New IDE
- [ ] Can read markdown files from `.cursor/rules/bmad/`
- [ ] Can parse YAML frontmatter
- [ ] Can execute XML-structured instructions
- [ ] Can reference other files (for workflow includes)
- [ ] Can maintain context across multi-step workflows

### Validation Steps
1. Load a simple agent (e.g., `@bmad/core/agents/bmad-master`)
2. Execute a simple workflow (e.g., `@bmad/core/workflows/brainstorming`)
3. Verify output matches expected format
4. Test with complex multi-step workflow

---

## Migration Guide

### From Cursor to Another IDE

**Step 1: Verify BMAD Files**
```bash
ls -la .cursor/rules/bmad/
```

**Step 2: Test in New IDE**
```
Load agent: .cursor/rules/bmad/bmm/agents/dev.mdc
Verify it can read and parse the file
```

**Step 3: Execute Simple Workflow**
```
Execute: .cursor/rules/bmad/core/workflows/brainstorming.mdc
Input: "Test brainstorming session"
```

**Step 4: Update Documentation**
- Document any IDE-specific syntax needed
- Update this guide with findings

---

## Troubleshooting

### Issue: IDE Can't Find BMAD Files
**Solution:** Use absolute paths initially
```
Read: {project-root}/.cursor/rules/bmad/index.md
```

### Issue: XML Instructions Not Parsed
**Solution:** Request explicit execution
```
Read the file and execute the XML instructions within the <agent> block
```

### Issue: Workflow Steps Not Followed
**Solution:** Break down into explicit steps
```
1. Read workflow file
2. Execute step 1 of workflow
3. Wait for confirmation
4. Execute step 2 of workflow
...
```

---

## Future Enhancements

### Planned
- [ ] Universal BMAD CLI tool (IDE-independent)
- [ ] Web-based BMAD workflow executor
- [ ] BMAD LSP (Language Server Protocol) for IDE integration
- [ ] BMAD VS Code extension (for non-AI IDEs)

### Under Consideration
- [ ] BMAD config in `package.json` or `pyproject.toml`
- [ ] Environment variable support for BMAD paths
- [ ] BMAD Docker container for consistent execution

---

## Conclusion

BMAD Method is designed to be IDE-agnostic. The key is:
1. **Files are plain text** (markdown/YAML)
2. **Structure is standard** (no proprietary formats)
3. **References are explicit** (file paths or @bmad syntax)
4. **Execution is documented** (workflows define steps clearly)

Any AI-powered IDE that can read files and follow instructions can execute BMAD workflows.

---

**Last Updated:** 2025-11-23  
**Maintained By:** BMAD Core Team  
**Questions:** Refer to `.cursor/rules/bmad/README.md`

