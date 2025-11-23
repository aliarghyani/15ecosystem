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

### Story 4.5: Writers Page

As a user,
I want to see all writers/authors mentioned in the video,
So that I can explore their work, biographies, and resources.

**Acceptance Criteria:**

**Given** I navigate to writers page
**When** I view the page
**Then** I see:
- List of all writers organized by category
- Each writer shows: name, photo (if available), brief bio excerpt
- Number of books by each writer
- Related skills for each writer
- Links to writer detail pages

**Given** I click on a writer
**When** I navigate to writer detail page
**Then** I see:
- Writer name and photo
- Complete biography with special design
- Related books (using Inspira Book components)
- External links (YouTube, website, social media)
- Related skills
- Tags (if available)
- Clickable mentions in biography (skills, books, categories)

**Prerequisites:** Story 4.3, Story 4.4

**Technical Notes:**
- Create `Writer` type definition
- Extract unique writers from books data
- Create `app/pages/writers/index.vue` (list page)
- Create `app/pages/writers/[slug].vue` (detail page)
- Create `WriterCard` component
- Implement `ClickableContent` component for biography parsing
- Add external links (YouTube, website, social media)

### Story 4.6: Tags System

As a user,
I want to browse content by tags,
So that I can discover related skills, books, writers, and categories.

**Acceptance Criteria:**

**Given** I navigate to tags page
**When** I view the page
**Then** I see:
- List of all available tags
- Tag badges with names and colors
- Count of items for each tag
- Search/filter functionality

**Given** I click on a tag
**When** I navigate to tag detail page
**Then** I see:
- Tag name and description
- All content with this tag (skills, books, writers, categories)
- Content organized by type

**Given** I view a detail page (skill, book, writer, category)
**When** I see tags section
**Then** tags are displayed as badges
**And** tags are clickable
**And** clicking navigates to tag detail page

**Prerequisites:** Story 4.3, Story 4.5

**Technical Notes:**
- Create `Tag` type definition
- Update existing types (Skill, Book, Writer, Category) to include tags
- Create `app/pages/tags/index.vue` (list page)
- Create `app/pages/tags/[slug].vue` (detail page)
- Create `TagBadge` component
- Add tags to all detail pages (skills, books, writers, categories)

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

**Given** I view the landing page
**When** I see the relationship diagram
**Then** I see:
- Visual representation of skill connections organized by category
- Three categories (Health, Identity, Career) with skills displayed
- Skills organized in rows by category
- Foundation scores displayed on skills
- Clickable skills linking to skill pages

**Prerequisites:** Story 3.1

### Story 5.3: Skill Page Relationship Diagrams

As a user viewing a skill page,
I want to see a comprehensive diagram showing which skills are prerequisites (parents) and which skills this skill enables (children),
So that I understand the complete relationship network for this specific skill.

**Acceptance Criteria:**

**Given** I am viewing a skill detail page (e.g., `/skills/1`)
**When** I scroll to the relationship section
**Then** I see:
- A clear Mermaid diagram showing:
  - **Prerequisites Section (Top)**: Skills that are required/enable this skill (parent skills)
  - **Current Skill (Center)**: The skill I'm viewing, highlighted prominently
  - **Enabled Skills Section (Bottom)**: Skills that this skill enables (child skills)
- Interactive zoom/pan controls (arrow keys, mouse wheel, drag)
- Diagram auto-fits to viewport on initial load
- All connections clearly labeled and visually distinct
- Bilingual support (Persian/English)

**Prerequisites:** Story 3.3, Updated skill relationships from investigation

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

## Epic 7: YouTube Videos Integration

**Goal:** Integrate YouTube videos from KhashayarTalks channel into the platform, organized by skills, categories, and playlists. Provide video browsing, detail pages, and integration with existing skill/book/writer pages.

### Story 7.1: Video Data Structure & Types

As a developer,
I want a well-defined data structure for videos and playlists,
So that I can store and retrieve video information consistently.

**Acceptance Criteria:**

**Given** I need to store video information
**When** I define the data structure
**Then** I have:
- Video type with all required fields (id, title, description, thumbnail, duration, etc.)
- Playlist type with video relationships
- Skill and category relationships
- Bilingual support (fa/en)
- TypeScript types defined
- Utility functions for video operations

**Prerequisites:** None

**Technical Notes:**
- Define Video and Playlist interfaces in `app/types/index.ts`
- Create utility functions in `app/utils/videos.ts` and `app/utils/playlists.ts`
- Follow same patterns as books and writers
- Support skill IDs (1-15) and category IDs (health, identity, career)
- Include YouTube video ID and embed information

### Story 7.2: Video Data Entry & YAML Structure

As a content manager,
I want to define videos in YAML files,
So that I can easily add and manage video content.

**Acceptance Criteria:**

**Given** I need to add video content
**When** I create YAML files
**Then** I have:
- YAML structure for videos (en/fa)
- YAML structure for playlists (en/fa)
- Video metadata (title, description, YouTube ID, etc.)
- Skill mappings for each video
- Category assignments
- Data parsing script to TypeScript
- Validation of skill/category relationships

**Prerequisites:** Story 7.1

**Technical Notes:**
- Create `content/videos/` directory structure
- Define YAML schema for videos
- Create parsing script similar to books/writers
- Generate TypeScript data files at build time
- Validate skill IDs and category IDs

### Story 7.3: Video Components (Card, List)

As a developer,
I want reusable video components,
So that I can display videos consistently across the platform.

**Acceptance Criteria:**

**Given** I need to display videos
**When** I use video components
**Then** I have:
- VideoCard component (similar to BookCard)
- VideoList component (with filtering)
- Thumbnail display with YouTube-style play icon overlay
- Click to open YouTube video in new tab
- Responsive design
- Lazy loading for thumbnails
- Bilingual support
- Accessibility features

**Prerequisites:** Story 7.1, 7.2

**Technical Notes:**
- Create `app/components/videos/` directory
- Use Nuxt UI components for consistency
- Display YouTube thumbnails (generate URL from video ID)
- Click opens YouTube URL in new tab (`target="_blank"`)
- Add play icon overlay on thumbnail (YouTube-style)
- Optimize thumbnails with @nuxt/image
- Add lazy loading for performance
- Ensure 44x44px touch targets
- Follow same design patterns as BookCard
- Extract video ID from YouTube URL format

### Story 7.4: Videos List Page

As a user,
I want to browse all videos organized by category,
So that I can discover content related to my interests.

**Acceptance Criteria:**

**Given** I visit the videos page
**When** I view the list
**Then** I see:
- Videos grouped by category (Health, Identity, Career)
- Video cards with thumbnails, titles, durations
- Related skills displayed on each card
- Filter by skill dropdown
- Search functionality (optional)
- Breadcrumb navigation
- Bilingual content

**Prerequisites:** Story 7.3

**Technical Notes:**
- Create `app/pages/videos/index.vue`
- Group videos by category
- Implement filtering by skill
- Use VideoCard component
- Add breadcrumb navigation
- Follow same structure as books page

### Story 7.5: Video Detail Page

As a user,
I want to see video information and related content,
So that I can learn more about a topic and watch the video.

**Acceptance Criteria:**

**Given** I click on a video
**When** I view the detail page
**Then** I see:
- Large video thumbnail (clickable, opens YouTube in new tab)
- "Watch on YouTube" button
- Video title and description
- Related skills section (with links)
- Related books section (if any)
- Related writers section (if any)
- Tags section
- Breadcrumb navigation
- Previous/next video navigation (optional)

**Prerequisites:** Story 7.3

**Technical Notes:**
- Create `app/pages/videos/[slug].vue`
- Display large thumbnail with play icon overlay
- Click thumbnail or button opens YouTube URL in new tab
- Load related skills, books, writers
- Generate SEO-friendly slugs
- Add meta tags for video (with thumbnail)
- Implement breadcrumb navigation
- No video embedding - all videos open on YouTube

### Story 7.6: Skill Page Video Integration

As a user,
I want to see videos related to a skill,
So that I can learn more about that skill.

**Acceptance Criteria:**

**Given** I view a skill detail page
**When** I scroll down
**Then** I see:
- "Related Videos" section
- Video cards for videos related to the skill
- Link to videos list page filtered by skill
- Videos grouped by playlist (if applicable)

**Prerequisites:** Story 7.3, 7.4

**Technical Notes:**
- Update `app/pages/skills/[slug].vue`
- Add "Related Videos" section after books section
- Use VideoCard component
- Filter videos by skill ID
- Link to videos page with skill filter

### Story 7.7: Playlists Support

As a user,
I want to browse playlists and see all videos in a playlist,
So that I can follow structured learning paths.

**Acceptance Criteria:**

**Given** I visit the playlists page
**When** I view playlists
**Then** I see:
- Playlist cards with thumbnails and video counts
- Playlists grouped by category
- Filter by skill
- Click to view playlist detail page

**Given** I view a playlist detail page
**When** I see the playlist
**Then** I see:
- Playlist header with title and description
- List of all videos in playlist
- Related skills
- Related categories
- Breadcrumb navigation

**Prerequisites:** Story 7.3, 7.4

**Technical Notes:**
- Create `app/components/playlists/PlaylistCard.vue`
- Create `app/pages/playlists/index.vue`
- Create `app/pages/playlists/[slug].vue`
- Group playlists by category
- Display videos in playlist
- Link playlists to skills and categories

### Story 7.8: Navigation Integration

As a user,
I want to access videos from the main navigation,
So that I can easily find video content.

**Acceptance Criteria:**

**Given** I view the navigation menu
**When** I see the menu items
**Then** I see:
- "Videos" menu item
- "Playlists" menu item (optional)
- Active state highlighting
- Mobile menu support

**Prerequisites:** Story 7.4, 7.7

**Technical Notes:**
- Update `app/components/common/TopNav.vue`
- Add "Videos" menu item
- Add route handling for videos
- Update i18n translations
- Ensure mobile menu works correctly

---

## Epic 8: YouTube API Integration & Analytics

**Goal:** Create a comprehensive system that integrates with the YouTube Data API to fetch channel content (videos, playlists) and performs deep data analysis on video transcripts. This includes a hybrid full-stack approach for API communication, importing video data, enriching it with skills/categories, and providing an interactive analytics dashboard.

### Story 8.0: Excel Import & Video Data Extraction

As a developer,
I want to import all 127 videos from the Excel file into the system,
So that I can process and enrich the video data for analysis.

**Acceptance Criteria:**

**Given** I have an Excel file with 127 videos organized by playlists
**When** I run the import script
**Then** I have:
- All 127 videos extracted with basic metadata (title, URL, views, upload date)
- All playlists extracted with playlist URLs and video associations
- Video IDs extracted from YouTube URLs
- View counts parsed from format like "101K" to numbers
- Upload dates converted from relative format ("1 year ago" to ISO dates)
- Structured output (JSON/YAML) ready for data enrichment
- Validation of video URLs and IDs

**Prerequisites:** Epic 7 (Video integration)

**Technical Notes:**
- Create `scripts/import-excel-videos.ts`
- Use Excel parsing library (`xlsx` or `exceljs`)
- Parse each sheet (playlist) separately
- Extract playlist URL from cell A1 of each sheet
- Extract video data from rows 4+ (Title, URL, Upload Date, Views)
- Parse view counts: "101K" → 101000, "1.5M" → 1500000
- Convert relative dates: "1 year ago" → approximate ISO date
- Extract YouTube video IDs from URLs
- Generate playlist metadata
- Output structured data (JSON/YAML) for next step
- Handle edge cases (missing data, invalid URLs, etc.)

### Story 8.0a: Video Summary Data Structure & Storage

As a developer,
I want a structured way to store and access video summaries,
So that I can provide extended summaries alongside transcripts for analysis.

**Acceptance Criteria:**

**Given** I have extended summaries for 127 videos
**When** I structure the data
**Then** I have:
- VideoSummary type with video ID, summary text, metadata
- Storage structure for all 127 video summaries
- Efficient access methods for querying summaries
- Support for both Persian and English summaries
- Summary metadata (video ID, length, word count, key points, topics)
- TypeScript types defined
- Utility functions for summary operations

**Prerequisites:** Story 8.0

**Technical Notes:**
- Define `VideoSummary` interface in `app/types/summaries.ts`
- Store summaries in `app/data/summaries/` directory
- Structure: `app/data/summaries/fa/` and `app/data/summaries/en/`
- Each summary file maps to video ID
- Include metadata: word count, character count, key points, topics, reading time estimate
- Create `app/utils/summaries.ts` for summary operations
- Support lazy loading for performance (load on demand)
- Summary structure similar to transcripts but with additional metadata fields

### Story 8.0b: Excel Data Enrichment & Skill/Category Mapping

As a developer,
I want to enrich video data with skill/category mappings and metadata,
So that videos are properly categorized and searchable.

**Acceptance Criteria:**

**Given** I have imported video data from Excel
**When** I enrich the data
**Then** I have:
- Videos mapped to skills (1-15) based on title analysis and content
- Videos mapped to categories (health/identity/career) derived from skill mappings
- Tags extracted from titles and content
- Writers identified from titles (e.g., "Andrew Huberman", "Peter Attia")
- Book references identified (if mentioned)
- English translations for Persian titles
- Thumbnail URLs generated from video IDs
- Playlist associations maintained
- Validation of skill IDs and category IDs

**Prerequisites:** Story 8.0

**Technical Notes:**
- Create `scripts/enrich-video-data.ts`
- Implement title-based keyword matching for initial skill mapping
- Use keyword dictionaries for skill identification
- Extract tags from titles (topics, experts mentioned, etc.)
- Identify writers from title patterns (name mentions)
- Generate thumbnail URLs using existing utility
- Translate titles (manual or API-assisted)
- Refine mappings once transcripts are available (Story 8.1)
- Output enriched video data files
- Create mapping documentation for manual review

### Story 8.1: YouTube URL Extraction from Google Sheets

As a content manager,
I want to extract YouTube URLs from Google Sheets containing multiple playlists,
So that I can process transcripts for bulk video analysis.

**Acceptance Criteria:**

**Given** I have a Google Sheet with multiple playlist tabs
**When** I extract URLs from all tabs
**Then** I have:
- All YouTube URLs extracted from each sheet tab
- URLs deduplicated across all tabs
- URLs sorted alphabetically
- Single file containing all unique URLs (one per line)
- URL validation (proper YouTube format)
- Error handling for invalid or missing data
- Progress reporting for large datasets (~100+ videos)

**Prerequisites:** None (can start in parallel with other data preparation)

**Technical Notes:**
- Create `scripts/extract-google-sheet-urls.ts`
- Use Google Sheets API or CSV export for data access
- Parse each tab separately (ignore header rows with "Data from: playlist_url")
- Extract URLs from column B (Title | URL | Upload Date | Views format)
- Implement deduplication logic
- Support both batch processing and individual video processing

### Story 8.2: Configuration & Server Client

As a developer,
I want to configure the project with YouTube API credentials and create a server-side client,
So that I can securely communicate with the YouTube Data API.

**Acceptance Criteria:**

**Given** a valid YouTube Data API key
**When** I configure the project
**Then** I have:
- `.env` file with `NUXT_YOUTUBE_API_KEY` and `NUXT_YOUTUBE_CHANNEL_HANDLES`
- `nuxt.config.ts` updated with `runtimeConfig` (server-only key)
- `server/utils/youtubeClient.ts` class implemented with:
  - `getChannelByHandle`
  - `getPlaylistsByChannelId`
  - `getUploadsPlaylistId`
  - `getAllPlaylistItems`
  - `getVideosByIds`
- Error handling for failed requests
- Quota-friendly delays between requests

**Prerequisites:** None

**Technical Notes:**
- Use `process.env` for secrets
- Keep API key server-side only
- Use `fetch` for requests

### Story 8.3: API Routes

As a developer,
I want to expose internal API routes for YouTube data,
So that the frontend can fetch data without direct access to the YouTube API.

**Acceptance Criteria:**

**Given** the server client is ready
**When** I implement API routes
**Then** I have endpoints for:
- `/api/youtube/channel` (GET channel details)
- `/api/youtube/playlists` (GET playlists)
- `/api/youtube/uploads` (GET latest uploads)
- `/api/youtube/videos` (GET video details by ID or handle)

**And** responses are normalized JSON
**And** errors are handled gracefully

**Prerequisites:** Story 8.2

**Technical Notes:**
- Use `defineEventHandler`
- Return typed interfaces (ChannelData, PlaylistData, etc.)

### Story 8.4: Frontend Composables

As a developer,
I want reusable composables to fetch YouTube data,
So that I can easily use this data in my Vue components.

**Acceptance Criteria:**

**Given** the API routes are available
**When** I create composables
**Then** I have:
- `useYoutubeChannel(handle?)`
- `useYoutubeUploads(handle?)`
- `useYoutubeVideos(options)`

**And** they use `useAsyncData` or `$fetch`
**And** they are SSR-safe
**And** they provide typed results

**Prerequisites:** Story 8.3

**Technical Notes:**
- Auto-imported in `app/composables`
- Handle loading and error states

### Story 8.4a: Dev UI & Documentation

As a developer,
I want a test page and updated documentation,
So that I can verify the integration and understand how to use it.

**Acceptance Criteria:**

**Given** the full stack is implemented
**When** I create the dev page
**Then** I see:
- A page at `/dev/youtube`
- Channel information card
- List of videos with thumbnails and stats
- Input to change the channel handle

**And** when I update the README
**Then** it includes:
- Setup instructions for YouTube integration
- API endpoint documentation
- Usage examples

**Prerequisites:** Story 8.4

**Technical Notes:**
- Use Nuxt UI components
- Keep design minimal but functional

### Story 8.5: Video Transcript Data Structure & Storage

As a developer,
I want a structured way to store and access video transcripts,
So that I can perform analysis on the full text of all videos.

**Acceptance Criteria:**

**Given** I have video transcripts from 127 videos
**When** I structure the data
**Then** I have:
- VideoTranscript type with video ID, transcript text, metadata
- Storage structure for all 127 video transcripts
- Efficient access methods for querying transcripts
- Support for both Persian and English transcripts
- Transcript metadata (video ID, length, word count, etc.)
- TypeScript types defined
- Utility functions for transcript operations
- Content-based skill/category mapping refinement (using transcript analysis)

**Prerequisites:** Story 8.0b (Data enrichment)

**Technical Notes:**
- Define `VideoTranscript` interface in `app/types/transcripts.ts`
- Store transcripts in `app/data/transcripts/` directory
- Structure: `app/data/transcripts/fa/` and `app/data/transcripts/en/`
- Each transcript file maps to video ID
- Include metadata: word count, character count, video ID reference
- Create `app/utils/transcripts.ts` for transcript operations
- Support lazy loading for performance (load on demand)
- Consider indexing for fast search (future enhancement)
- Once transcripts are available, refine skill/category mappings from Story 8.0b using content analysis
- Use transcript content to improve writer and book identification

### Story 8.6: Text Analysis Utilities & Core Functions

As a developer,
I want text analysis utilities for processing video transcripts and summaries,
So that I can generate various analytics reports.

**Acceptance Criteria:**

**Given** I have video transcripts and summaries
**When** I use analysis utilities
**Then** I have:
- Word frequency analysis (count occurrences of words/phrases)
- Case-insensitive and case-sensitive search options
- Phrase/name mention counting (e.g., "Andrew Huberman", "health")
- Multi-word phrase detection
- Text normalization (remove punctuation, handle Persian/English)
- Stop word filtering (optional)
- Stemming support (optional, for advanced analysis)
- Performance optimized for large text corpus (127 videos)
- Support for analyzing both transcripts and summaries
- Content-based skill/category mapping refinement

**Prerequisites:** Story 8.5, Story 8.0a (Summaries)

**Technical Notes:**
- Create `app/utils/text-analysis.ts` with core analysis functions
- Functions:
  - `countWordOccurrences(text: string, word: string, options?: AnalysisOptions): number`
  - `countPhraseOccurrences(text: string, phrase: string, options?: AnalysisOptions): number`
  - `getWordFrequency(text: string, options?: FrequencyOptions): WordFrequency[]`
  - `findMentions(text: string, searchTerms: string[]): MentionResult[]`
  - `normalizeText(text: string, locale: 'fa' | 'en'): string`
- Support both Persian and English text analysis
- Handle Persian text properly (RTL, character normalization)
- Optimize for performance (consider memoization, indexing)
- Add JSDoc comments for all functions
- Extend functions to work with both transcripts and summaries
- Use analysis to refine skill/category mappings from Story 8.0b

### Story 8.7: Analysis Report Types & Data Models

As a developer,
I want defined report types and data models,
So that I can structure analysis results consistently.

**Acceptance Criteria:**

**Given** I need to generate reports
**When** I define report types
**Then** I have:
- WordFrequencyReport type (word, count, percentage, videos)
- MentionReport type (term, count, videos, timestamps)
- TrendReport type (term, count over time, video dates)
- ComparisonReport type (compare multiple terms)
- TopWordsReport type (most frequent words)
- CategoryAnalysisReport type (analysis by skill/category)
- TypeScript interfaces for all report types
- Report metadata (generated date, filters applied, etc.)

**Prerequisites:** Story 8.6

**Technical Notes:**
- Define report types in `app/types/analytics.ts`
- Include:
  - `WordFrequencyReport`, `MentionReport`, `TrendReport`
  - `ComparisonReport`, `TopWordsReport`, `CategoryAnalysisReport`
  - `AnalysisOptions`, `ReportMetadata`
- Each report includes video references (which videos contain the term)
- Support filtering by video, category, skill, date range
- Include percentage calculations and relative frequencies

### Story 8.8: Report Generation Engine

As a developer,
I want a report generation engine,
So that I can create various analysis reports from video transcripts.

**Acceptance Criteria:**

**Given** I have transcripts and analysis utilities
**When** I generate reports
**Then** I can create:
- Word frequency reports (single word or phrase)
- Mention reports (names, concepts, topics)
- Top N words/phrases reports
- Comparison reports (compare multiple terms)
- Category-based reports (analyze by skill/category)
- Time-based trend reports (if video dates available)
- Custom search reports (user-defined queries)
- Export reports (JSON, CSV formats)

**Prerequisites:** Story 8.6, 8.7

**Technical Notes:**
- Create `app/utils/report-generator.ts`
- Functions:
  - `generateWordFrequencyReport(term: string, options?: ReportOptions): WordFrequencyReport`
  - `generateMentionReport(terms: string[], options?: ReportOptions): MentionReport[]`
  - `generateTopWordsReport(limit: number, options?: ReportOptions): TopWordsReport`
  - `generateComparisonReport(terms: string[], options?: ReportOptions): ComparisonReport`
  - `generateCategoryReport(categoryId: string, term: string, options?: ReportOptions): CategoryAnalysisReport`
- Support filtering by video IDs, categories, skills, date ranges
- Cache results for performance (memoization)
- Handle large datasets efficiently (127 videos worth of text)
- Support both Persian and English analysis

### Story 8.9: Analytics Dashboard Page Structure

As a user,
I want an analytics dashboard page,
So that I can access and view various analysis reports.

**Acceptance Criteria:**

**Given** I visit the analytics page
**When** I view the dashboard
**Then** I see:
- Dashboard header with title and description
- Report type selector (Word Frequency, Mentions, Trends, etc.)
- Search/query input for custom analysis
- Filter options (by category, skill, video, date range)
- Report display area with results
- Export options (JSON, CSV download)
- Loading states during analysis
- Error handling for invalid queries
- Bilingual support (Persian/English)

**Prerequisites:** Story 8.8

**Technical Notes:**
- Create `app/pages/analytics/index.vue`
- Use Nuxt UI components for consistent design
- Implement report type tabs or dropdown
- Add search input with autocomplete suggestions
- Create filter components (category, skill, date picker)
- Display results in cards or tables
- Add export buttons with download functionality
- Use Vue composables for state management
- Implement loading skeletons
- Add error messages for invalid inputs
- Follow modern, compact design patterns

### Story 8.10: Word Frequency Report Component

As a user,
I want to see word frequency analysis reports,
So that I can understand how often specific words or phrases appear across videos.

**Acceptance Criteria:**

**Given** I search for a word or phrase (e.g., "health", "Andrew Huberman")
**When** I view the word frequency report
**Then** I see:
- Total occurrence count across all videos
- Occurrence count per video (list of videos with counts)
- Percentage of videos containing the term
- Visual representation (bar chart, word cloud, or list)
- Clickable video links to view transcript context
- Option to see context around each mention
- Filter by video, category, or skill
- Sort by frequency or video date

**Prerequisites:** Story 8.9

**Technical Notes:**
- Create `app/components/analytics/WordFrequencyReport.vue`
- Display results in a table or card layout
- Use Nuxt UI components (UTable, UCard)
- Add charts using a charting library (Chart.js, Recharts, or similar)
- Show video cards with occurrence counts
- Link to video detail pages or transcript sections
- Implement pagination for large result sets
- Add copy-to-clipboard for counts
- Support both Persian and English display

### Story 8.11: Mention Report Component

As a user,
I want to see mention reports for names, concepts, or topics,
So that I can track how often specific people or ideas are referenced.

**Acceptance Criteria:**

**Given** I search for mentions (e.g., "Andrew Huberman", "sleep", "dopamine")
**When** I view the mention report
**Then** I see:
- Total mention count for each term
- List of videos containing each mention
- Number of times mentioned per video
- Visual comparison (bar chart comparing multiple terms)
- Option to search multiple terms at once
- Context snippets showing where mentions occur
- Links to video transcripts with highlighted mentions
- Filter by video, category, or skill

**Prerequisites:** Story 8.9

**Technical Notes:**
- Create `app/components/analytics/MentionReport.vue`
- Support multiple term search
- Display comparison charts
- Show video list with mention counts
- Highlight mentions in context snippets
- Use Nuxt UI components for consistent design
- Add export functionality
- Implement search suggestions (autocomplete)
- Support case-insensitive and exact match options

### Story 8.12: Top Words Report Component

As a user,
I want to see the most frequently used words across all videos,
So that I can understand the main topics and themes.

**Acceptance Criteria:**

**Given** I view the top words report
**When** I see the results
**Then** I see:
- Top N most frequent words (configurable N, default 50)
- Word frequency counts
- Option to exclude common stop words
- Visual representation (word cloud or bar chart)
- Filter by category or skill
- Option to see word usage over time (if dates available)
- Click on word to see detailed frequency report
- Support for both single words and phrases

**Prerequisites:** Story 8.9

**Technical Notes:**
- Create `app/components/analytics/TopWordsReport.vue`
- Implement word cloud visualization (use library like wordcloud2.js or D3)
- Add stop word filtering (common words in Persian/English)
- Create interactive word cloud (click to drill down)
- Show bar chart as alternative view
- Add filters for minimum word length, exclude numbers, etc.
- Support phrase analysis (bigrams, trigrams)
- Optimize performance for large word lists

### Story 8.13: Comparison Report Component

As a user,
I want to compare multiple terms side by side,
So that I can understand relative frequency and usage patterns.

**Acceptance Criteria:**

**Given** I want to compare multiple terms (e.g., "health" vs "career" vs "identity")
**When** I generate a comparison report
**Then** I see:
- Side-by-side comparison of term frequencies
- Visual comparison chart (bar chart, line chart)
- Percentage breakdowns
- Videos containing each term
- Overlap analysis (videos containing multiple terms)
- Statistical summary (total, average, max, min)
- Export comparison data

**Prerequisites:** Story 8.9

**Technical Notes:**
- Create `app/components/analytics/ComparisonReport.vue`
- Support 2-10 terms comparison
- Use charting library for visualizations
- Display Venn diagram for overlap (if 2-3 terms)
- Show statistical summaries
- Add interactive filters
- Support different comparison metrics (count, percentage, per video average)

### Story 8.14: Category & Skill-Based Analysis

As a user,
I want to analyze transcripts filtered by category or skill,
So that I can understand topic distribution within specific areas.

**Acceptance Criteria:**

**Given** I select a category (Health, Identity, Career) or skill (1-15)
**When** I analyze transcripts for that category/skill
**Then** I see:
- Analysis limited to videos in that category/skill
- Word frequency for that subset
- Top words/phrases for that category/skill
- Comparison with other categories/skills
- Category-specific insights
- Visual breakdown by category/skill
- Option to compare across categories

**Prerequisites:** Story 8.9

**Technical Notes:**
- Extend report generator to support category/skill filtering
- Create `app/components/analytics/CategoryAnalysis.vue`
- Filter videos by categoryIds or skillIds
- Show category breakdown charts
- Add category comparison views
- Link to category/skill detail pages
- Show insights specific to each category

### Story 8.15: Advanced Search & Custom Queries

As a user,
I want to perform advanced searches with custom queries,
So that I can find specific patterns or combinations of terms.

**Acceptance Criteria:**

**Given** I want to search for complex patterns
**When** I use advanced search
**Then** I can:
- Search for multiple terms (AND, OR, NOT operators)
- Use wildcards or regex patterns (optional)
- Search within specific video ranges
- Filter by video metadata (duration, date, category)
- Save custom queries for reuse
- View search history
- Get search suggestions based on available data

**Prerequisites:** Story 8.9

**Technical Notes:**
- Create `app/components/analytics/AdvancedSearch.vue`
- Implement query builder UI
- Support boolean operators (AND, OR, NOT)
- Add query validation
- Store recent searches in localStorage
- Implement search autocomplete
- Add query examples/templates
- Support regex patterns (with validation)

### Story 8.16: Report Export & Sharing

As a user,
I want to export and share analysis reports,
So that I can use the data in other tools or share insights.

**Acceptance Criteria:**

**Given** I have generated a report
**When** I want to export it
**Then** I can:
- Export as JSON (structured data)
- Export as CSV (spreadsheet format)
- Export as PDF (formatted report, optional)
- Copy report data to clipboard
- Share report via URL (with query parameters)
- Include report metadata in exports
- Choose export format and options

**Prerequisites:** Story 8.9

**Technical Notes:**
- Create `app/utils/report-export.ts`
- Implement JSON export (structured data)
- Implement CSV export (table format)
- Add PDF export (use library like jsPDF, optional)
- Create shareable URLs with query parameters
- Add copy-to-clipboard functionality
- Include metadata (generation date, filters, etc.)
- Optimize export for large datasets

### Story 8.17: Analytics Navigation Integration

As a user,
I want to access analytics from the main navigation,
So that I can easily find the analysis features.

**Acceptance Criteria:**

**Given** I view the navigation menu
**When** I see the menu items
**Then** I see:
- "Analytics" or "Data Analysis" menu item
- Active state highlighting when on analytics page
- Mobile menu support
- Breadcrumb navigation on analytics pages
- Link from video pages to analytics (optional)

**Prerequisites:** Story 8.9

**Technical Notes:**
- Update `app/components/common/TopNav.vue`
- Add "Analytics" menu item
- Update i18n translations
- Add breadcrumb support
- Ensure mobile menu works correctly
- Add route handling for analytics pages

### Story 8.18: Performance Optimization & Caching

As a developer,
I want optimized performance for analytics operations,
So that analysis of 127 videos runs efficiently.

**Acceptance Criteria:**

**Given** I perform analysis on large datasets
**When** reports are generated
**Then**:
- Analysis completes in reasonable time (<5 seconds for common queries)
- Results are cached for repeated queries
- Large datasets are processed efficiently
- UI remains responsive during analysis
- Loading states are shown appropriately
- Memory usage is optimized
- Lazy loading for transcript data

**Prerequisites:** Story 8.8

**Technical Notes:**
- Implement memoization for report generation
- Cache analysis results (use Vue composable or Pinia store)
- Optimize text processing algorithms
- Use Web Workers for heavy processing (optional)
- Implement pagination for large result sets
- Lazy load transcripts (load on demand)
- Add performance monitoring
- Optimize bundle size (code splitting)

### Story 8.19: Analytics Dashboard Polish & UX

As a user,
I want a polished and intuitive analytics experience,
So that I can easily discover insights from video transcripts.

**Acceptance Criteria:**

**Given** I use the analytics dashboard
**When** I interact with features
**Then**:
- UI is modern, clean, and intuitive
- Reports are visually appealing
- Charts and visualizations are clear and informative
- Mobile-responsive design works well
- Loading states are smooth
- Error messages are helpful
- Tooltips and help text guide users
- Keyboard navigation works
- Accessibility standards met (WCAG AA)

**Prerequisites:** All previous stories in Epic 8

**Technical Notes:**
- Polish all analytics components
- Add tooltips and help text
- Improve visualizations (colors, spacing, typography)
- Ensure mobile responsiveness
- Add smooth animations and transitions
- Test keyboard navigation
- Add accessibility attributes (ARIA labels)
- Conduct UX review and improvements
- Add example queries and tutorials
