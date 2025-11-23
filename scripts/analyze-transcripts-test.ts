/**
 * Test version - analyzes first 10 transcripts only
 */

import { writeFile } from 'fs/promises'
import { getTranscript, getAllTranscripts } from '../server/utils/transcriptCache'
import type { VideoTranscriptData } from '../server/utils/transcriptCache'
import { getAllSkills } from '../app/utils/skills'
import { getAllBooks } from '../app/utils/books'
import { getAllWriters } from '../app/utils/writers'

interface AnalysisResult {
  videoId: string
  title: string
  detectedSkills: Array<{
    skillId: number
    skillName: string
    mentions: number
    confidence: number
  }>
  detectedBooks: Array<{
    bookTitle: string
    author: string
    mentions: number
  }>
  detectedWriters: Array<{
    writerName: string
    mentions: number
  }>
}

function normalizePersianText(text: string): string {
  if (!text || typeof text !== 'string') return ''
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, '')
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function countOccurrences(text: string, query: string): number {
  if (!text || !query || typeof text !== 'string' || typeof query !== 'string') return 0
  
  const normalizedText = normalizePersianText(text)
  const normalizedQuery = normalizePersianText(query)
  
  if (!normalizedQuery) return 0
  
  let count = 0
  let pos = 0
  
  while ((pos = normalizedText.indexOf(normalizedQuery, pos)) !== -1) {
    count++
    pos += normalizedQuery.length
  }
  
  return count
}

function cleanTranscriptText(text: string): string {
  // Remove HTML-like tags from transcript text
  // Example: <00:00:02.240><c> text </c>
  return text
    .replace(/<[^>]+>/g, '') // Remove all HTML-like tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

function analyzeSkills(transcript: VideoTranscriptData): AnalysisResult['detectedSkills'] {
  const skills = getAllSkills('fa')
  const detected: AnalysisResult['detectedSkills'] = []

  // Build full text from segments and clean it
  const rawText = transcript.segments.map(s => s.text).join(' ')
  const fullText = cleanTranscriptText(rawText)

  for (const skill of skills) {
    if (!skill || !skill.name || !skill.name.fa) continue
    
    const skillName = skill.name.fa
    const mentions = countOccurrences(fullText, skillName)
    
    if (mentions > 0) {
      detected.push({
        skillId: skill.id,
        skillName: skillName,
        mentions,
        confidence: mentions >= 3 ? 0.95 : 0.85
      })
    }
  }

  return detected.sort((a, b) => b.mentions - a.mentions)
}

function analyzeBooks(transcript: VideoTranscriptData): AnalysisResult['detectedBooks'] {
  const books = getAllBooks('fa')
  const detected: AnalysisResult['detectedBooks'] = []

  // Build full text from segments and clean it
  const rawText = transcript.segments.map(s => s.text).join(' ')
  const fullText = cleanTranscriptText(rawText)

  for (const book of books) {
    const mentions = countOccurrences(fullText, book.title)
    
    if (mentions > 0) {
      detected.push({
        bookTitle: book.title,
        author: book.author,
        mentions
      })
    }
  }

  return detected.sort((a, b) => b.mentions - a.mentions)
}

function analyzeWriters(transcript: VideoTranscriptData): AnalysisResult['detectedWriters'] {
  const writers = getAllWriters('fa')
  const detected: AnalysisResult['detectedWriters'] = []

  // Build full text from segments and clean it
  const rawText = transcript.segments.map(s => s.text).join(' ')
  const fullText = cleanTranscriptText(rawText)

  for (const writer of writers) {
    const mentions = countOccurrences(fullText, writer.name)
    
    if (mentions > 0) {
      detected.push({
        writerName: writer.name,
        mentions
      })
    }
  }

  return detected.sort((a, b) => b.mentions - a.mentions)
}

async function testAnalysis() {
  console.log('🧪 Testing transcript analysis (first 10 videos)...\n')

  const videoIds = await getAllTranscripts()
  const testIds = videoIds.slice(0, 10)
  
  console.log(`Testing with ${testIds.length} videos\n`)

  const results: AnalysisResult[] = []

  for (let i = 0; i < testIds.length; i++) {
    const videoId = testIds[i]
    if (!videoId) continue
    
    console.log(`[${i + 1}/${testIds.length}] Analyzing: ${videoId}`)
    
    const transcript = await getTranscript(videoId)
    if (!transcript) {
      console.log(`  ⚠️  Transcript not found`)
      continue
    }

    const detectedSkills = analyzeSkills(transcript)
    const detectedBooks = analyzeBooks(transcript)
    const detectedWriters = analyzeWriters(transcript)

    console.log(`  ✅ Skills: ${detectedSkills.length}, Books: ${detectedBooks.length}, Writers: ${detectedWriters.length}`)
    
    if (detectedSkills.length > 0) {
      console.log(`     Top skill: ${detectedSkills[0].skillName} (${detectedSkills[0].mentions} mentions)`)
    }

    results.push({
      videoId: transcript.videoId,
      title: transcript.title,
      detectedSkills,
      detectedBooks,
      detectedWriters
    })
  }

  console.log('\n💾 Saving test results...')
  await writeFile(
    'docs/sources/transcript-analysis-test.json',
    JSON.stringify(results, null, 2),
    'utf-8'
  )
  
  console.log('✅ Test complete! Results saved to: docs/sources/transcript-analysis-test.json')
  
  // Print summary
  const totalSkills = results.reduce((sum, r) => sum + r.detectedSkills.length, 0)
  const totalBooks = results.reduce((sum, r) => sum + r.detectedBooks.length, 0)
  const totalWriters = results.reduce((sum, r) => sum + r.detectedWriters.length, 0)
  
  console.log('\n📊 Summary:')
  console.log(`   Videos analyzed: ${results.length}`)
  console.log(`   Total skill detections: ${totalSkills}`)
  console.log(`   Total book detections: ${totalBooks}`)
  console.log(`   Total writer detections: ${totalWriters}`)
}

testAnalysis().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
