import type { Book } from './book'

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
  tags?: string[]
}
