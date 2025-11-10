# Story 6.1: Main Navigation Menu (Bilingual)

**Epic:** Epic 6 - Navigation & Polish  
**Status:** done  
**Story ID:** 6-1-main-navigation-menu-bilingual

## User Story

As a user,
I want a clear navigation menu in my language,
So that I can easily move between sections.

## Acceptance Criteria

**Given** I am on any page
**When** I see the navigation
**Then** I see:
- ✅ Main menu: Home, Categories, Skills, Transcript, Summary, Books (in selected language)
- ✅ Language switcher (Persian/English) prominently displayed
- ✅ Active page highlighted
- ✅ Mobile hamburger menu
- ✅ Smooth navigation transitions
- ✅ Proper RTL/LTR layout based on language

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

## Technical Implementation

### Component: `app/components/common/TopNav.vue`

**Features Implemented:**
- ✅ Desktop navigation with all menu items visible
- ✅ Mobile hamburger menu with dropdown
- ✅ Active page highlighting
- ✅ Language switcher integration
- ✅ Theme customizer integration
- ✅ Smooth transitions for mobile menu
- ✅ Auto-close mobile menu on route change
- ✅ Auto-close mobile menu on outside click
- ✅ RTL/LTR support based on locale
- ✅ Touch-friendly mobile buttons (44x44px minimum)

**Mobile Menu Behavior:**
- Hamburger icon (bars) when closed
- X icon when open
- Smooth slide-down animation
- All navigation items accessible in mobile menu
- Menu closes automatically when navigating

## Tasks

- [x] Add mobile hamburger menu button
- [x] Create mobile menu dropdown with all navigation items
- [x] Add smooth transitions for mobile menu
- [x] Implement auto-close on route change
- [x] Implement auto-close on outside click
- [x] Add translation keys for menu open/close
- [x] Test mobile navigation functionality
- [x] Verify RTL/LTR layout works correctly
- [x] Ensure touch-friendly button sizes

## Technical Notes

### File Locations
- Navigation component: `app/components/common/TopNav.vue`
- Translations: `i18n/locales/en.json`, `i18n/locales/fa.json`
- Language switcher: `app/components/LanguageSwitcher.vue`
- Theme customizer: `app/components/common/ThemeCustomizer.vue`

### Responsive Breakpoints
- Desktop: `lg:` breakpoint and above (1024px+)
- Mobile: Below `lg:` breakpoint (<1024px)

### Mobile Menu Features
- Uses Vue `Transition` component for smooth animations
- State managed with `ref(false)` for `isMobileMenuOpen`
- Closes automatically on navigation
- Closes on outside click via event listener

## Dependencies

- Story 3.1: Landing Page (navigation links)
- Story 4.1: Transcript Page (navigation link)
- Language switcher component (already exists)
- Theme customizer component (already exists)

## Success Criteria

- ✅ All navigation items visible and functional
- ✅ Mobile hamburger menu works smoothly
- ✅ Active page highlighting works correctly
- ✅ Language switching updates navigation labels
- ✅ RTL/LTR layout switches correctly
- ✅ Touch-friendly on mobile devices
- ✅ Smooth transitions and animations

## Notes

- Navigation was already mostly implemented
- Added mobile hamburger menu to complete Story 6.1 requirements
- All acceptance criteria met

