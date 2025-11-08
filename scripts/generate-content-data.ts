/**
 * Script to parse YAML source files and generate TypeScript data files
 * Run with: pnpm tsx scripts/generate-content-data.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import {
  parseTranscript,
  parseSkillsFromSummary,
  parseCategories,
  parseSummary,
  collectAllBooks,
  addRelatedSkills,
} from '../app/utils/content'
import type { Skill, Category } from '../app/types'

// Generate Persian (fa) data files
console.log('📖 Parsing source files...')

const transcriptFa = parseTranscript()
const summaryFa = parseSummary()
let skillsFa = parseSkillsFromSummary()
// Add related skills connections
skillsFa = addRelatedSkills(skillsFa)
const categoriesFa = parseCategories(skillsFa)
const booksFa = collectAllBooks(skillsFa)

console.log(`✅ Parsed ${skillsFa.length} skills`)
console.log(`✅ Parsed ${categoriesFa.length} categories`)
console.log(`✅ Parsed ${booksFa.length} unique books`)

// Generate Persian skills data
const skillsFaContent = `// Persian skill data - Auto-generated from source files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-content-data.ts

import type { Skill } from '~/types'

export const skills: Skill[] = ${JSON.stringify(skillsFa, null, 2)}
`

writeFileSync(join(process.cwd(), 'app/data/fa/skills.ts'), skillsFaContent, 'utf-8')
console.log('✅ Generated app/data/fa/skills.ts')

// Generate Persian categories data
const categoriesFaContent = `// Persian category data - Auto-generated from source files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-content-data.ts

import type { Category } from '~/types'

export const categories: Category[] = ${JSON.stringify(categoriesFa, null, 2)}
`

writeFileSync(join(process.cwd(), 'app/data/fa/categories.ts'), categoriesFaContent, 'utf-8')
console.log('✅ Generated app/data/fa/categories.ts')

// Generate Persian books data
const booksFaContent = `// Persian book references - Auto-generated from source files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-content-data.ts

import type { Book } from '~/types'

export const books: Book[] = ${JSON.stringify(booksFa, null, 2)}
`

writeFileSync(join(process.cwd(), 'app/data/fa/books.ts'), booksFaContent, 'utf-8')
console.log('✅ Generated app/data/fa/books.ts')

// Generate Persian transcript data
const transcriptFaContent = `// Full video transcript (Persian) - Auto-generated from source files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-content-data.ts

export const transcript: string = ${JSON.stringify(transcriptFa)}
`

writeFileSync(join(process.cwd(), 'app/data/fa/transcript.ts'), transcriptFaContent, 'utf-8')
console.log('✅ Generated app/data/fa/transcript.ts')

// Generate Persian summary data
const summaryFaContent = `// Video summary (Persian) - Auto-generated from source files
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-content-data.ts

export const summary: string = ${JSON.stringify(summaryFa)}
`

writeFileSync(join(process.cwd(), 'app/data/fa/summary.ts'), summaryFaContent, 'utf-8')
console.log('✅ Generated app/data/fa/summary.ts')

// Generate English placeholder data files
const skillsEn: Skill[] = skillsFa.map((skill) => ({
  ...skill,
  name: {
    ...skill.name,
    en: '', // Placeholder - to be translated
  },
  whyItMatters: {
    ...skill.whyItMatters,
    en: '', // Placeholder - to be translated
  },
  howTo: {
    ...skill.howTo,
    en: '', // Placeholder - to be translated
  },
}))

const categoriesEn: Category[] = categoriesFa.map((cat) => ({
  ...cat,
  name: {
    ...cat.name,
    en: cat.name.en, // Already has English
  },
  description: {
    ...cat.description,
    en: cat.description.en, // Already has English
  },
}))

const skillsEnContent = `// English skill data - Placeholder structure
// TODO: Add English translations for all skills

import type { Skill } from '~/types'

export const skills: Skill[] = ${JSON.stringify(skillsEn, null, 2)}
`

writeFileSync(join(process.cwd(), 'app/data/en/skills.ts'), skillsEnContent, 'utf-8')
console.log('✅ Generated app/data/en/skills.ts (placeholder)')

const categoriesEnContent = `// English category data - Placeholder structure
// TODO: Verify English translations

import type { Category } from '~/types'

export const categories: Category[] = ${JSON.stringify(categoriesEn, null, 2)}
`

writeFileSync(join(process.cwd(), 'app/data/en/categories.ts'), categoriesEnContent, 'utf-8')
console.log('✅ Generated app/data/en/categories.ts')

const booksEnContent = `// English book references - Same as Persian (books are in English)
// DO NOT EDIT MANUALLY - Regenerate using: pnpm tsx scripts/generate-content-data.ts

import type { Book } from '~/types'

export const books: Book[] = ${JSON.stringify(booksFa, null, 2)}
`

writeFileSync(join(process.cwd(), 'app/data/en/books.ts'), booksEnContent, 'utf-8')
console.log('✅ Generated app/data/en/books.ts')

const transcriptEnContent = `// Full video transcript (English) - Placeholder
// TODO: Translate transcript from Persian to English

export const transcript: string = ''
`

writeFileSync(join(process.cwd(), 'app/data/en/transcript.ts'), transcriptEnContent, 'utf-8')
console.log('✅ Generated app/data/en/transcript.ts (placeholder)')

const summaryEnContent = `// Video summary (English) - Placeholder
// TODO: Translate summary from Persian to English

export const summary: string = ''
`

writeFileSync(join(process.cwd(), 'app/data/en/summary.ts'), summaryEnContent, 'utf-8')
console.log('✅ Generated app/data/en/summary.ts (placeholder)')

console.log('\n✨ Content data generation complete!')
console.log('📝 Note: English translations are placeholders and need to be added in future stories.')

