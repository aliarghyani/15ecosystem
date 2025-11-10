// Type definitions for 15ecosystem

export interface Skill {
  id: number
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
  relatedSkills?: number[]
  tags?: string[] // Array of tag slugs
}

export interface Category {
  id: string
  name: {
    en: string
    fa: string
  }
  description: {
    en: string
    fa: string
  }
  skills: number[]
  tags?: string[] // Array of tag slugs
}

export interface Book {
  title: string
  author: string
  skillIds: number[]
  tags?: string[] // Array of tag slugs
}

export interface Writer {
  id: string // Unique identifier (slug-based)
  name: string // Full name
  slug: string // URL-friendly identifier
  photo?: string // URL to photo/avatar image
  tagline?: {
    en: string
    fa: string
  }
  biography: {
    en: string // Markdown or rich text
    fa: string
  }
  books: string[] // Array of book slugs
  skillIds: number[] // Skills related to this writer
  categoryIds: string[] // Categories this writer belongs to
  links: {
    youtube?: string
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    other?: Array<{ label: string; url: string }>
  }
  tags?: string[] // Array of tag slugs
}

export interface Tag {
  id: string // Unique identifier (slug-based)
  name: {
    en: string
    fa: string
  }
  slug: string // URL-friendly identifier
  description?: {
    en: string
    fa: string
  }
  color?: string // Hex color for visual distinction (optional, will use Nuxt UI colors)
  icon?: string // Optional icon identifier
  category?: 'skill' | 'book' | 'writer' | 'category' | 'general' // Tag category
}


