export interface Tag {
  id: string
  name: {
    en: string
    fa: string
  }
  slug: string
  description?: {
    en: string
    fa: string
  }
  color?: string
  icon?: string
  category?: 'skill' | 'book' | 'writer' | 'category' | 'general'
}
