# 15ecosystem - PRD & Epics Review Summary

**Created:** November 6, 2025
**Status:** Ready for Review

---

## 📋 Quick Overview

**Project:** 15ecosystem - Content Showcase Platform
**MVP Scope:** Simplified - Single video content organization
**Languages:** Fully bilingual (Persian/English) with RTL-LTR support
**Tech Stack:** Nuxt 4 SSG, TypeScript, Tailwind CSS 4, Nuxt UI 4, @nuxtjs/i18n

---

## 🎯 Your Vision & Goals

### Mission
Help people improve their quality of life, get closer to their dreams, achieve more useful longevity, and **most importantly - better understand the value of time** through the 15 essential skills ecosystem.

### Target Audience Progression
1. **Family** - Start with closest circle
2. **Close Friends** - Expand to trusted network  
3. **LinkedIn Community** - Professional network
4. **Everyone** - Global audience

### Collaboration Goal
When MVP is ready, share with **Khashayar Talks** (https://www.youtube.com/@KhashayarTalks) for feedback and potential collaboration to expand the platform together.

---

## 📊 MVP Scope (Simplified)

### ✅ What's INCLUDED

**Core Features:**
- ✅ Landing page with introduction
- ✅ Two main category pages (Health 1-6, Identity/Career 7-15)
- ✅ 15 individual skill pages with content from video
- ✅ Full video transcript page
- ✅ Video summary page
- ✅ Books reference page (all books mentioned)
- ✅ Simple visual diagrams (category structure, skill relationships)
- ✅ **Fully bilingual** (Persian/English) with RTL-LTR support
- ✅ Language switcher in navigation
- ✅ Mobile-responsive design

**Content:**
- ✅ Single video: "15 Essential Skills for 2025"
- ✅ Content from: `youtubevideofulltext.yml` (transcript) and `summaryofyoutubevideofulltext.yml` (summary)
- ✅ All 15 skills with Persian content
- ✅ Book references for each skill
- ✅ Category organization

### ❌ What's EXCLUDED (Future Phases)

- ❌ Multiple videos
- ❌ Database
- ❌ User accounts/authentication
- ❌ Search functionality
- ❌ Community features
- ❌ Progress tracking
- ❌ "Connecting the Dots" feature (Steve Jobs concept)
- ❌ Interactive exercises
- ❌ User-generated content

---

## 📚 The 15 Skills (Verified)

### Health & Energy (Skills 1-6)
1. **Quality Sleep** (خواب باکیفیت)
2. **Focus - Deep Work** (تمرکز - کار عمیق)
3. **Dopamine Control** (کنترل دوپامین)
4. **Stress Control** (کنترل استرس)
5. **Mental Health & Longevity** (سلامت روان و طول عمر)
6. **Healthy Longevity** (طول عمر سالم)

### Identity, Purpose & Income (Skills 7-15)
7. **Creativity** (خلاقیت)
8. **Specific Knowledge** - Almanack Naval, Mastery Robert Greene (دانش تخصصی)
9. **Effective & Continuous Learning** - Art of Learning, Learning How to Learn (یادگیری مؤثر و ادامه‌دار)
10. **English Language Learning** (یادگیری زبان انگلیسی)
11. **Personal Brand** (برند شخصی)
12. **Authentic Self** - Almanack, Mastery Robert Greene (خود واقعی - اصالت)
13. **Content Creation** - Colin and Samir (تولید محتوا)
14. **AI Literacy** - The Coming Wave (سواد هوش مصنوعی)
15. **Agency - High Agency** (ایجِنسی - تفکر و کنش خودمختار)

**Core Concept:** **Compound Effect** (اثر مرکب) - The underlying principle connecting all skills

---

## 🏗️ Epic Breakdown (6 Epics, ~18 Stories)

### Epic 1: Foundation & Setup (2 stories)
- Project initialization with Nuxt 4, TypeScript, Tailwind, Nuxt UI
- **i18n setup** with Persian (RTL) and English (LTR)
- Content file structure

### Epic 2: Content Extraction (3 stories)
- Parse YAML source files (bilingual)
- Organize 15 skills content
- Extract book references

### Epic 3: Page Structure (3 stories)
- Landing page (bilingual)
- Category pages (Health, Identity/Career)
- 15 skill pages (bilingual)

### Epic 4: Content Pages (3 stories)
- Transcript page (full video transcript)
- Summary page (video summary)
- Books page (all book references)

### Epic 5: Visual Diagrams (2 stories)
- Category structure diagram
- Skill relationship diagram

### Epic 6: Navigation & Polish (5 stories)
- Main navigation menu (bilingual with language switcher)
- Breadcrumb navigation
- Skill navigation (previous/next)
- Mobile responsiveness
- Performance optimization

**Total Stories:** ~18 stories for MVP

---

## 🌐 Bilingual Support Details

### Technical Implementation
- **i18n Module:** @nuxtjs/i18n
- **Languages:** Persian (fa) - RTL, English (en) - LTR
- **Locale Files:** `locales/en.json`, `locales/fa.json`
- **Language Switcher:** Prominent in navigation
- **RTL/LTR Switching:** Automatic layout direction change

### Content Strategy
- **Source Content:** Persian (from video transcript/summary)
- **English Translations:** To be created/added during development
- **All Pages:** Available in both languages
- **Navigation:** Menu items translated
- **URLs:** Language prefix support (`/fa/` for Persian, `/` for English)

---

## 📁 Content Structure

### Source Files
- `docs/sources/youtubevideofulltext.yml` - Full video transcript (Persian)
- `docs/sources/summaryofyoutubevideofulltext.yml` - Video summary (Persian)
- `docs/sources/Steve Jobs - Connecting The Dots - Motivational Video.yml` - Future reference

### Content Organization
```
content/
  ├── skills/
  │   ├── 1-quality-sleep/
  │   ├── 2-focus/
  │   ├── ... (15 skills)
  ├── categories/
  │   ├── health-energy/
  │   └── identity-career/
  └── books/
      └── all-books.json
```

---

## 🎨 Key Features Summary

### Pages Structure
1. **Landing Page** (`/`)
   - Introduction to 15ecosystem
   - Overview of 15 skills
   - Visual category representation
   - Language switcher

2. **Category Pages** (`/categories/health-energy`, `/categories/identity-career`)
   - List of skills in category
   - Brief descriptions
   - Links to skill pages

3. **Skill Pages** (`/skills/[slug]`)
   - Skill number and name
   - "Why it matters" section
   - "How to" section
   - Book references
   - Navigation (previous/next)

4. **Transcript Page** (`/transcript`)
   - Full video transcript
   - Table of contents
   - Links to skill sections

5. **Summary Page** (`/summary`)
   - Complete video summary
   - Organized sections
   - Links to skills

6. **Books Page** (`/books`)
   - All books mentioned
   - Organized by skill/category
   - Links to related skills

---

## 🔧 Technical Architecture

### Frontend Stack
- **Framework:** Nuxt 4 (SSG mode)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Library:** Nuxt UI 4
- **i18n:** @nuxtjs/i18n
- **Content:** YAML files parsed at build time

### Deployment
- **Platform:** Vercel (static hosting)
- **Build:** Static site generation
- **No Database:** Content from YAML files
- **No Server:** Pure static site

### Performance Targets
- Page load: <2 seconds
- Navigation: <500ms
- Mobile-responsive
- SEO-friendly (SSG)

---

## ✅ Success Criteria

### Content Completeness
- ✅ All 15 skills documented
- ✅ All book references included
- ✅ Full transcript available
- ✅ Summary available
- ✅ Bilingual content (Persian + English)

### User Experience
- ✅ Easy navigation between skills
- ✅ Clear category organization
- ✅ Readable, well-formatted content
- ✅ Mobile-responsive
- ✅ Fast page loads
- ✅ Smooth language switching

---

## 🚀 Development Timeline Estimate

**Week 1-2: Foundation & Content**
- Project setup with i18n
- Parse YAML files
- Organize content structure

**Week 3: Pages & Structure**
- Create all pages (landing, categories, skills)
- Implement bilingual support
- Add navigation

**Week 4: Visuals & Polish**
- Create diagrams
- Mobile optimization
- Performance tuning
- Testing

**Total:** ~4 weeks for MVP

---

## 📝 Important Notes

### Content Translation
- **Current State:** Source content is in Persian
- **Action Needed:** English translations will need to be created/added
- **Strategy:** Can start with Persian-only, add English translations incrementally

### Future Expansion
- Multiple videos can be added later
- Database can be added for content management
- Search functionality can be added
- "Connecting the Dots" feature (Steve Jobs concept) for future
- Community features for future
- User accounts and progress tracking for future

### Collaboration with Khashayar Talks
- MVP will be shared when ready
- Potential collaboration for expansion
- Feedback and content validation opportunity

---

## 📄 Documents Created

1. **PRD.md** - Complete Product Requirements Document (539 lines)
2. **epics.md** - Epic and story breakdown (620 lines)
3. **product-brief-15ecosystem-2025-11-06.md** - Strategic product planning
4. **research-market-2025-11-06.md** - Market research
5. **bmm-brainstorming-session-2025-11-06.md** - Brainstorming results
6. **bmm-workflow-status.yaml** - Workflow tracking

---

## ❓ Questions for Review

1. **Content Translation:** Do you want to start with Persian-only and add English later, or create English translations from the start?

2. **Visual Diagrams:** What level of detail do you want in the diagrams? Simple boxes/arrows or more detailed visualizations?

3. **Book References:** Should books link to external sites (Amazon, etc.) or just display information?

4. **Skill Order:** Should skills be displayed in strict 1-15 order, or allow flexible ordering?

5. **Mobile Priority:** Is mobile-first approach important, or desktop-first acceptable?

6. **Deployment Timeline:** When do you want to share MVP with Khashayar Talks? (This helps prioritize features)

---

## ✨ Next Steps After Review

Once you've reviewed and approved:

1. **Proceed to Architecture** - Design technical system architecture
2. **Start Implementation** - Begin with Epic 1 (Foundation & Setup)
3. **Iterate** - Build, test, refine based on feedback

---

**Ready to proceed?** Let me know if you'd like to:
- Adjust any part of the PRD/epics
- Clarify any requirements
- Proceed to Architecture workflow
- Start implementation

