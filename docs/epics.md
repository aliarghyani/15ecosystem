# 15ecosystem - Epic Breakdown (Simplified MVP)

**Author:** ali
**Date:** November 6, 2025
**Project Level:** 1 (Simplified Content Showcase)
**Target Scale:** Static content site, no user management

---

## Overview

This document provides the epic and story breakdown for 15ecosystem MVP, focusing on organizing and presenting content from a single YouTube video about "15 Essential Skills for 2025."

**Epic Structure:**
1. **Foundation & Setup** - Nuxt project initialization with i18n
2. **Content Extraction** - Parse YAML files and organize content (bilingual)
3. **Page Structure** - Create landing, category, and skill pages (bilingual)
4. **Content Pages** - Transcript, summary, and books pages (bilingual)
5. **Visual Diagrams** - Simple visualizations of structure and relationships
6. **Navigation & Polish** - Navigation system with language switcher and final touches

**MVP Scope:** Component-based, expandable platform (not just a showcase). Built with modern design standards and best practices. Fully bilingual (Persian/English) with complete RTL-LTR support. Structure allows easy expansion for future features.

**Architecture Philosophy:** Fully component-based, production-ready code following development and UI/UX best practices. Designed for expansion, not just MVP.

**Vision:** Help people improve quality of life, get closer to dreams, achieve useful longevity, and understand the value of time. Target progression: Family → Close Friends → LinkedIn Community → Everyone.

**Design Philosophy:** Modern, compact design (not traditional). Fully compliant with development standards and UI/UX best practices.

---

## Epic 1: Foundation & Setup

**Goal:** Initialize Nuxt 4 project matching portfolio structure with TypeScript, Tailwind CSS 4, Nuxt UI 4, and i18n. Set up component-based architecture for expandable platform. Configure modern design system and best practices.

### Story 1.1: Project Setup with i18n

As a developer,
I want a Nuxt 4 project configured for static site generation with bilingual support,
So that I can build a fast, content-driven website in Persian and English.

**Acceptance Criteria:**

**Given** a new project repository
**When** I initialize the project
**Then** I have:
- Nuxt 4 project with SSG mode enabled
- TypeScript configuration
- Tailwind CSS 4 setup
- Nuxt UI 4 integration
- @nuxtjs/i18n module configured
- Persian (fa) and English (en) locales set up
- RTL/LTR support configured
- Basic project structure (app/, public/, content/, locales/)
- Git repository with .gitignore

**And** the project builds successfully with `pnpm build`
**And** generates static files in `.output/public/`
**And** language switching works correctly

**Prerequisites:** None

**Technical Notes:**
- Use Nuxt 4 with SSG mode (matching portfolio setup)
- Configure TypeScript strict mode
- Set up Tailwind CSS 4 with custom utilities and variants
- Initialize Nuxt UI 4 with theme tokens in `app.config.ts`
- Configure @nuxtjs/i18n with `prefix_except_default` strategy
- Persian (fa) - RTL, English (en) - LTR
- Set up locale files: `i18n/locales/en.json`, `i18n/locales/fa.json`
- Project structure: `app/` directory (components/, composables/, utils/, types/, data/)
- Configure fonts: Vazirmatn (Persian), Roobert or system (English)
- Set up @nuxt/image for optimized images
- Configure Vercel deployment
- Add ESLint, Prettier for code quality
- Set up accessibility tools and linting

### Story 1.2: Component-Based Project Structure

As a developer,
I want a component-based project structure matching portfolio architecture,
So that the platform is expandable and maintainable.

**Acceptance Criteria:**

**Given** project is initialized
**When** I set up the structure
**Then** I have:
- `app/components/` with organized subdirectories:
  - `common/` - Shared UI (Navigation, Footer, LanguageSwitcher)
  - `skills/` - Skill components (SkillCard, SkillDetail, SkillList)
  - `categories/` - Category components (CategoryCard, CategoryGrid)
  - `content/` - Content display (TranscriptViewer, SummaryViewer, BooksList)
  - `diagrams/` - Visual components (CategoryDiagram, SkillRelations)
- `app/composables/` - Reusable composables (useSkills, useCategories, useI18n)
- `app/utils/` - Helper functions
- `app/types/` - TypeScript definitions
- `app/data/` - Content data (separate EN/FA files like portfolio)
- `i18n/locales/` - Translation files
- Component-based architecture ready for expansion

**Prerequisites:** Story 1.1

**Technical Notes:**
- Match portfolio structure: https://github.com/aliarghyani/nuxt-portfolio
- Use auto-imports for components, composables, utils
- Organize components by feature/domain
- Plan for easy expansion (new components, new features)
- Follow portfolio's component organization patterns

---

## Epic 2: Content Extraction & Organization

**Goal:** Extract and organize content from YAML source files into structured data for the 15 skills, categories, books, and video content.

### Story 2.1: Parse YAML Source Files (Bilingual)

As a developer,
I want to parse the video transcript and summary YAML files,
So that I can extract structured bilingual content for the platform.

**Acceptance Criteria:**

**Given** source YAML files exist (`youtubevideofulltext.yml`, `summaryofyoutubevideofulltext.yml`)
**When** I parse them
**Then** I can extract:
- Full video transcript text (Persian)
- Video summary sections (Persian)
- All 15 skills with their content (Persian)
- Book references for each skill
- Category groupings (Health 1-6, Identity/Career 7-15)
- English translations prepared for all content

**And** content is structured in a usable format (JSON/TypeScript types)
**And** both Persian and English versions are available

**Prerequisites:** Story 1.2

**Technical Notes:**
- Use YAML parser (js-yaml or similar)
- Create TypeScript types for content structure
- Handle Persian/English text properly (UTF-8 encoding)
- Extract skill content systematically
- Prepare structure for bilingual content storage
- Note: English translations may need to be added/created

### Story 2.2: Organize Skills Content (3 Categories)

As a developer,
I want each skill's content organized into a structured format with 3 categories,
So that I can easily display it on skill pages using components.

**Acceptance Criteria:**

**Given** parsed video content
**When** I organize skills
**Then** each skill has:
- Skill number (1-15)
- Skill name (Persian and English)
- Category (Health, Identity, or Career)
- "Why it matters" content (bilingual)
- "How to" content (bilingual)
- Book references (array)
- Related skills (connections)

**And** all 15 skills are properly structured:
- Health category: Skills 1-6
- Identity category: Skills 7-12
- Career category: Skills 13-15

**And** content is structured for component consumption
**And** TypeScript types are defined for skill data

**Prerequisites:** Story 2.1

**Technical Notes:**
- Create skill data structure with TypeScript types
- Extract content from transcript/summary
- Map books to skills
- Identify skill relationships
- Organize by 3 categories (not 2)
- Structure data for component-based display
- Separate content files for EN/FA in `app/data/`

### Story 2.3: Extract Book References

As a developer,
I want all book references extracted and organized,
So that I can display them on the books page.

**Acceptance Criteria:**

**Given** parsed video content
**When** I extract book references
**Then** I have:
- List of all books mentioned
- Book title and author
- Which skill(s) each book relates to
- Book organized by category

**And** books are deduplicated
**And** ready for books page display

**Prerequisites:** Story 2.1

**Technical Notes:**
- Extract books from both transcript and summary
- Create book data structure
- Link books to skills
- Handle book name variations

---

## Epic 3: Page Structure

**Goal:** Create the core page structure: landing page, category pages, and individual skill pages.

### Story 3.1: Landing Page (Bilingual)

As a user,
I want a welcoming landing page in my preferred language,
So that I understand what 15ecosystem is about.

**Acceptance Criteria:**

**Given** I visit the homepage
**When** I view the landing page
**Then** I see:
- Introduction to 15ecosystem (in selected language)
- Overview of the 15 skills concept
- Visual representation of the two main categories
- Navigation to categories and skills
- Language switcher (Persian/English)
- Clean, modern design
- Proper RTL layout for Persian, LTR for English

**Given** I switch language
**When** I change language
**Then** all content updates to selected language
**And** layout direction changes (RTL/LTR)

**Prerequisites:** Story 1.1

**Technical Notes:**
- Create `app/pages/index.vue`
- Use Nuxt UI components
- Add simple hero section
- Include category overview
- Integrate i18n for bilingual content
- Add language switcher component
- Ensure RTL/LTR switching works correctly

### Story 3.2: Category Pages (3 Categories)

As a user,
I want to see skills organized by three main categories,
So that I can browse skills by theme.

**Acceptance Criteria:**

**Given** I navigate to a category
**When** I view the category page
**Then** I see:
- Category name and description (bilingual)
- List of skills in that category:
  - Health: 6 skills (1-6)
  - Identity: 6 skills (7-12)
  - Career: 3 skills (13-15)
- Each skill shows: number, name, brief description
- Modern skill cards using SkillCard component
- Clickable links to individual skill pages
- Visual diagram showing category structure
- Modern, compact design

**Given** I am on mobile
**When** I view category pages
**Then** layout is responsive and readable
**And** modern mobile design patterns are used

**Prerequisites:** Story 2.2, Story 3.1

**Technical Notes:**
- Create `app/pages/categories/[slug].vue`
- Use dynamic routes for 3 categories (health, identity, career)
- Use CategoryGrid and SkillCard components
- Display skills from organized content
- Add modern category diagrams
- Follow portfolio's component patterns
- Ensure modern, compact design

### Story 3.3: Skill Pages (15 pages) - Component-Based

As a user,
I want to view detailed information about each skill,
So that I can learn about that specific skill.

**Acceptance Criteria:**

**Given** I navigate to a skill page
**When** I view the skill
**Then** I see:
- Skill number and name prominently displayed (bilingual)
- "Why it matters" section with content from video (bilingual)
- "How to" section with practical guidance (bilingual)
- Book references listed using BookCard component
- Navigation: Previous/Next skill, Back to category
- Breadcrumb navigation
- Modern, compact design following UI/UX best practices

**Given** I view any skill page
**When** I scroll through content
**Then** content is well-formatted and readable
**And** mobile-responsive
**And** uses component-based layout (expandable)

**Prerequisites:** Story 2.2, Story 3.2

**Technical Notes:**
- Create `app/pages/skills/[slug].vue`
- Use dynamic routes for skills
- Use SkillDetail component for main content
- Use BookCard components for book references
- Use SkillNavigation component for prev/next
- Display content from organized skill data
- Format content with proper typography
- Follow portfolio's component patterns
- Ensure modern, compact design
- Make components reusable and expandable

---

## Epic 4: Content Pages

**Goal:** Create pages for full transcript, summary, and books reference.

### Story 4.1: Transcript Page

As a user,
I want to read the full video transcript,
So that I can reference the complete content.

**Acceptance Criteria:**

**Given** I navigate to transcript page
**When** I view the page
**Then** I see:
- Full video transcript from source file
- Well-formatted text with proper line breaks
- Table of contents linking to skill sections
- Easy-to-read typography
- Mobile-responsive layout

**Prerequisites:** Story 2.1, Story 3.1

**Technical Notes:**
- Create `app/pages/transcript.vue`
- Display full transcript text
- Add table of contents with anchor links
- Format for readability

### Story 4.2: Summary Page

As a user,
I want to read the video summary,
So that I can quickly understand the key points.

**Acceptance Criteria:**

**Given** I navigate to summary page
**When** I view the page
**Then** I see:
- Complete video summary from source file
- Well-organized sections matching summary structure
- Links to relevant skills where mentioned
- Clear section headings
- Readable formatting

**Prerequisites:** Story 2.1, Story 3.1

**Technical Notes:**
- Create `app/pages/summary.vue`
- Display summary content
- Add internal links to skills
- Format sections clearly

### Story 4.3: Books Page

As a user,
I want to see all books mentioned in the video,
So that I can find resources to learn more.

**Acceptance Criteria:**

**Given** I navigate to books page
**When** I view the page
**Then** I see:
- List of all books organized by category or skill
- Each book shows: title, author
- Which skill(s) each book relates to
- Books grouped logically
- Links back to related skills

**Prerequisites:** Story 2.3, Story 3.1

**Technical Notes:**
- Create `app/pages/books.vue`
- Display book references
- Organize by category or skill
- Add links to skill pages

---

## Epic 5: Visual Diagrams

**Goal:** Create simple visual diagrams showing category structure and skill relationships.

### Story 5.1: Category Structure Diagram (3 Categories) - Modern Design

As a user,
I want to see a modern visual diagram of the three-category structure,
So that I can understand how skills are organized.

**Acceptance Criteria:**

**Given** I view the landing page or category pages
**When** I see the diagram
**Then** I see:
- Three main categories (Health, Identity, Career) clearly shown
- 15 skills organized under their categories
- Visual distinction between categories with modern design
- Clickable skills (links to skill pages)
- Modern, compact design following UI/UX best practices
- Component-based diagram (CategoryDiagram component)
- Responsive design (mobile, tablet, desktop)

**Prerequisites:** Story 3.1, Story 3.2

**Technical Notes:**
- Create CategoryDiagram component (reusable, expandable)
- Use modern visualization (SVG or CSS with animations)
- Make skills clickable with proper hover states
- Ensure mobile-responsive with touch-friendly interactions
- Use Nuxt UI styling and Tailwind utilities
- Follow modern design trends (not traditional)
- Make component expandable for future features

### Story 5.2: Skill Relationship Diagram

As a user,
I want to see how skills connect to each other,
So that I understand the "ecosystem" concept.

**Acceptance Criteria:**

**Given** I view the landing page or a skill page
**When** I see the relationship diagram
**Then** I see:
- Visual representation of skill connections
- Progression flow: Health → Focus → Learning → Creativity → Brand/Income
- Simple arrows or lines showing relationships
- Clear, understandable visualization

**Prerequisites:** Story 3.1

**Technical Notes:**
- Create relationship diagram component
- Show the progression concept
- Use simple visual elements
- Mobile-responsive design

---

## Epic 6: Navigation & Polish

**Goal:** Implement site-wide navigation and final polish for MVP launch.

### Story 6.1: Main Navigation Menu (Bilingual)

As a user,
I want a clear navigation menu in my language,
So that I can easily move between sections.

**Acceptance Criteria:**

**Given** I am on any page
**When** I see the navigation
**Then** I see:
- Main menu: Home, Categories, Skills, Transcript, Summary, Books (in selected language)
- Language switcher (Persian/English) prominently displayed
- Active page highlighted
- Mobile hamburger menu
- Smooth navigation transitions
- Proper RTL/LTR layout based on language

**Given** I switch language
**When** I change language in navigation
**Then** menu items update to selected language
**And** page content updates
**And** layout direction changes

**Given** I am on mobile
**When** I use navigation
**Then** menu is touch-friendly
**And** hamburger menu works smoothly
**And** language switcher accessible

**Prerequisites:** Story 3.1, Story 4.1

**Technical Notes:**
- Create navigation component
- Use Nuxt UI navigation components
- Add mobile menu toggle
- Highlight active route
- Integrate i18n for menu labels
- Add language switcher component
- Ensure RTL/LTR works in navigation

### Story 6.2: Breadcrumb Navigation

As a user,
I want breadcrumb navigation,
So that I always know where I am and can navigate back.

**Acceptance Criteria:**

**Given** I am on a skill or category page
**When** I see breadcrumbs
**Then** I see:
- Breadcrumb trail: Home > Category > Skill
- Clickable breadcrumb links
- Clear visual separator
- Not shown on landing page

**Prerequisites:** Story 3.2, Story 3.3

**Technical Notes:**
- Create breadcrumb component
- Use route metadata for breadcrumbs
- Add to skill and category pages
- Style with Nuxt UI

### Story 6.3: Skill Navigation (Previous/Next)

As a user,
I want to navigate between skills easily,
So that I can read through skills sequentially.

**Acceptance Criteria:**

**Given** I am on a skill page
**When** I see navigation
**Then** I see:
- "Previous Skill" button (if not first)
- "Next Skill" button (if not last)
- "All Skills" link
- "Back to Category" link

**Prerequisites:** Story 3.3

**Technical Notes:**
- Add navigation buttons to skill pages
- Calculate previous/next from skill number
- Style with Nuxt UI buttons

### Story 6.4: Mobile Responsiveness & Modern Design Polish

As a user,
I want the site to work perfectly on all devices with modern design,
So that I have an excellent experience everywhere.

**Acceptance Criteria:**

**Given** I view the site on mobile/tablet/desktop
**When** I navigate and read content
**Then**:
- All pages are readable with modern, compact design
- Navigation works smoothly with modern patterns
- Text is appropriately sized and readable
- Images/diagrams scale properly
- Touch interactions work well (44x44px minimum targets)
- Modern UI patterns (not traditional)
- Smooth animations and transitions
- Accessibility standards met (WCAG AA)
- Performance optimized (Lighthouse score 90+)

**Prerequisites:** All previous stories

**Technical Notes:**
- Test on mobile devices (iOS Safari, Chrome Mobile)
- Adjust typography for mobile with modern fonts
- Ensure touch targets meet accessibility standards
- Optimize images with @nuxt/image
- Test navigation on mobile with modern patterns
- Follow modern design trends (glassmorphism, subtle shadows, clean layouts)
- Ensure compact design (not bloated)
- Add smooth animations with Vue transitions
- Test accessibility with screen readers
- Optimize performance (lazy loading, code splitting)

### Story 6.5: Performance Optimization & Code Quality

As a user,
I want fast page loads and high-quality code,
So that I have an excellent experience and the platform is maintainable.

**Acceptance Criteria:**

**Given** I visit any page
**When** page loads
**Then**:
- Initial load <2 seconds (target: <1.5s)
- Navigation transitions <500ms (target: <300ms)
- Images optimized and lazy-loaded
- Static assets cached properly
- Lighthouse performance score 90+
- Lighthouse accessibility score 90+
- Lighthouse best practices score 90+
- SEO score 90+

**Given** developers work on the codebase
**When** they review code
**Then**:
- TypeScript strict mode with no errors
- ESLint passes with no errors
- Prettier formatting consistent
- Components are well-documented
- Code follows best practices
- Structure is expandable and maintainable

**Prerequisites:** All previous stories

**Technical Notes:**
- Optimize images with @nuxt/image
- Enable static generation (SSG)
- Configure caching headers
- Test performance with Lighthouse
- Deploy to Vercel with optimizations
- Set up ESLint and Prettier (matching portfolio)
- Add TypeScript strict checks
- Document components
- Follow portfolio's code quality standards
- Ensure expandable architecture

---

## Implementation Notes

### MVP Scope Summary

**Included:**
- ✅ Single video content organization
- ✅ 15 skills with content from video
- ✅ Two main categories
- ✅ Book references
- ✅ Full transcript and summary pages
- ✅ Simple visual diagrams
- ✅ Basic navigation

**Excluded (Future Phases):**
- ❌ Multiple videos
- ❌ Database
- ❌ User accounts
- ❌ Search functionality
- ❌ Community features
- ❌ Progress tracking
- ❌ "Connecting the Dots" feature
- ❌ Interactive exercises

### Story Dependencies

**Critical Path:**
1. Story 1.1 → 1.2 (Foundation)
2. Story 2.1 → 2.2 → 2.3 (Content)
3. Story 3.1 → 3.2 → 3.3 (Pages)
4. Story 4.1 → 4.2 → 4.3 (Content Pages)
5. Story 5.1 → 5.2 (Diagrams)
6. Story 6.1 → 6.2 → 6.3 → 6.4 → 6.5 (Navigation & Polish)

**Parallel Work:**
- Epic 3 and Epic 4 can progress in parallel after Epic 2
- Epic 5 can start after Epic 3.1
- Epic 6 can start after Epic 3 is complete

### Technical Considerations

- **Component-Based Architecture:** Fully component-based, matching portfolio structure
- **Expandable Design:** Components designed for future features (database, search, etc.)
- **Modern Design:** Not traditional - modern, compact, following current UI/UX trends
- **Code Quality:** Production-ready, TypeScript strict, ESLint, Prettier
- **Best Practices:** Development standards and UI/UX best practices throughout
- **No Database (MVP):** All content from YAML files, parsed at build time
- **Static Generation:** Full SSG, no server needed
- **Content Updates:** Update YAML files and rebuild (expandable to CMS later)
- **Deployment:** Vercel static hosting (matching portfolio)
- **Future-Proof:** Component structure allows easy addition of features later
- **Portfolio Reference:** Follow https://github.com/aliarghyani/nuxt-portfolio structure

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._