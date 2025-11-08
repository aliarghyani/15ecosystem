# 15ecosystem - Architecture Document

**Author:** ali  
**Date:** November 6, 2025  
**Version:** 1.0

---

## Executive Summary

15ecosystem is a component-based, expandable static web platform built with Nuxt 4 SSG, matching the portfolio architecture. The platform organizes and presents "15 Essential Skills for 2025" content in three categories (Health, Identity, Career) with full bilingual support (Persian/English) and modern design standards. Architecture emphasizes component reusability, expandability for future features, and production-ready code quality.

---

## Project Initialization

**Reference Architecture:** https://github.com/aliarghyani/nuxt-portfolio

**Initialization Approach:** Manual setup matching portfolio structure (not using generic Nuxt starter)

**First Implementation Story:** Story 1.1 - Project Setup with i18n

**Setup Command:**
```bash
# Initialize Nuxt 4 project
npx nuxi@latest init 15ecosystem

# Install dependencies
cd 15ecosystem
pnpm install nuxt@latest @nuxt/ui@latest @nuxtjs/i18n@latest @nuxt/image@latest @nuxtjs/color-mode@latest tailwindcss@latest typescript@latest

# Configure for SSG mode
# Update nuxt.config.ts with SSG configuration
```

**Portfolio-Provided Decisions:**
- Project structure: `app/` directory pattern
- Component organization: Feature-based subdirectories
- i18n strategy: `prefix_except_default`
- Styling approach: Tailwind CSS 4 with Nuxt UI 4
- TypeScript: Strict mode
- Build tool: Vite (via Nuxt)
- Package manager: pnpm

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Framework** | Nuxt 4 (SSG) | Latest stable | All | Static site generation, matches portfolio, excellent i18n support |
| **UI Library** | Nuxt UI 4 | Latest stable | Epic 3, 4, 5, 6 | Modern components, Tailwind integration, RTL support |
| **Styling** | Tailwind CSS 4 | Latest stable | All | Utility-first, matches portfolio, modern design system |
| **Language** | TypeScript | Latest stable | All | Type safety, matches portfolio, production-ready |
| **i18n** | @nuxtjs/i18n | Latest stable | All | Bilingual support, RTL/LTR, matches portfolio strategy |
| **Content** | YAML → TypeScript | Build-time | Epic 2 | No runtime database needed, expandable to CMS later |
| **Images** | @nuxt/image | Latest stable | Epic 3, 5 | Optimized images, lazy loading, performance |
| **Theme** | @nuxtjs/color-mode | Latest stable | Epic 6 | Dark/light mode support, matches portfolio |
| **Deployment** | Vercel (Static) | - | All | SSG hosting, matches portfolio, zero-config |
| **Code Quality** | ESLint + Prettier | Latest stable | All | Consistent code, matches portfolio standards |
| **Component Pattern** | Feature-based | - | All | Organized by domain (skills/, categories/, content/) |
| **Content Structure** | 3 Categories | - | Epic 2, 3 | Health (1-6), Identity (7-12), Career (13-15) |
| **Fonts** | Vazirmatn (FA) + Roobert/System (EN) | - | All | Proper Persian/English font support |
| **Build Tool** | Vite (via Nuxt) | Latest stable | All | Fast builds, HMR, matches Nuxt defaults |

---

## Project Structure

```
15ecosystem/
├── app/                          # Source directory (Nuxt 4 app/ pattern)
│   ├── app.vue                   # Root component
│   ├── app.config.ts             # Nuxt UI theme tokens
│   ├── error.vue                 # Error page (404, 500)
│   ├── assets/
│   │   └── css/                  # Global styles, Tailwind imports
│   ├── components/               # Auto-imported components
│   │   ├── common/               # Shared UI components
│   │   │   ├── TopNav.vue        # Main navigation with language switcher
│   │   │   ├── Footer.vue        # Site footer
│   │   │   ├── LanguageSwitcher.vue
│   │   │   └── Breadcrumb.vue
│   │   ├── skills/               # Skill-related components
│   │   │   ├── SkillCard.vue     # Reusable skill card
│   │   │   ├── SkillDetail.vue   # Skill detail view
│   │   │   ├── SkillList.vue     # List of skills
│   │   │   ├── SkillGrid.vue     # Grid layout for skills
│   │   │   └── SkillNavigation.vue  # Prev/Next navigation
│   │   ├── categories/           # Category components
│   │   │   ├── CategoryCard.vue
│   │   │   ├── CategoryGrid.vue
│   │   │   └── CategoryFilter.vue
│   │   ├── content/              # Content display components
│   │   │   ├── TranscriptViewer.vue
│   │   │   ├── SummaryViewer.vue
│   │   │   ├── ContentSection.vue
│   │   │   └── ContentViewer.vue
│   │   ├── books/                # Book-related components
│   │   │   ├── BookCard.vue
│   │   │   ├── BooksGrid.vue
│   │   │   └── BooksList.vue
│   │   └── diagrams/             # Visual diagram components
│   │       ├── CategoryDiagram.vue
│   │       └── SkillRelationsDiagram.vue
│   ├── composables/              # Auto-imported composables
│   │   ├── useSkills.ts          # Skill data and operations
│   │   ├── useCategories.ts      # Category data and operations
│   │   ├── useI18n.ts            # i18n helpers
│   │   └── useContent.ts         # Content parsing and formatting
│   ├── utils/                     # Helper functions (auto-imported)
│   │   ├── content.ts            # Content parsing utilities
│   │   └── formatting.ts         # Text formatting helpers
│   ├── types/                     # TypeScript definitions
│   │   ├── skill.ts              # Skill type definitions
│   │   ├── category.ts           # Category type definitions
│   │   └── content.ts            # Content type definitions
│   ├── data/                      # Content data (separate EN/FA)
│   │   ├── en/
│   │   │   ├── skills.ts         # English skill data
│   │   │   ├── categories.ts     # English category data
│   │   │   └── books.ts          # English book data
│   │   └── fa/
│   │       ├── skills.ts         # Persian skill data
│   │       ├── categories.ts     # Persian category data
│   │       └── books.ts          # Persian book data
│   ├── layouts/                   # Layout components
│   │   └── default.vue           # Default layout
│   ├── middleware/                # Route middleware
│   ├── pages/                     # File-based routing
│   │   ├── index.vue             # Landing page
│   │   ├── categories/
│   │   │   └── [slug].vue        # Dynamic category pages
│   │   ├── skills/
│   │   │   └── [slug].vue        # Dynamic skill pages
│   │   ├── transcript.vue         # Full transcript page
│   │   ├── summary.vue           # Summary page
│   │   └── books.vue             # Books reference page
│   ├── plugins/                   # Nuxt plugins
│   └── public/                    # Static assets
│       ├── favicon/
│       ├── fonts/                 # Local fonts (Vazirmatn, Roobert)
│       └── img/                   # Images
├── i18n/                          # Internationalization
│   ├── locales/
│   │   ├── en.json               # English translations
│   │   └── fa.json               # Persian translations
│   └── config.ts                  # i18n configuration
├── docs/                          # Documentation
│   ├── sources/                   # Source YAML files
│   │   ├── youtubevideofulltext.yml
│   │   └── summaryofyoutubevideofulltext.yml
│   ├── PRD.md
│   ├── epics.md
│   └── architecture.md
├── .output/                       # Build output (SSG)
│   └── public/                    # Static files for deployment
├── nuxt.config.ts                 # Nuxt configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind configuration
├── .eslintrc.cjs                  # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## Epic to Architecture Mapping

| Epic | Architecture Location | Components | Data Source |
| ---- | --------------------- | ---------- | ----------- |
| **Epic 1: Foundation & Setup** | `app/`, `nuxt.config.ts`, `i18n/` | Setup only | Configuration files |
| **Epic 2: Content Extraction** | `app/utils/content.ts`, `app/data/` | Content parsers | YAML source files |
| **Epic 3: Page Structure** | `app/pages/`, `app/components/skills/`, `app/components/categories/` | SkillCard, SkillDetail, CategoryGrid | `app/data/en/`, `app/data/fa/` |
| **Epic 4: Content Pages** | `app/pages/transcript.vue`, `app/pages/summary.vue`, `app/pages/books.vue` | TranscriptViewer, SummaryViewer, BooksGrid | `app/data/` |
| **Epic 5: Visual Diagrams** | `app/components/diagrams/` | CategoryDiagram, SkillRelationsDiagram | `app/data/` |
| **Epic 6: Navigation & Polish** | `app/components/common/`, `app/layouts/` | TopNav, Footer, Breadcrumb, LanguageSwitcher | `i18n/locales/` |

---

## Technology Stack Details

### Core Technologies

**Nuxt 4 (SSG Mode)**
- Version: Latest stable (verify via `npm view nuxt version`)
- Configuration: `nuxt.config.ts` with `ssr: false` or `nitro.prerender.routes`
- Features: Auto-imports, file-based routing, SSG optimization
- Reference: Portfolio structure

**Nuxt UI 4**
- Version: Latest stable (verify via `npm view @nuxt/ui version`)
- Configuration: Theme tokens in `app.config.ts`
- Features: Component library, Tailwind integration, RTL support
- Usage: All UI components (cards, buttons, navigation)

**Tailwind CSS 4**
- Version: Latest stable (verify via `npm view tailwindcss version`)
- Configuration: `tailwind.config.ts` with custom utilities
- Features: Utility-first styling, custom variants, RTL support
- Usage: All styling, responsive design

**TypeScript**
- Version: Latest stable (verify via `npm view typescript version`)
- Configuration: `tsconfig.json` with strict mode
- Features: Type safety, IntelliSense, compile-time checks
- Usage: All `.ts` and `.vue` files

**@nuxtjs/i18n**
- Version: Latest stable (verify via `npm view @nuxtjs/i18n version`)
- Configuration: `i18n.config.ts` with `prefix_except_default` strategy
- Locales: `en` (default, no prefix), `fa` (`/fa` prefix)
- Features: RTL/LTR switching, locale detection, SEO support

**@nuxt/image**
- Version: Latest stable
- Configuration: `nuxt.config.ts`
- Features: Image optimization, lazy loading, responsive images
- Usage: All images in components

### Integration Points

**Component → Data Flow:**
- Components (`app/components/`) → Composables (`app/composables/`) → Data (`app/data/`)
- Pages (`app/pages/`) → Components → Composables → Data

**i18n Integration:**
- Components use `useI18n()` composable
- Pages use `$t()` for translations
- Data files separate EN/FA in `app/data/en/` and `app/data/fa/`

**Content Parsing:**
- YAML files (`docs/sources/`) → Parsed at build time → TypeScript data files (`app/data/`)
- Build script: `app/utils/content.ts` processes YAML → generates TypeScript files

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

**Components:**
- PascalCase: `SkillCard.vue`, `CategoryGrid.vue`
- File names match component names exactly
- Feature-based organization: `components/skills/SkillCard.vue`

**Composables:**
- camelCase with "use" prefix: `useSkills.ts`, `useCategories.ts`
- File names match composable names exactly

**Pages:**
- kebab-case for routes: `categories/[slug].vue` → `/categories/health`
- Dynamic routes use `[param].vue` syntax

**Types:**
- PascalCase: `Skill`, `Category`, `Book`
- Defined in `app/types/` directory

**Data Files:**
- camelCase: `skills.ts`, `categories.ts`
- Organized by language: `app/data/en/skills.ts`

### Structure Patterns

**Component Organization:**
- By feature/domain: `components/skills/`, `components/categories/`
- Shared components: `components/common/`
- No co-location of unrelated components

**Test Organization:**
- Tests co-located with components: `SkillCard.vue` → `SkillCard.test.ts` (future)
- Or in `__tests__/` directories (future)

**Utility Functions:**
- In `app/utils/` directory
- Auto-imported by Nuxt
- One file per concern: `content.ts`, `formatting.ts`

### Format Patterns

**Component Props:**
```typescript
interface SkillCardProps {
  skill: Skill
  showDescription?: boolean
  variant?: 'default' | 'compact'
}
```

**Data Structures:**
```typescript
interface Skill {
  id: number
  slug: string
  name: {
    en: string
    fa: string
  }
  category: 'health' | 'identity' | 'career'
  whyItMatters: {
    en: string
    fa: string
  }
  howTo: {
    en: string
    fa: string
  }
  books: Book[]
  relatedSkills: number[]
}
```

**API Responses (Future):**
- Not applicable for MVP (static content)
- Future: Standard format `{ data: T, error?: Error }`

### Communication Patterns

**Component Props:**
- Props passed down, events emitted up
- No prop drilling beyond 2 levels
- Use composables for shared state

**Composables:**
- Return reactive refs/computed
- Example: `const { skills, getSkillBySlug } = useSkills()`

**Event Handling:**
- Use Vue 3 `@click`, `@change` syntax
- Event names: kebab-case: `@skill-selected`, `@language-changed`

### Lifecycle Patterns

**Loading States:**
- Use Nuxt UI `USkeleton` component
- Show skeleton while data loads
- No loading spinners (use skeletons)

**Error Handling:**
- Use Nuxt UI `UAlert` for errors
- Error messages from `i18n/locales/`
- Fallback to error page for critical errors

**Data Fetching:**
- All data from `app/data/` (static)
- Use `useAsyncData` for future API calls
- No runtime data fetching in MVP

### Location Patterns

**Routes:**
- `/` - Landing page
- `/categories/[slug]` - Category pages (health, identity, career)
- `/skills/[slug]` - Skill pages
- `/transcript` - Transcript page
- `/summary` - Summary page
- `/books` - Books page
- `/fa/*` - Persian versions (i18n prefix)

**Static Assets:**
- Images: `public/img/`
- Fonts: `public/fonts/`
- Favicons: `public/favicon/`

**Configuration:**
- Nuxt config: `nuxt.config.ts`
- TypeScript: `tsconfig.json`
- Tailwind: `tailwind.config.ts`
- ESLint: `.eslintrc.cjs`
- Prettier: `.prettierrc`

### Consistency Patterns

**Date Formatting:**
- Not applicable for MVP (no dates in content)
- Future: Use `Intl.DateTimeFormat` with locale

**Logging:**
- Use `console.log` for development
- Future: Structured logging library

**User-Facing Errors:**
- Translated via i18n: `$t('errors.notFound')`
- Stored in `i18n/locales/en.json` and `i18n/locales/fa.json`

---

## Consistency Rules

### Naming Conventions

**Components:** PascalCase (`SkillCard.vue`)
**Composables:** camelCase with "use" prefix (`useSkills.ts`)
**Pages:** kebab-case for routes (`categories/[slug].vue`)
**Types:** PascalCase (`Skill`, `Category`)
**Data Files:** camelCase (`skills.ts`)
**Constants:** UPPER_SNAKE_CASE (`MAX_SKILLS = 15`)

### Code Organization

**Component Structure:**
```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
// Imports
// Props
// Composables
// Computed
// Methods
</script>

<style scoped>
/* Component styles */
</style>
```

**Composable Structure:**
```typescript
export const useSkills = () => {
  // State
  // Computed
  // Methods
  return {
    // Public API
  }
}
```

### Error Handling

**Component Errors:**
- Use Nuxt UI `UAlert` component
- Error messages from i18n
- Fallback to default error message

**Build Errors:**
- TypeScript errors block build
- ESLint warnings shown, errors block build
- Prettier formatting enforced

### Logging Strategy

**Development:**
- `console.log` for debugging
- Remove before commit

**Production:**
- No console logs
- Future: Structured logging

---

## Data Architecture

### Content Models

**Skill Model:**
```typescript
interface Skill {
  id: number                    // 1-15
  slug: string                  // 'quality-sleep', 'focus-deep-work'
  name: {
    en: string
    fa: string
  }
  category: 'health' | 'identity' | 'career'
  whyItMatters: {
    en: string
    fa: string
  }
  howTo: {
    en: string
    fa: string
  }
  books: Book[]
  relatedSkills: number[]       // IDs of related skills
}
```

**Category Model:**
```typescript
interface Category {
  slug: 'health' | 'identity' | 'career'
  name: {
    en: string
    fa: string
  }
  description: {
    en: string
    fa: string
  }
  skillIds: number[]            // 1-6, 7-12, 13-15
}
```

**Book Model:**
```typescript
interface Book {
  id: string                    // Unique identifier
  title: {
    en: string
    fa: string
  }
  author: {
    en: string
    fa: string
  }
  skillIds: number[]            // Which skills reference this book
  category: 'health' | 'identity' | 'career'
}
```

### Data Relationships

- **Category → Skills:** One-to-many (1 category has many skills)
- **Skill → Books:** Many-to-many (skills reference multiple books, books referenced by multiple skills)
- **Skill → Related Skills:** Many-to-many (skills can relate to other skills)

### Data Storage

**MVP:**
- Static TypeScript files in `app/data/en/` and `app/data/fa/`
- Parsed from YAML at build time
- No runtime database

**Future:**
- Database for dynamic content
- CMS integration
- User-generated content

---

## API Contracts

**Not Applicable for MVP** - Static content site, no API endpoints.

**Future API Structure (for reference):**
- REST API endpoints
- Response format: `{ data: T, error?: Error }`
- Error format: `{ message: string, code: string }`
- Status codes: 200 (success), 400 (bad request), 404 (not found), 500 (server error)

---

## Security Architecture

**MVP Security:**
- Static site (no server-side vulnerabilities)
- No user authentication (no auth vulnerabilities)
- No user input (no injection vulnerabilities)
- Content Security Policy (CSP) headers via Vercel
- HTTPS enforced (Vercel default)

**Future Security Considerations:**
- User authentication (when added)
- Input validation (when forms added)
- Rate limiting (when API added)
- CORS configuration (when API added)

---

## Performance Considerations

**SSG Optimization:**
- All pages pre-rendered at build time
- No runtime rendering overhead
- Static assets cached by CDN (Vercel)

**Image Optimization:**
- `@nuxt/image` for lazy loading
- Responsive images with `srcset`
- WebP format preferred
- Image compression at build time

**Code Splitting:**
- Automatic via Nuxt/Vite
- Components lazy-loaded when possible
- Route-based code splitting

**Performance Targets:**
- Initial load: <1.5 seconds
- Navigation: <300ms
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- SEO Score: 90+

**Caching Strategy:**
- Static assets: Long-term cache (1 year)
- HTML pages: Short-term cache (1 hour)
- CDN caching via Vercel

---

## Deployment Architecture

**Platform:** Vercel (Static Hosting)

**Build Process:**
1. Install dependencies: `pnpm install`
2. Parse YAML content → TypeScript data files
3. Build Nuxt SSG: `pnpm build`
4. Generate static files: `.output/public/`
5. Deploy to Vercel CDN

**Deployment Configuration:**
- `vercel.json` for routing rules
- Environment variables: None for MVP
- Build command: `pnpm build`
- Output directory: `.output/public`

**Domain:**
- Custom domain support (future)
- SSL/TLS: Automatic via Vercel

---

## Development Environment

### Prerequisites

- **Node.js:** 18.20.0 or newer (up to 22.x)
- **pnpm:** Latest version (recommended) or npm
- **Git:** Latest version
- **Code Editor:** VS Code (recommended) with Vue/TypeScript extensions

### Setup Commands

```bash
# Clone repository (when created)
git clone <repository-url>
cd 15ecosystem

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format
```

### Development Workflow

1. **Content Updates:**
   - Edit YAML files in `docs/sources/`
   - Run build script to regenerate TypeScript data files
   - Or manually update `app/data/en/` and `app/data/fa/`

2. **Component Development:**
   - Create components in `app/components/`
   - Use auto-imports (no explicit imports needed)
   - Follow component patterns from portfolio

3. **Page Development:**
   - Create pages in `app/pages/`
   - Use file-based routing
   - Leverage components and composables

4. **Testing:**
   - Manual testing in development
   - Future: Unit tests, E2E tests

---

## Architecture Decision Records (ADRs)

### ADR-001: Component-Based Architecture

**Decision:** Use fully component-based architecture matching portfolio structure.

**Rationale:** 
- Enables easy expansion for future features
- Promotes code reusability
- Matches portfolio patterns for consistency
- Production-ready approach

**Consequences:**
- More initial setup, but easier maintenance
- Components can be reused across pages
- Easy to add new features without refactoring

### ADR-002: Three-Category Structure

**Decision:** Organize skills into three categories (Health, Identity, Career) instead of two.

**Rationale:**
- Better logical grouping (Identity separate from Career)
- Clearer user navigation
- More intuitive content organization

**Consequences:**
- Category pages need to handle 3 categories
- Navigation structure updated
- Visual diagrams show 3 categories

### ADR-003: Portfolio Structure Reference

**Decision:** Match portfolio project structure exactly.

**Rationale:**
- Consistency across projects
- Proven architecture
- Familiar patterns for developer

**Consequences:**
- Easy to maintain both projects
- Shared knowledge and patterns
- Consistent developer experience

### ADR-004: Static Content (No Database)

**Decision:** Use static TypeScript data files instead of database for MVP.

**Rationale:**
- No runtime database needed
- Faster builds and deployments
- Simpler architecture for MVP
- Expandable to database later

**Consequences:**
- Content updates require rebuild
- No dynamic content in MVP
- Easy to migrate to database later

### ADR-005: Bilingual Support from Start

**Decision:** Implement full Persian/English support with RTL/LTR from MVP.

**Rationale:**
- Core requirement for target audience
- Easier to implement from start than retrofit
- Matches portfolio approach

**Consequences:**
- All content must be bilingual
- Components must support RTL/LTR
- More initial work, but better UX

---

## Future Expansion Points

### Easy Additions (Component Structure Ready)

1. **Multiple Videos:**
   - Add `VideoCard`, `VideoList` components
   - Extend data structure
   - No major refactoring needed

2. **Search Functionality:**
   - Add `SearchComponent`
   - Use existing `SkillCard`, `CategoryCard`
   - Add `useSearch` composable

3. **Database Integration:**
   - Change data source in composables
   - Components remain unchanged
   - Add API layer

4. **User Features:**
   - Add `UserProfile`, `ProgressTracker` components
   - Extend with authentication
   - Use existing component patterns

5. **Community Features:**
   - Add `ForumComponent`, `CommentComponent`
   - Extend with backend API
   - Use existing UI patterns

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_  
_Date: November 6, 2025_  
_For: ali_

