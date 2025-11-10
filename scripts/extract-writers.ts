/**
 * Script to extract unique writers from books data
 * This generates initial writers data structure
 */

import { books } from '../app/data/en/books'
import { getBookSlug } from '../app/utils/books'
import { getSkillById } from '../app/utils/skills'
import { getAllCategories } from '../app/utils/categories'
import type { Writer } from '../app/types'

// Extract unique authors
const uniqueAuthors = new Set(books.map(book => book.author))
const authors = Array.from(uniqueAuthors).sort()

// Generate writers data
const writers: Writer[] = authors.map((author) => {
  // Get all books by this author
  const authorBooks = books.filter(book => book.author === author)
  
  // Get all skill IDs from author's books
  const skillIds = new Set<number>()
  authorBooks.forEach(book => {
    book.skillIds.forEach(skillId => skillIds.add(skillId))
  })
  
  // Get category IDs from skills
  const categoryIds = new Set<string>()
  Array.from(skillIds).forEach(skillId => {
    const skill = getSkillById(skillId, 'fa')
    if (skill) {
      categoryIds.add(skill.category)
    }
  })
  
  // Generate book slugs
  const bookSlugs = authorBooks.map(book => getBookSlug(book.title, book.author))
  
  // Generate writer slug
  const slug = author
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return {
    id: slug,
    name: author,
    slug: slug,
    biography: {
      en: `Biography for ${author} - to be added`,
      fa: `زندگینامه ${author} - در حال افزودن`
    },
    books: bookSlugs,
    skillIds: Array.from(skillIds),
    categoryIds: Array.from(categoryIds),
    links: {}
  }
})

// Output TypeScript code
console.log('// Writers data - Auto-generated from books')
console.log('// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/extract-writers.ts')
console.log('')
console.log('import type { Writer } from \'~/types\'')
console.log('')
console.log('export const writers: Writer[] = ' + JSON.stringify(writers, null, 2))

