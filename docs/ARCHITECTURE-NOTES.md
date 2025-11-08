# 15ecosystem - Architecture Notes

**Component-Based, Expandable Architecture**

---

## Component Structure (Based on Portfolio)

Following the portfolio structure: https://github.com/aliarghyani/nuxt-portfolio

```
app/
  ├── components/
  │   ├── common/              # Shared UI components
  │   │   ├── TopNav.vue       # Main navigation with language switcher
  │   │   ├── Footer.vue       # Site footer
  │   │   ├── LanguageSwitcher.vue
  │   │   └── Breadcrumb.vue
  │   ├── skills/              # Skill-related components
  │   │   ├── SkillCard.vue    # Reusable skill card
  │   │   ├── SkillDetail.vue  # Skill detail view
  │   │   ├── SkillList.vue    # List of skills
  │   │   ├── SkillGrid.vue    # Grid layout for skills
  │   │   └── SkillNavigation.vue  # Prev/Next navigation
  │   ├── categories/          # Category components
  │   │   ├── CategoryCard.vue
  │   │   ├── CategoryGrid.vue
  │   │   └── CategoryFilter.vue
  │   ├── content/             # Content display components
  │   │   ├── TranscriptViewer.vue
  │   │   ├── SummaryViewer.vue
  │   │   ├── ContentSection.vue
  │   │   └── ContentViewer.vue
  │   ├── books/               # Book-related components
  │   │   ├── BookCard.vue
  │   │   ├── BooksGrid.vue
  │   │   └── BooksList.vue
  │   └── diagrams/            # Visual diagram components
  │       ├── CategoryDiagram.vue
  │       └── SkillRelationsDiagram.vue
  ├── composables/             # Reusable composables
  │   ├── useSkills.ts
  │   ├── useCategories.ts
  │   ├── useI18n.ts
  │   └── useContent.ts
  ├── utils/                   # Helper functions
  │   ├── content.ts
  │   └── formatting.ts
  ├── types/                   # TypeScript definitions
  │   ├── skill.ts
  │   ├── category.ts
  │   └── content.ts
  └── data/                    # Content data (separate EN/FA)
      ├── en/
      │   ├── skills.ts
      │   ├── categories.ts
      │   └── books.ts
      └── fa/
          ├── skills.ts
          ├── categories.ts
          └── books.ts
```

---

## Component Design Principles

### 1. Reusability
- Components are designed to be reused across pages
- Props-based configuration for flexibility
- No hardcoded content in components

### 2. Expandability
- Components accept optional props for future features
- Structure allows adding new props without breaking changes
- Components can be composed to create new features

### 3. Modern Design
- Clean, compact layouts
- Modern UI patterns (not traditional)
- Smooth animations and transitions
- Glassmorphism, subtle shadows, clean typography

### 4. Best Practices
- TypeScript strict mode
- Proper prop validation
- Accessibility (ARIA labels, semantic HTML)
- Performance optimized (lazy loading, code splitting)

---

## Three-Category Structure

### Category 1: Health (Skills 1-6)
- Quality Sleep
- Focus - Deep Work
- Dopamine Control
- Stress Control
- Mental Health & Meaningful Relationships
- Healthy Longevity

### Category 2: Identity (Skills 7-12)
- Creativity
- Specific Knowledge
- Effective & Continuous Learning
- English Language Learning
- Personal Brand
- Authentic Self

### Category 3: Career (Skills 13-15)
- Content Creation
- AI Literacy
- Agency - High Agency

---

## i18n Setup (Matching Portfolio)

**Strategy:** `prefix_except_default`
- English (en): Default, no prefix (`/`)
- Persian (fa): `/fa` prefix

**Locale Files:**
- `i18n/locales/en.json`
- `i18n/locales/fa.json`

**Content Data:**
- `app/data/en/` - English content
- `app/data/fa/` - Persian content

**RTL/LTR:**
- Automatic `dir` attribute switching
- Font: Vazirmatn (Persian), Roobert/system (English)

---

## Expandability Points

### Easy to Add:
1. **New Videos:** Add VideoCard, VideoList components
2. **Search:** Add SearchComponent, use existing components
3. **Database:** Components ready for data layer (just change data source)
4. **User Features:** Add UserProfile, ProgressTracker components
5. **Community:** Add ForumComponent, CommentComponent

### Component Composition:
- SkillCard + BookCard = SkillDetail page
- CategoryGrid + SkillCard = Category page
- ContentSection + SkillLink = Summary page

---

## Modern Design Standards

### Visual Design:
- **Not Traditional:** Modern, compact, clean
- **Spacing:** Generous but compact
- **Typography:** Clear hierarchy, readable fonts
- **Colors:** Modern palette, proper contrast
- **Shadows:** Subtle, modern depth
- **Animations:** Smooth, purposeful

### UI/UX Standards:
- **Accessibility:** WCAG AA compliance
- **Performance:** Lighthouse 90+ scores
- **Mobile-First:** Responsive, touch-friendly
- **Loading States:** Skeleton screens, smooth transitions
- **Error Handling:** User-friendly error messages

---

## Code Quality Standards

### Development:
- TypeScript strict mode
- ESLint configuration (matching portfolio)
- Prettier formatting
- Component documentation
- Type definitions for all data

### Testing Ready:
- Components are testable (props-based)
- Structure allows unit testing
- Integration testing ready

---

## Future Expansion Examples

### Adding Search:
```typescript
// New component: SearchComponent.vue
// Uses existing: SkillCard, CategoryCard
// New composable: useSearch.ts
```

### Adding Database:
```typescript
// Change data source in composables
// Components remain the same
// useSkills.ts: fetch from API instead of static data
```

### Adding User Features:
```typescript
// New components: UserProfile, ProgressTracker
// Uses existing: SkillCard, CategoryCard
// New composable: useUser.ts
```

---

*This architecture ensures the platform is built for expansion, not just MVP.*
