/**
 * Script to generate transcript TypeScript files from YAML content files
 * Run with: pnpm tsx scripts/generate-transcripts-from-yaml.ts
 * 
 * This script will:
 * 1. Read YAML files from app/data/transcripts/fa/ and app/data/transcripts/en/
 * 2. Match files by video title (Persian) to get video ID from parsed-videos.json
 * 3. Parse transcript data (supports both YAML format and plain text)
 * 4. Calculate word/character counts
 * 5. Generate TypeScript files in app/data/transcripts/fa/index.ts and app/data/transcripts/en/index.ts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'
import type { VideoTranscript } from '../app/types/transcripts'

interface ParsedVideo {
  id: string
  title: {
    fa: string
    en: string
  }
}

interface TranscriptYaml {
  transcript?: string
  updatedAt?: string
}

/**
 * Load video data to map titles to video IDs
 */
function loadVideoData(): Map<string, string> {
  const videoDataPath = join(process.cwd(), 'docs', 'sources', 'imported', 'parsed-videos.json')
  const titleToIdMap = new Map<string, string>()

  if (!existsSync(videoDataPath)) {
    console.warn('⚠️  parsed-videos.json not found. Will use filename as video ID.')
    return titleToIdMap
  }

  try {
    const videoData = JSON.parse(readFileSync(videoDataPath, 'utf-8')) as ParsedVideo[]
    for (const video of videoData) {
      // Map Persian title to video ID
      if (video.title.fa) {
        titleToIdMap.set(video.title.fa.trim(), video.id)
      }
      // Also map English title if available
      if (video.title.en) {
        titleToIdMap.set(video.title.en.trim(), video.id)
      }
    }
    console.log(`📚 Loaded ${titleToIdMap.size} video title mappings`)
  } catch (error) {
    console.warn('⚠️  Error loading video data:', error)
  }

  return titleToIdMap
}

/**
 * Count words in text (handles Persian and English)
 */
function countWords(text: string): number {
  if (!text) return 0
  // Split by whitespace and filter empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  return words.length
}

/**
 * Count characters (including spaces)
 */
function countCharacters(text: string): number {
  return text ? text.length : 0
}

/**
 * Count characters (excluding spaces)
 */
function countCharactersNoSpaces(text: string): number {
  if (!text) return 0
  return text.replace(/\s+/g, '').length
}

/**
 * Extract transcript text from YAML file
 * Supports both YAML format (with transcript: key) and plain text
 */
function extractTranscript(content: string): string | null {
  try {
    // Try parsing as YAML first
    const data = yaml.load(content) as TranscriptYaml | string
    
    if (typeof data === 'string') {
      // Plain text file
      return data.trim()
    }
    
    if (data && typeof data === 'object') {
      // YAML with transcript key
      if (data.transcript) {
        return data.transcript.trim()
      }
      // YAML without transcript key - might be plain text in YAML
      const asString = String(data).trim()
      if (asString && asString !== '[object Object]') {
        return asString
      }
    }
    
    return null
  } catch (error) {
    // If YAML parsing fails, treat as plain text
    return content.trim()
  }
}

/**
 * Generate TypeScript file content for transcripts
 */
function generateTranscriptsFile(transcripts: Record<string, VideoTranscript>, locale: 'fa' | 'en'): string {
  const localeName = locale === 'fa' ? 'Persian' : 'English'
  
  return `/**
 * ${localeName} video transcripts
 * 
 * This file exports all ${localeName} video transcripts.
 * Transcripts are loaded on-demand for performance.
 * 
 * AUTO-GENERATED from YAML files in app/data/transcripts/${locale}/
 * Files are named by video title (Persian/English).
 * DO NOT EDIT MANUALLY - Regenerate using: pnpm generate:transcripts
 */

import type { VideoTranscript } from '~/types/transcripts'

/**
 * All ${localeName} video transcripts
 * 
 * Structure: Map videoId -> VideoTranscript
 */
export const transcripts: Record<string, VideoTranscript> = ${JSON.stringify(transcripts, null, 2)}

/**
 * Get transcript by video ID
 * @param videoId - YouTube video ID
 * @returns VideoTranscript or undefined if not found
 */
export function getTranscript(videoId: string): VideoTranscript | undefined {
  return transcripts[videoId]
}

/**
 * Get all transcript metadata (for listing/searching)
 * @returns Array of TranscriptMetadata
 */
export function getAllTranscriptMetadata(): Array<{
  videoId: string
  wordCount: number
  characterCount: number
  locale: '${locale}'
  preview: string
  updatedAt?: string
}> {
  return Object.values(transcripts).map((transcript) => ({
    videoId: transcript.videoId,
    wordCount: transcript.wordCount,
    characterCount: transcript.characterCount,
    locale: '${locale}' as const,
    preview: transcript.transcript.substring(0, 200),
    updatedAt: transcript.updatedAt,
  }))
}
`
}

/**
 * Main function
 */
function main() {
  console.log('📝 Generating transcript files from YAML...\n')

  // Load video title to ID mapping
  const titleToIdMap = loadVideoData()

  const faDir = join(process.cwd(), 'app', 'data', 'transcripts', 'fa')
  const enDir = join(process.cwd(), 'app', 'data', 'transcripts', 'en')

  const transcriptsFa: Record<string, VideoTranscript> = {}
  const transcriptsEn: Record<string, VideoTranscript> = {}
  const unmatchedFiles: string[] = []

  // Process Persian transcripts
  if (existsSync(faDir)) {
    const files = readdirSync(faDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    console.log(`📖 Processing ${files.length} Persian transcript files...`)

    for (const file of files) {
      const filePath = join(faDir, file)
      // Extract title from filename (remove .yml/.yaml extension)
      const title = file.replace(/\.(yml|yaml)$/, '')
      
      try {
        const content = readFileSync(filePath, 'utf-8')
        const transcriptText = extractTranscript(content)
        
        if (!transcriptText) {
          console.warn(`⚠️  No transcript found in ${file}`)
          continue
        }

        // Get video ID from title mapping
        let videoId = titleToIdMap.get(title)
        
        if (!videoId) {
          // Try to find by partial match or use filename as fallback
          console.warn(`⚠️  Video ID not found for title: "${title}"`)
          unmatchedFiles.push(title)
          // Skip files without video ID mapping
          continue
        }

        const wordCount = countWords(transcriptText)
        const characterCount = countCharacters(transcriptText)
        const characterCountNoSpaces = countCharactersNoSpaces(transcriptText)

        transcriptsFa[videoId] = {
          videoId,
          transcript: transcriptText,
          wordCount,
          characterCount,
          characterCountNoSpaces,
          locale: 'fa',
          updatedAt: new Date().toISOString()
        }

        console.log(`   ✅ ${title} → ${videoId}: ${wordCount} words, ${characterCount} characters`)
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error)
      }
    }
  }

  // Process English transcripts
  if (existsSync(enDir)) {
    const files = readdirSync(enDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    console.log(`\n📖 Processing ${files.length} English transcript files...`)

    for (const file of files) {
      const filePath = join(enDir, file)
      const title = file.replace(/\.(yml|yaml)$/, '')
      
      try {
        const content = readFileSync(filePath, 'utf-8')
        const transcriptText = extractTranscript(content)
        
        if (!transcriptText) {
          console.warn(`⚠️  No transcript found in ${file}`)
          continue
        }

        let videoId = titleToIdMap.get(title)
        
        if (!videoId) {
          console.warn(`⚠️  Video ID not found for title: "${title}"`)
          unmatchedFiles.push(title)
          continue
        }

        const wordCount = countWords(transcriptText)
        const characterCount = countCharacters(transcriptText)
        const characterCountNoSpaces = countCharactersNoSpaces(transcriptText)

        transcriptsEn[videoId] = {
          videoId,
          transcript: transcriptText,
          wordCount,
          characterCount,
          characterCountNoSpaces,
          locale: 'en',
          updatedAt: new Date().toISOString()
        }

        console.log(`   ✅ ${title} → ${videoId}: ${wordCount} words, ${characterCount} characters`)
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error)
      }
    }
  }

  // Generate TypeScript files
  const faOutputPath = join(process.cwd(), 'app', 'data', 'transcripts', 'fa', 'index.ts')
  const enOutputPath = join(process.cwd(), 'app', 'data', 'transcripts', 'en', 'index.ts')

  writeFileSync(faOutputPath, generateTranscriptsFile(transcriptsFa, 'fa'), 'utf-8')
  writeFileSync(enOutputPath, generateTranscriptsFile(transcriptsEn, 'en'), 'utf-8')

  console.log('\n✨ Generated transcript files:')
  console.log(`   - ${faOutputPath} (${Object.keys(transcriptsFa).length} transcripts)`)
  console.log(`   - ${enOutputPath} (${Object.keys(transcriptsEn).length} transcripts)`)
  
  if (unmatchedFiles.length > 0) {
    console.log('\n⚠️  Unmatched files (could not find video ID):')
    unmatchedFiles.forEach(file => console.log(`   - ${file}`))
    console.log('\n💡 Tip: Make sure video titles match exactly with parsed-videos.json')
  }
  
  console.log('\n✅ Done!')
}

main()
