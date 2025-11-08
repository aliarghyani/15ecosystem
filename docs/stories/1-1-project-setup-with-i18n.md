# Story 1.1: Project Setup with i18n

Status: in-progress

## Story

As a developer,
I want a Nuxt 4 project configured for static site generation with bilingual support,
So that I can build a fast, content-driven website in Persian and English.

## Acceptance Criteria

1. **Given** a new project repository
   **When** I initialize the project
   **Then** I have:
   - Nuxt 4 project with SSG mode enabled
   - TypeScript configuration with strict mode
   - Tailwind CSS 4 setup with custom utilities and variants
   - Nuxt UI 4 integration with theme tokens in `app.config.ts`
   - @nuxtjs/i18n module configured with `prefix_except_default` strategy
   - Persian (fa) and English (en) locales set up with RTL/LTR support
   - Basic project structure matching portfolio (`app/`, `public/`, `i18n/locales/`)
   - Git repository initialized with appropriate `.gitignore`

2. **Given** the project is initialized
   **When** I run `pnpm build`
   **Then** the project builds successfully without errors
   **And** generates static files in `.output/public/`

3. **Given** the project is built
   **When** I test language switching
   **Then** the language switcher works correctly
   **And** Persian content displays with RTL layout
   **And** English content displays with LTR layout
   **And** routes respect the `prefix_except_default` strategy (English default, Persian `/fa` prefix)

4. **Given** the project is set up
   **When** I check code quality tools
   **Then** ESLint and Prettier are configured
   **And** TypeScript strict mode is enabled
   **And** accessibility linting tools are set up

## Tasks / Subtasks

- [ ] Task 1: Initialize Nuxt 4 project (AC: #1)
  - [ ] Run `npx nuxi@latest init 15ecosystem` in project root
  - [ ] Verify `app/` directory structure is created
  - [ ] Verify `nuxt.config.ts` exists
  - [ ] Verify `package.json` exists with Nuxt 4 dependency

- [ ] Task 2: Install and configure dependencies (AC: #1)
  - [ ] Install core dependencies: `pnpm install nuxt@latest @nuxt/ui@latest @nuxtjs/i18n@latest @nuxt/image@latest @nuxtjs/color-mode@latest tailwindcss@latest typescript@latest`
  - [ ] Install dev dependencies: ESLint, Prettier, and related plugins
  - [ ] Verify all packages are installed correctly

- [ ] Task 3: Configure TypeScript (AC: #1, #4)
  - [ ] Create/update `tsconfig.json` with strict mode enabled
  - [ ] Verify TypeScript configuration matches portfolio setup
  - [ ] Test TypeScript compilation with `pnpm build`

- [ ] Task 4: Configure Tailwind CSS 4 (AC: #1)
  - [ ] Create/update `tailwind.config.ts` with custom utilities and variants
  - [ ] Configure Tailwind to match portfolio setup
  - [ ] Set up global CSS imports in `app/assets/css/`
  - [ ] Verify Tailwind classes work in components

- [ ] Task 5: Configure Nuxt UI 4 (AC: #1)
  - [ ] Create/update `app.config.ts` with theme tokens
  - [ ] Configure Nuxt UI to match portfolio theme
  - [ ] Verify Nuxt UI components are available

- [ ] Task 6: Configure @nuxtjs/i18n (AC: #1, #3)
  - [ ] Configure `@nuxtjs/i18n` module in `nuxt.config.ts` with `prefix_except_default` strategy
  - [ ] Set up Persian (fa) locale with RTL support
  - [ ] Set up English (en) locale with LTR support
  - [ ] Create locale files: `i18n/locales/en.json` and `i18n/locales/fa.json`
  - [ ] Add basic translation keys for testing
  - [ ] Verify language switching works correctly

- [ ] Task 7: Set up project structure (AC: #1)
  - [ ] Create `app/components/` directory structure (common/, skills/, categories/, content/, diagrams/)
  - [ ] Create `app/composables/` directory
  - [ ] Create `app/utils/` directory
  - [ ] Create `app/types/` directory
  - [ ] Create `app/data/` directory (for future content files)
  - [ ] Create `public/` directory for static assets
  - [ ] Verify structure matches portfolio architecture

- [ ] Task 8: Configure fonts (AC: #1)
  - [ ] Set up Vazirmatn font for Persian (RTL)
  - [ ] Set up Roobert or system fonts for English (LTR)
  - [ ] Configure font loading in `nuxt.config.ts` or `app.vue`
  - [ ] Verify fonts load correctly in both languages

- [ ] Task 9: Configure @nuxt/image (AC: #1)
  - [ ] Set up `@nuxt/image` module in `nuxt.config.ts`
  - [ ] Configure image optimization settings
  - [ ] Verify image component is available

- [ ] Task 10: Configure Vercel deployment (AC: #1)
  - [ ] Create `vercel.json` configuration file
  - [ ] Configure build settings for SSG
  - [ ] Verify deployment configuration matches portfolio

- [ ] Task 11: Set up code quality tools (AC: #4)
  - [ ] Configure ESLint with appropriate rules
  - [ ] Configure Prettier with formatting rules
  - [ ] Set up accessibility linting tools
  - [ ] Verify linting works with `pnpm lint`

- [ ] Task 12: Initialize Git repository (AC: #1)
  - [ ] Initialize Git repository if not already initialized
  - [ ] Create `.gitignore` file with appropriate patterns (node_modules/, .output/, .nuxt/, etc.)
  - [ ] Verify `.gitignore` matches portfolio patterns

- [ ] Task 13: Test build process (AC: #2)
  - [ ] Run `pnpm build` and verify successful build
  - [ ] Verify static files are generated in `.output/public/`
  - [ ] Check for any build warnings or errors
  - [ ] Verify build output matches SSG expectations

- [ ] Task 14: Test language switching (AC: #3)
  - [ ] Test language switcher component (if created) or manual route testing
  - [ ] Verify Persian routes use `/fa` prefix
  - [ ] Verify English routes are default (no prefix)
  - [ ] Verify RTL layout works for Persian
  - [ ] Verify LTR layout works for English
  - [ ] Test switching between languages

- [ ] Task 15: Documentation and verification (AC: #1, #2, #3, #4)
  - [ ] Document setup process in README.md
  - [ ] Verify all acceptance criteria are met
  - [ ] Test all configurations work together
  - [ ] Verify project structure matches portfolio reference

## Dev Notes

### Architecture Patterns and Constraints

**Reference Architecture:** https://github.com/aliarghyani/nuxt-portfolio

**Key Architectural Decisions:**
- **SSG Mode:** Static site generation for optimal performance and hosting simplicity [Source: docs/architecture.md#Project-Initialization]
- **i18n Strategy:** `prefix_except_default` - English default, Persian `/fa` prefix [Source: docs/architecture.md#Decision-Summary]
- **Project Structure:** `app/` directory pattern matching portfolio [Source: docs/architecture.md#Project-Structure]
- **Component Organization:** Feature-based subdirectories (common/, skills/, categories/, content/, diagrams/) [Source: docs/architecture.md#Project-Structure]
- **TypeScript:** Strict mode for type safety [Source: docs/PRD.md#Technology-Stack]
- **Build Tool:** Vite (via Nuxt) [Source: docs/architecture.md#Decision-Summary]
- **Package Manager:** pnpm [Source: docs/architecture.md#Decision-Summary]

**Technical Constraints:**
- Must match portfolio structure for consistency and maintainability [Source: docs/architecture.md#Project-Initialization]
- RTL/LTR support is critical for bilingual experience [Source: docs/PRD.md#Internationalization]
- SSG mode required for Vercel static hosting [Source: docs/PRD.md#Deployment]
- TypeScript strict mode required for code quality [Source: docs/PRD.md#Technology-Stack]

### Project Structure Notes

**Alignment with Portfolio Structure:**
- `app/` directory: Main source directory (Nuxt 4 pattern)
- `app/components/`: Feature-based subdirectories matching portfolio
- `app/composables/`: Reusable composables (auto-imported)
- `app/utils/`: Helper functions (auto-imported)
- `app/types/`: TypeScript definitions
- `app/data/`: Content data files (separate EN/FA files)
- `i18n/locales/`: Locale JSON files (en.json, fa.json)
- `public/`: Static assets (images, fonts, favicons)

**No Conflicts Detected:** Structure aligns with portfolio reference architecture.

### Testing Standards

**Build Testing:**
- Verify `pnpm build` completes without errors
- Verify static files are generated correctly
- Verify no TypeScript errors
- Verify no ESLint errors (if configured to block build)

**Language Testing:**
- Test language switching functionality
- Verify RTL layout for Persian
- Verify LTR layout for English
- Verify route prefixes work correctly (`/fa` for Persian, default for English)

**Code Quality Testing:**
- Run ESLint and fix any errors
- Run Prettier and verify formatting
- Verify TypeScript strict mode catches type errors
- Test accessibility linting (if configured)

### References

- [Source: docs/epics.md#Story-1.1-Project-Setup-with-i18n] - Story acceptance criteria and technical notes
- [Source: docs/PRD.md#Technology-Stack] - Technology stack requirements and constraints
- [Source: docs/PRD.md#Internationalization] - i18n requirements and RTL/LTR support
- [Source: docs/architecture.md#Project-Initialization] - Project initialization approach and setup commands
- [Source: docs/architecture.md#Decision-Summary] - Architectural decisions and rationale
- [Source: docs/architecture.md#Project-Structure] - Detailed project structure and component organization
- [Source: docs/architecture.md#Consistency-Patterns] - Naming conventions and code organization patterns

### Learnings from Previous Story

**First story in epic - no predecessor context**

## Dev Agent Record

### Context Reference

- docs/stories/1-1-project-setup-with-i18n.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

