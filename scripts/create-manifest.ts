// scripts/create-manifest.ts
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { calculateTranscriptHash } from './utils/hash'
import type { TranscriptManifest, TranscriptMetadata as ManifestMetadata } from '../app/types/transcript-manifest'

interface TranscriptFile {
  videoId: string
  title: string
  fetchedAt: string
  source: 'generated' | 'manual' | 'unavailable'
  language: string
  segments: Array<{ start: number; end: number; text: string }>
  fullText: string
}

async function createManifest() {
  console.log('\n📋 Creating transcript manifest...\n')

  const transcriptsDir = join(process.cwd(), 'server', 'data', 'transcripts')
  const files = await readdir(transcriptsDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  const manifest: TranscriptManifest = {
    version: '1.0.0',
    lastGenerated: new Date().toISOString(),
    transcripts: {}
  }

  let processed = 0
  let skipped = 0

  for (const file of jsonFiles) {
    try {
      const filePath = join(transcriptsDir, file)
      const content = await readFile(filePath, 'utf-8')
      const transcript: TranscriptFile = JSON.parse(content)

      // Skip unavailable transcripts
      if (transcript.source === 'unavailable') {
        console.log(`⏭️  Skipped (unavailable): ${transcript.videoId}`)
        skipped++
        continue
      }

      // Calculate hash
      const hash = calculateTranscriptHash(transcript.fullText)

      // Calculate word count (approximate for Persian)
      const wordCount = transcript.fullText.split(/\s+/).length
      const characterCount = transcript.fullText.length

      // Create metadata
      const metadata: ManifestMetadata = {
        videoId: transcript.videoId,
        locale: transcript.language as 'fa' | 'en',
        status: 'confirmed', // Mark all existing as confirmed
        version: 1,
        hash,
        wordCount,
        characterCount,
        createdAt: transcript.fetchedAt || new Date().toISOString(),
        source: transcript.source
      }

      manifest.transcripts[transcript.videoId] = metadata
      processed++

      console.log(`✅ ${transcript.videoId} - ${wordCount} words, ${transcript.segments.length} segments`)
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error)
    }
  }

  // Save manifest
  const manifestPath = join(process.cwd(), 'app', 'data', 'transcripts', 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))

  console.log('\n' + '='.repeat(60))
  console.log('📊 MANIFEST CREATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total files scanned: ${jsonFiles.length}`)
  console.log(`✅ Processed: ${processed}`)
  console.log(`⏭️  Skipped (unavailable): ${skipped}`)
  console.log(`\n📝 Manifest saved to: ${manifestPath}\n`)
}

createManifest().catch(console.error)
