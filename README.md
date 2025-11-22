# 15ecosystem

An interactive educational platform based on the YouTube video "15 Essential Skills for 2025" - helping people learn and grow through visual effects and bilingual content.

## 🌐 Project Overview

**15ecosystem** is a modern, bilingual (Persian/English) web platform that presents 15 essential skills organized into three categories:
- **Health** (Skills 1-6): Quality Sleep, Focus, Dopamine Control, Stress Control, Mental Health, Healthy Longevity
- **Identity** (Skills 7-12): Creativity, Specific Knowledge, Learning, English, Personal Brand, Authentic Self
- **Career** (Skills 13-15): Content Creation, AI Literacy, Agency

## 🚀 Tech Stack

- **Framework:** Nuxt 4 (SSG mode)
- **UI Library:** Nuxt UI 4
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript (strict mode)
- **i18n:** @nuxtjs/i18n (`prefix_except_default` strategy)
- **Images:** @nuxt/image
- **Theme:** @nuxtjs/color-mode
- **Package Manager:** pnpm
- **Deployment:** Vercel (static hosting)

## 📋 Prerequisites

- **Node.js:** 18.20.0 or newer (up to 22.x)
- **pnpm:** Latest version (recommended) or npm
- **Git:** Latest version

## 🛠️ Setup

### Install Dependencies

```bash
pnpm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Build for Production

Build the application for production (SSG):

```bash
pnpm build
```

The static files will be generated in `.output/public/` directory.

### Generate Static Site

For pure static site generation:

```bash
pnpm generate
```

### Preview Production Build

Locally preview the production build:

```bash
pnpm preview
```

## 🧪 Code Quality

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Formatting

Check formatting:

```bash
pnpm format
```

Format code:

```bash
pnpm format:write
```

## 🌍 Internationalization

The platform supports two languages:
- **English (en):** Default language, no URL prefix
- **Persian (fa):** Available at `/fa` prefix, RTL layout

### Language Switching

The language switcher component is available in the navigation. Routes automatically respect the `prefix_except_default` strategy:
- English: `/` (default)
- Persian: `/fa/`

### Locale Files

Translation files are located in:
- `i18n/locales/en.json` - English translations
- `i18n/locales/fa.json` - Persian translations

## 📁 Project Structure

```
15ecosystem/
├── app/
│   ├── components/      # Vue components
│   │   ├── common/      # Shared components (LanguageSwitcher, etc.)
│   │   ├── skills/      # Skill-related components
│   │   ├── categories/  # Category components
│   │   ├── content/     # Content display components
│   │   └── diagrams/    # Visual diagram components
│   ├── composables/     # Reusable composables (auto-imported)
│   ├── pages/           # File-based routing
│   ├── assets/          # CSS and static assets
│   ├── data/           # Content data files (separate EN/FA)
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions (auto-imported)
├── i18n/
│   └── locales/        # Translation files (en.json, fa.json)
├── public/             # Static assets (images, fonts, favicons)
├── docs/               # Documentation and project files
└── nuxt.config.ts      # Nuxt configuration
```

## 🎨 Design System

- **Modern, compact design** (not traditional)
- **Fully responsive** with mobile-first approach
- **Dark mode support** via @nuxtjs/color-mode
- **RTL/LTR support** for bilingual experience
- **Accessibility:** WCAG AA compliance

## 🚢 Deployment

The project is configured for deployment on **Vercel**:

1. Push code to your Git repository
2. Connect repository to Vercel
3. Vercel will automatically detect Nuxt and build the static site
4. Static files are served from `.output/public/`

### Build Configuration

- **Build Command:** `pnpm build`
- **Output Directory:** `.output/public`
- **Framework:** Nuxt.js

See `vercel.json` for deployment configuration.

## 📚 Documentation

- **Architecture:** `docs/architecture.md`
- **Product Requirements:** `docs/PRD.md`
- **Epics & Stories:** `docs/epics.md`
- **Workflow Status:** `docs/bmm-workflow-status.yaml`
- **Sprint Status:** `docs/sprint-status.yaml`

## 🔗 Reference Architecture

This project follows the structure and patterns from:
- [nuxt-portfolio](https://github.com/aliarghyani/nuxt-portfolio)

## YouTube Integration

This project integrates with the YouTube Data API v3 to fetch channel information and videos.

### Setup

1. Get a YouTube Data API v3 key from Google Cloud Console.
2. Create a `.env` file in the root directory (see `.env.example`):
   ```
   NUXT_YOUTUBE_API_KEY=your_api_key
   NUXT_YOUTUBE_CHANNEL_HANDLES=@YourChannelHandle
   ```

### API Endpoints

Internal API routes are available at `/api/youtube/*`:

- `GET /api/youtube/channel?handle=@handle`: Get channel details.
- `GET /api/youtube/playlists?handle=@handle`: Get playlists.
- `GET /api/youtube/uploads?handle=@handle`: Get latest uploads.
- `GET /api/youtube/videos?ids=id1,id2`: Get video details.

### Development

Visit `/dev/youtube` to test the integration.

## 📝 License

Private project - All rights reserved

## 👤 Author

ali

---

Built with ❤️ using Nuxt 4 and modern web technologies.
