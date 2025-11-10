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
}

export interface Book {
  title: string
  author: string
  skillIds: number[]
}


