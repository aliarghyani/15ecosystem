export interface Writer {
  id: string
  name: string
  slug: string
  photo?: string
  tagline?: {
    en: string
    fa: string
  }
  biography: {
    en: string
    fa: string
  }
  books: string[]
  skillIds: number[]
  categoryIds: string[]
  links: {
    youtube?: string
    website?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    other?: Array<{ label: string; url: string }>
  }
  tags?: string[]
}
