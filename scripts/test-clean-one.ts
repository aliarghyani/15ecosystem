#!/usr/bin/env tsx
import { promises as fs } from 'fs'
import { join } from 'path'
import { cleanTranscript } from '../server/utils/transcriptCleaner'
import type { VideoTranscriptData } from '../server/utils/transcriptCache'

const videoId = 'MhDVy4-GTRA'
const filePath = join(process.cwd(), 'server', 'data', 'transcripts', `${videoId}.json`)

async function test() {
  const content = await fs.readFile(filePath, 'utf-8')
  const transcript: VideoTranscriptData = JSON.parse(content)
  
  console.log('Before cleaning:')
  console.log('Segments:', transcript.segments.length)
  console.log('FullText length:', transcript.fullText.length)
  console.log('First 500 chars:', transcript.fullText.substring(0, 500))
  
  const cleaned = cleanTranscript(transcript)
  
  console.log('\nAfter cleaning:')
  console.log('Segments:', cleaned.segments.length)
  console.log('FullText length:', cleaned.fullText.length)
  console.log('First 500 chars:', cleaned.fullText.substring(0, 500))
  
  // Save
  await fs.writeFile(filePath, JSON.stringify(cleaned, null, 2), 'utf-8')
  console.log('\n✅ Saved!')
}

test().catch(console.error)
