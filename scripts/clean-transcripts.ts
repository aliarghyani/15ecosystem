#!/usr/bin/env tsx
/**
 * Clean all transcript files
 * Removes HTML tags, normalizes Persian text, and deduplicates segments
 * 
 * Usage:
 *   pnpm tsx scripts/clean-transcripts.ts
 */

import { promises as fs } from 'fs'
import { join } from 'path'
import { cleanTranscriptWithStats, needsCleaning } from '../server/utils/transcriptCleaner'
import type { VideoTranscriptData } from '../server/utils/transcriptCache'

const TRANSCRIPTS_DIR = join(process.cwd(), 'server', 'data', 'transcripts')

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(70))
  log(title, 'bright')
  console.log('='.repeat(70))
}

async function main() {
  logSection('🧹 Cleaning All Transcripts')
  
  // Check for --force flag
  const forceClean = process.argv.includes('--force')
  if (forceClean) {
    log('\n⚡ Force mode enabled - will clean all transcripts', 'yellow')
  }
  
  // Get all transcript files
  const files = await fs.readdir(TRANSCRIPTS_DIR)
  const jsonFiles = files.filter(f => f.endsWith('.json'))
  
  log(`\n📊 Found ${jsonFiles.length} transcript files`, 'cyan')
  
  let cleaned = 0
  let skipped = 0
  let errors = 0
  let totalSegmentsRemoved = 0
  let filesWithHtml = 0
  let filesWithDuplicates = 0
  let filesWithArabic = 0
  
  // Process each file
  for (const file of jsonFiles) {
    const filePath = join(TRANSCRIPTS_DIR, file)
    const videoId = file.replace('.json', '')
    
    try {
      // Read transcript
      const content = await fs.readFile(filePath, 'utf-8')
      const transcript: VideoTranscriptData = JSON.parse(content)
      
      // Check if needs cleaning (skip if not force mode)
      if (!forceClean && !needsCleaning(transcript)) {
        skipped++
        log(`⏭️  ${videoId} - Already clean`, 'blue')
        continue
      }
      
      // Clean transcript
      const { cleaned: cleanedTranscript, stats } = cleanTranscriptWithStats(transcript)
      
      // Update stats
      totalSegmentsRemoved += stats.segmentsRemoved
      if (stats.hadHtmlTags) filesWithHtml++
      if (stats.hadDuplicates) filesWithDuplicates++
      if (stats.hadArabicChars) filesWithArabic++
      
      // Save cleaned transcript
      await fs.writeFile(filePath, JSON.stringify(cleanedTranscript, null, 2), 'utf-8')
      
      cleaned++
      log(`✅ ${videoId} - Cleaned (removed ${stats.segmentsRemoved} segments)`, 'green')
      
    } catch (error: any) {
      errors++
      log(`❌ ${videoId} - Error: ${error.message}`, 'red')
    }
  }
  
  // Summary
  logSection('📊 Cleaning Summary')
  
  log(`\nTotal files processed: ${jsonFiles.length}`, 'cyan')
  log(`✅ Cleaned: ${cleaned}`, 'green')
  log(`⏭️  Skipped (already clean): ${skipped}`, 'blue')
  log(`❌ Errors: ${errors}`, errors > 0 ? 'red' : 'cyan')
  
  log(`\n📉 Total segments removed: ${totalSegmentsRemoved.toLocaleString()}`, 'magenta')
  log(`🏷️  Files with HTML tags: ${filesWithHtml}`, 'yellow')
  log(`🔄 Files with duplicates: ${filesWithDuplicates}`, 'yellow')
  log(`🔤 Files with Arabic chars: ${filesWithArabic}`, 'yellow')
  
  if (cleaned > 0) {
    log(`\n✨ Successfully cleaned ${cleaned} transcript files!`, 'green')
  } else {
    log(`\n✨ All transcripts are already clean!`, 'green')
  }
  
  log(`\n${'='.repeat(70)}\n`, 'reset')
}

main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
