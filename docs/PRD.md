# 15ecosystem - Product Requirements Document (Simplified MVP)

**Author:** ali
**Date:** November 6, 2025
**Version:** 2.0 (Simplified MVP)

---

## Executive Summary

15ecosystem is a content showcase platform that organizes and visualizes the "15 Essential Skills for 2025" from a single YouTube video. The MVP focuses on presenting this video's content in a structured, categorized format with simple visualizations and book references.

**Vision:** Create a platform that helps people improve their quality of life, get closer to their dreams, achieve more useful longevity, and most importantly - better understand the value of time. Starting with family, then close friends, then LinkedIn community, and finally everyone.

**MVP Goal:** Transform one video's content into an organized, browsable web experience that helps users understand and navigate the 15 skills through clear categorization and visual diagrams. Fully bilingual (Persian/English) with complete RTL-LTR support.

**Collaboration Goal:** When MVP is ready, share with Khashayar Talks (YouTube channel owner) for potential collaboration and future expansion.

### What Makes This Special

**The Magic Moment:** When a user discovers how the 15 skills connect and sees the complete ecosystem visualized, making it easier to understand the relationships between health, focus, learning, creativity, and career skills.

**Core Innovation:** Simple, clear organization of video content with visual diagrams showing skill relationships and connections.

---

## Project Classification

**Technical Type:** Static/SSG Web Application (Component-Based, Expandable)
**Domain:** Educational Content Platform / Personal Development Ecosystem
**Complexity:** Medium (Component-based architecture, modern design, expandable structure)

**Project Characteristics:**
- **Platform:** Nuxt 4 SSG (Static Site Generation)
- **Architecture:** Fully component-based, expandable structure (not just a showcase)
- **Design Philosophy:** Modern, compact design following best practices
- **Content Type:** Single video content (transcript + summary) organized by 3 categories
- **User Model:** No authentication needed for MVP (expandable for future)
- **Scale Target:** Built for expansion - component-based allows easy feature addition
- **Languages:** Fully bilingual - Persian (RTL) and English (LTR)
- **Target Audience:** Family → Close Friends → LinkedIn Community → Everyone
- **Code Quality:** Production-ready, maintainable, following development best practices
- **UI/UX Standards:** Modern design, accessibility (WCAG AA), performance optimized

---

## Success Criteria

### MVP Success Metrics

**Content Organization:**
- All 15 skills clearly categorized and accessible
- Three main categories (Health, Identity, Career) clearly distinguished
- Book references from video displayed for each skill
- Visual diagrams showing skill relationships
- Component-based structure allows easy expansion

**User Experience:**
- Users can easily navigate between skills
- Content is readable and well-organized
- Mobile-responsive design
- Fast page loads (<2 seconds)

**Content Completeness:**
- Full video transcript available
- Video summary available
- All 15 skills documented
- Book references included

---

## Product Scope

### MVP - Minimum Viable Product

**Core Features:**

1. **Landing Page**
   - Introduction to 15ecosystem
   - Overview of the 15 skills concept
   - Navigation to main categories

2. **Category Structure**
   - **Main Category 1:** Health (Skills 1-6)
   - **Main Category 2:** Identity (Skills 7-12)
   - **Main Category 3:** Career (Skills 13-15)
   - Each category shows its skills as sub-categories

3. **Skill Pages (15 total)**
   - Skill name and number
   - "Why it matters" content from video
   - "How to" content from video
   - Book references mentioned in video
   - Simple visual diagram (if applicable)

4. **Content Pages**
   - Full video transcript page
   - Video summary page
   - Books reference page (all books mentioned)

5. **Visual Diagrams**
   - Simple diagram showing main category structure
   - Diagram showing skill relationships/connections
   - Visual representation of the "ecosystem" concept

6. **Navigation**
   - Main menu: Categories, Skills, Transcript, Summary, Books
   - Breadcrumb navigation
   - Mobile-responsive menu

**MVP Content:**
- Single video: "15 Essential Skills for 2025"
- Content sources: `youtubevideofulltext.yml` (transcript) and `summaryofyoutubevideofulltext.yml` (summary)
- 15 skills with content extracted from video
- Book references from video

### Deferred to Future Phases

**Phase 2 Features:**
- Add multiple videos
- Connect videos to skills/categories
- Full-text search
- Database for content management
- User accounts and progress tracking
- "Connecting the Dots" feature (Steve Jobs concept)
- Community features
- Interactive exercises

---

## Content Structure

### Main Categories

**Category 1: Health (Skills 1-6)**
1. Quality Sleep (خواب باکیفیت)
2. Focus - Deep Work (تمرکز - کار عمیق)
3. Dopamine Control (کنترل دوپامین)
4. Stress Control (کنترل استرس)
5. Mental Health & Meaningful Relationships (سلامت روان و روابط معنادار)
6. Healthy Longevity (طول عمر سالم)

**Category 2: Identity (Skills 7-12)**
7. Creativity (خلاقیت)
8. Specific Knowledge - Almanack Naval, Mastery Robert Greene (دانش تخصصی)
9. Effective & Continuous Learning - Art of Learning, Learning How to Learn (یادگیری مؤثر و ادامه‌دار)
10. English Language Learning (یادگیری زبان انگلیسی)
11. Personal Brand (برند شخصی)
12. Authentic Self - Almanack, Mastery Robert Greene (خود واقعی - اصالت)

**Category 3: Career (Skills 13-15)**
13. Content Creation - Colin and Samir (تولید محتوا)
14. AI Literacy - The Coming Wave (سواد هوش مصنوعی)
15. Agency - High Agency (ایجِنسی - تفکر و کنش خودمختار)

### Content Sources

- **Full Transcript:** `docs/sources/youtubevideofulltext.yml`
- **Summary:** `docs/sources/summaryofyoutubevideofulltext.yml`
- **Books:** Extracted from video content (listed in summary)

### Book References (from video)

**Health Skills:**
- *Why We Sleep* (Matthew Walker)
- *Deep Work* (Cal Newport)
- *Indistractable* (Nir Eyal)
- *Dopamine Nation* (Anna Lembke)
- *The Molecule of More*
- *The Comfort Crisis* (Michael Easter)
- *Good Anxiety* (Wendy Suzuki)
- *Trauma: The Invisible Epidemic* (Paul Conti)
- *Outlive* (Peter Attia)
- *Lifespan* (David Sinclair)

**Identity/Career Skills:**
- *Steal Like an Artist* (Austin Kleon)
- *The Almanack of Naval Ravikant*
- *Mastery* (Robert Greene)
- *Make It Stick*
- *The Art of Learning* (Josh Waitzkin)
- *The Coming Wave* (Mustafa Suleyman)
- *The Courage to Be Disliked*

---

## Functional Requirements

### FR1: Page Structure

**FR1.1: Landing Page**
- **Description:** Homepage introducing 15ecosystem
- **Acceptance Criteria:**
  - Welcome message and platform introduction
  - Overview of 15 skills concept
  - Links to main categories
  - Visual representation of the ecosystem concept
- **Priority:** MVP - Critical

**FR1.2: Category Pages**
- **Description:** Pages for each main category showing its skills
- **Acceptance Criteria:**
  - Category 1 page shows Skills 1-6
  - Category 2 page shows Skills 7-15
  - Each skill listed with brief description
  - Clickable links to individual skill pages
- **Priority:** MVP - Critical

**FR1.3: Skill Pages (15 pages)**
- **Description:** Individual page for each of the 15 skills
- **Acceptance Criteria:**
  - Skill number and name displayed
  - "Why it matters" section (from video content)
  - "How to" section (from video content)
  - Book references listed
  - Simple visual diagram (if applicable)
  - Navigation to related skills
- **Priority:** MVP - Critical

**FR1.4: Transcript Page - Component-Based**
- **Description:** Full video transcript display using reusable components
- **Acceptance Criteria:**
  - Complete transcript from `youtubevideofulltext.yml` (bilingual)
  - Well-formatted, readable text using ContentViewer component
  - Table of contents using TOC component linking to skill sections
  - Modern, compact design
  - Component-based (expandable for future features)
- **Priority:** MVP - High

**FR1.5: Summary Page - Component-Based**
- **Description:** Video summary display using reusable components
- **Acceptance Criteria:**
  - Complete summary from `summaryofyoutubevideofulltext.yml` (bilingual)
  - Well-organized sections using ContentSection components
  - Links to relevant skills using SkillLink components
  - Modern, compact design
  - Component-based (expandable)
- **Priority:** MVP - High

**FR1.6: Books Page**
- **Description:** All books mentioned in video
- **Acceptance Criteria:**
  - List of all books organized by skill/category
  - Book title and author
  - Which skill(s) each book relates to
  - Links to skill pages
- **Priority:** MVP - High

### FR2: Navigation

**FR2.1: Main Navigation**
- **Description:** Site-wide navigation menu
- **Acceptance Criteria:**
  - Main menu: Home, Categories, Skills, Transcript, Summary, Books
  - Mobile-responsive hamburger menu
  - Active page highlighted
- **Priority:** MVP - Critical

**FR2.2: Breadcrumb Navigation Component**
- **Description:** Breadcrumb trail using reusable component
- **Acceptance Criteria:**
  - Shows: Home > Category > Skill (bilingual)
  - Breadcrumb component (reusable)
  - Clickable breadcrumb links
  - Visible on all pages except landing
  - Modern design
- **Priority:** MVP - Medium

**FR2.3: Skill Navigation Component**
- **Description:** Navigation between skills using reusable component
- **Acceptance Criteria:**
  - SkillNavigation component (reusable)
  - Previous/Next skill buttons on skill pages
  - "All Skills" link
  - Return to category link
  - Modern button design
- **Priority:** MVP - Medium

### FR3: Visual Diagrams

**FR3.1: Category Structure Diagram**
- **Description:** Visual showing main categories and skills
- **Acceptance Criteria:**
  - Shows two main categories
  - Shows 15 skills organized under categories
  - Clickable skills linking to skill pages
  - Simple, clear visual design
- **Priority:** MVP - High

**FR3.2: Skill Relationship Diagram**
- **Description:** Visual showing how skills connect
- **Acceptance Criteria:**
  - Shows connections between related skills
  - Visual representation of "ecosystem" concept
  - Highlights the progression: Health → Focus → Learning → Creativity → Brand/Income
- **Priority:** MVP - Medium

**FR3.3: Simple Visualizations**
- **Description:** Basic diagrams for complex concepts
- **Acceptance Criteria:**
  - Visual aids for skills where helpful
  - Simple charts or diagrams
  - Mobile-responsive
- **Priority:** MVP - Low

### FR4: Content Display

**FR4.1: Bilingual Content Support**
- **Description:** Full Persian and English support with RTL-LTR (matching portfolio setup)
- **Acceptance Criteria:**
  - All content available in both Persian and English
  - Language switcher in navigation (prominent, accessible)
  - RTL layout for Persian (right-to-left) - automatic `dir` attribute
  - LTR layout for English (left-to-right)
  - Proper font support: Vazirmatn (Persian), Roobert or system fonts (English)
  - Text direction automatically switches based on language
  - i18n strategy: `prefix_except_default` (English default, Persian `/fa` prefix)
  - Locale files: `i18n/locales/en.json`, `i18n/locales/fa.json`
- **Priority:** MVP - Critical

**FR4.2: Content Formatting**
- **Description:** Well-formatted content display
- **Acceptance Criteria:**
  - Readable typography for both languages
  - Proper heading hierarchy
  - Lists and sections clearly formatted
  - Persian and English text properly displayed
- **Priority:** MVP - Critical

**FR4.2: Mobile Responsiveness**
- **Description:** Content readable on all devices
- **Acceptance Criteria:**
  - Responsive layout for mobile, tablet, desktop
  - Touch-friendly navigation
  - Readable text on small screens
- **Priority:** MVP - Critical

---

## Non-Functional Requirements

### Performance Requirements

**Page Load:**
- **Initial Load:** <2 seconds
- **Navigation:** <500ms for route transitions
- **Content Display:** Instant (static content)

**Why It Matters:** Fast loading ensures good user experience for content browsing.

### Accessibility Requirements

**Basic Accessibility:**
- **Semantic HTML:** Proper heading structure
- **Alt Text:** Images have descriptive alt text
- **Keyboard Navigation:** All content accessible via keyboard
- **Color Contrast:** Text meets WCAG AA standards

**Why It Matters:** Content should be accessible to all users.

### Browser Support

**Modern Browsers:**
- Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile browsers: iOS Safari, Chrome Mobile

---

## Technical Constraints

### Technology Stack (Based on Portfolio)

**Frontend:**
- **Framework:** Nuxt 4 (SSG mode) - Matching portfolio: https://github.com/aliarghyani/nuxt-portfolio
- **UI Library:** Nuxt UI 4 with theme tokens in `app.config.ts`
- **Styling:** Tailwind CSS 4 with custom utilities and variants
- **Language:** TypeScript (strict mode)
- **i18n:** @nuxtjs/i18n - `prefix_except_default` strategy (English default, Persian `/fa` prefix)
- **Content:** YAML files parsed at build time, organized in `app/data/` (separate EN/FA)
- **Components:** Fully component-based architecture matching portfolio structure
- **Structure:** `app/` directory:
  - `components/` - Organized by feature (common/, skills/, categories/, content/, diagrams/)
  - `composables/` - Reusable composables (useSkills, useCategories, useI18n)
  - `utils/` - Helper functions
  - `types/` - TypeScript definitions
  - `data/` - Content data (separate files for EN/FA)
- **Design System:** Modern, compact design (not traditional)
- **Accessibility:** WCAG AA compliance, semantic HTML, ARIA labels
- **Performance:** Lazy loading, font preloading (@nuxt/image), optimized assets
- **Fonts:** Vazirmatn (Persian), Roobert or system fonts (English)
- **Code Quality:** ESLint, Prettier, TypeScript strict mode

**Deployment:**
- **Platform:** Vercel (static hosting)
- **Build:** Static site generation
- **No Database:** Content from YAML files

**Internationalization:**
- **Languages:** Persian (fa) and English (en)
- **RTL Support:** Full right-to-left layout for Persian
- **LTR Support:** Left-to-right layout for English
- **Language Switching:** User-selectable language switcher

### Content Management

**Content Storage:**
- YAML files in `docs/sources/` (source)
- Parsed at build time into structured content
- Content organized in `app/data/` (separate files for EN/FA like portfolio)
- Component-based content display
- No CMS needed for MVP (expandable to CMS in future)
- Content updates = code updates (for MVP)

### Component Architecture (Based on Portfolio)

**Component Structure:**
```
app/
  ├── components/
  │   ├── common/          # Shared UI (Navigation, Footer, LanguageSwitcher)
  │   ├── skills/          # Skill-related components (SkillCard, SkillDetail)
  │   ├── categories/      # Category components (CategoryCard, CategoryGrid)
  │   ├── content/         # Content display components (Transcript, Summary)
  │   └── diagrams/        # Visual diagram components
  ├── composables/         # Reusable composables (useSkills, useI18n)
  ├── utils/               # Helper functions
  ├── types/               # TypeScript definitions
  └── data/                # Content data (EN/FA separate files)
```

**Design Principles:**
- **Component-Based:** Every UI element is a reusable component
- **Expandable:** Components designed for future features
- **Modern Design:** Clean, compact, following current UI/UX trends
- **Accessibility:** WCAG AA compliance, semantic HTML, ARIA labels
- **Performance:** Lazy loading, code splitting, optimized assets
- **Maintainability:** Clear structure, TypeScript types, documentation

---

## Content Mapping

### Skills Content Extraction

Each skill page will contain content extracted from the video transcript and summary:

**Structure per skill:**
1. **Skill Number & Name**
2. **Why It Matters** (from video)
3. **How To** (from video)
4. **Book References** (from video)
5. **Related Skills** (connections to other skills)

### Content Sources

- **Transcript:** `docs/sources/youtubevideofulltext.yml`
- **Summary:** `docs/sources/summaryofyoutubevideofulltext.yml`
- **Books:** Extracted from both files

---

## Future Vision

### Phase 2: Multiple Videos
- Add more educational videos
- Connect videos to skills/categories
- Video library with search

### Phase 3: "Connecting the Dots"
- Visual tool showing how different videos/content connect
- Steve Jobs "connecting dots" concept implementation
- User can see relationships between different content pieces

### Phase 4: Database & Search
- Database for content management
- Full-text search across all content
- Advanced filtering and discovery

### Phase 5: User Features
- User accounts
- Progress tracking
- Bookmarks/favorites
- Personal learning paths

### Phase 6: Community
- Discussion forums
- User comments
- Content sharing

---

## Success Metrics

### MVP Metrics

**Content Completeness:**
- ✅ All 15 skills documented
- ✅ All book references included
- ✅ Full transcript available
- ✅ Summary available

**User Experience:**
- Fast page loads (<2s)
- Mobile-responsive
- Easy navigation
- Clear content organization

**Future Metrics (Post-MVP):**
- User engagement
- Content discovery
- Search usage
- Community participation

---

## Next Steps

### Immediate Actions

1. **Content Extraction:** Parse YAML files and extract skill content
2. **Page Structure:** Create Nuxt pages for each skill and category
3. **Visual Diagrams:** Design simple diagrams for category structure
4. **Styling:** Apply Tailwind CSS for clean, readable design
5. **Deployment:** Deploy to Vercel as static site

### Development Phases

**Week 1-2: Content & Structure**
- Extract content from YAML files
- Create page structure
- Set up Nuxt project

**Week 3: Visual Design**
- Create diagrams
- Design page layouts
- Mobile responsiveness

**Week 4: Polish & Deploy**
- Content review
- Testing
- Deployment

---

## Appendix

### Content Files

- **Video Transcript:** `docs/sources/youtubevideofulltext.yml`
- **Video Summary:** `docs/sources/summaryofyoutubevideofulltext.yml`
- **Steve Jobs Video:** `docs/sources/Steve Jobs - Connecting The Dots - Motivational Video.yml` (for future reference)

### Skill List (Complete - Verified)

**Health (1-6):**
1. **Quality Sleep** (خواب باکیفیت)
2. **Focus - Deep Work** (تمرکز - کار عمیق)
3. **Dopamine Control** (کنترل دوپامین)
4. **Stress Control** (کنترل استرس)
5. **Mental Health & Meaningful Relationships** (سلامت روان و روابط معنادار)
6. **Healthy Longevity** (طول عمر سالم)

**Identity (7-12):**
7. **Creativity** (خلاقیت)
8. **Specific Knowledge** - Almanack Naval, Mastery Robert Greene (دانش تخصصی)
9. **Effective & Continuous Learning** - Art of Learning, Learning How to Learn (یادگیری مؤثر و ادامه‌دار)
10. **English Language Learning** (یادگیری زبان انگلیسی)
11. **Personal Brand** (برند شخصی)
12. **Authentic Self** - Almanack, Mastery Robert Greene (خود واقعی - اصالت)

**Career (13-15):**
13. **Content Creation** - Colin and Samir (تولید محتوا)
14. **AI Literacy** - The Coming Wave (سواد هوش مصنوعی)
15. **Agency - High Agency** (ایجِنسی - تفکر و کنش خودمختار)

**Core Concept:**
- **Compound Effect** (اثر مرکب) - The underlying principle connecting all skills

---

## Vision & Mission

### Mission Statement
Help people improve their quality of life, get closer to their dreams, achieve more useful longevity, and most importantly - better understand the value of time through the 15 essential skills ecosystem.

### Target Audience Progression
1. **Family** - Start with closest circle
2. **Close Friends** - Expand to trusted network
3. **LinkedIn Community** - Professional network
4. **Everyone** - Global audience

### Collaboration Goal
When MVP is ready, share with **Khashayar Talks** (YouTube channel: https://www.youtube.com/@KhashayarTalks) for feedback and potential collaboration to expand the platform together.

---

*This simplified PRD focuses on MVP: organizing and presenting content from one video in bilingual format (Persian/English). Future phases will expand to multiple videos, search, database, and "Connecting the Dots" features.*