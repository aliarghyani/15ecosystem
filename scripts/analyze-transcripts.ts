/**
 * Transcript Analysis Script
 * Analyzes all 128 video transcripts to detect mentions of skills, books, and writers
 * Generates relationship suggestions with confidence scores
 */

import { writeFile } from 'fs/promises'
import { loadAllTranscripts } from '../server/utils/transcriptBatch'
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
    skillNameEn: string
    mentions: number
    confidence: number
  }>
  detectedBooks: Array<{
    bookSlug: string
    bookTitle: string
    author: string
    mentions: number
    confidence: number
  }>
  detectedWriters: Array<{
    writerSlug: string
    writerName: string
    mentions: number
    confidence: number
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

function cleanTranscriptText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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

function calculateConfidence(mentions: number): number {
  if (mentions >= 5) return 1.0
  if (mentions >= 3) return 0.95
  if (mentions >= 2) return 0.90
  if (mentions >= 1) return 0.85
  return 0.0
}

function analyzeSkills(transcript: VideoTranscriptData): AnalysisResult['detectedSkills'] {
  const skills = getAllSkills('fa')
  const skillsEn = getAllSkills('en')
  const detected: AnalysisResult['detectedSkills'] = []

  const rawText = transcript.segments.map(s => s.text).join(' ')
  const fullText = cleanTranscriptText(rawText)

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i]
    const skillEn = skillsEn[i]
    
    if (!skill || !skillEn || !skill.name || !skill.name.fa) continue

    const skillName = skill.name.fa
    const mentions = countOccurrences(fullText, skillName)

    if (mentions > 0) {
      detected.push({
        skillId: skill.id,
        skillName: skillName,
        skillNameEn: skillEn.name?.en || '',
        mentions,
        confidence: calculateConfidence(mentions)
      })
    }
  }

  return detected.sort((a, b) => b.mentions - a.mentions)
}

function analyzeBooks(transcript: VideoTranscriptData): AnalysisResult['detectedBooks'] {
  const books = getAllBooks('fa')
  const detected: AnalysisResult['detectedBooks'] = []

  const rawText = transcript.segments.map(s => s.text).join(' ')
  const fullText = cleanTranscriptText(rawText)

  for (const book of books) {
    const mentions = countOccurrences(fullText, book.title)

    if (mentions > 0) {
      const slug = `${book.title}-${book.author}`
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/^-+|-+$/g, '')

      detected.push({
        bookSlug: slug,
        bookTitle: book.title,
        author: book.author,
        mentions,
        confidence: calculateConfidence(mentions)
      })
    }
  }

  return detected.sort((a, b) => b.mentions - a.mentions)
}

function analyzeWriters(transcript: VideoTranscriptData): AnalysisResult['detectedWriters'] {
  const writers = getAllWriters('fa')
  const detected: AnalysisResult['detectedWriters'] = []

  const rawText = transcript.segments.map(s => s.text).join(' ')
  const fullText = cleanTranscriptText(rawText)

  for (const writer of writers) {
    const mentions = countOccurrences(fullText, writer.name)

    if (mentions > 0) {
      detected.push({
        writerSlug: writer.slug,
        writerName: writer.name,
        mentions,
        confidence: calculateConfidence(mentions)
      })
    }
  }

  return detected.sort((a, b) => b.mentions - a.mentions)
}

async function analyzeTranscripts() {
  console.log('🔍 Starting transcript analysis...\n')

  console.log('📥 Loading transcripts...')
  const result = await loadAllTranscripts((current, total, videoId) => {
    process.stdout.write(`\r   Loading: ${current}/${total}`)
  })
  console.log('\n')

  if (!result.success) {
    console.error('❌ Failed to load transcripts')
    console.error('Errors:', result.errors)
    process.exit(1)
  }

  console.log(`✅ Loaded ${result.processed} transcripts\n`)

  console.log('🔬 Analyzing transcripts...')
  const analysisResults: AnalysisResult[] = []
  let processed = 0

  for (const transcript of result.results) {
    processed++
    process.stdout.write(`\r   Analyzing: ${processed}/${result.results.length}`)

    const detectedSkills = analyzeSkills(transcript)
    const detectedBooks = analyzeBooks(transcript)
    const detectedWriters = analyzeWriters(transcript)

    analysisResults.push({
      videoId: transcript.videoId,
      title: transcript.title,
      detectedSkills,
      detectedBooks,
      detectedWriters
    })
  }
  console.log('\n')

  const stats = {
    totalVideos: analysisResults.length,
    videosWithSkills: analysisResults.filter(r => r.detectedSkills.length > 0).length,
    videosWithBooks: analysisResults.filter(r => r.detectedBooks.length > 0).length,
    videosWithWriters: analysisResults.filter(r => r.detectedWriters.length > 0).length,
    totalSkillMentions: analysisResults.reduce((sum, r) => 
      sum + r.detectedSkills.reduce((s, sk) => s + sk.mentions, 0), 0
    ),
    totalBookMentions: analysisResults.reduce((sum, r) => 
      sum + r.detectedBooks.reduce((s, b) => s + b.mentions, 0), 0
    ),
    totalWriterMentions: analysisResults.reduce((sum, r) => 
      sum + r.detectedWriters.reduce((s, w) => s + w.mentions, 0), 0
    )
  }

  console.log('💾 Saving results...')
  await writeFile(
    'docs/sources/transcript-analysis-results.json',
    JSON.stringify(analysisResults, null, 2),
    'utf-8'
  )
  console.log('   ✅ Saved to: docs/sources/transcript-analysis-results.json\n')

  console.log('📊 Generating summary report...')
  const summary = generateSummaryReport(analysisResults, stats)
  await writeFile(
    'docs/sources/transcript-analysis-summary.md',
    summary,
    'utf-8'
  )
  console.log('   ✅ Saved to: docs/sources/transcript-analysis-summary.md\n')

  console.log('📈 Analysis Summary:')
  console.log(`   Total Videos: ${stats.totalVideos}`)
  console.log(`   Videos with Skills: ${stats.videosWithSkills} (${Math.round(stats.videosWithSkills / stats.totalVideos * 100)}%)`)
  console.log(`   Videos with Books: ${stats.videosWithBooks} (${Math.round(stats.videosWithBooks / stats.totalVideos * 100)}%)`)
  console.log(`   Videos with Writers: ${stats.videosWithWriters} (${Math.round(stats.videosWithWriters / stats.totalVideos * 100)}%)`)
  console.log(`   Total Skill Mentions: ${stats.totalSkillMentions}`)
  console.log(`   Total Book Mentions: ${stats.totalBookMentions}`)
  console.log(`   Total Writer Mentions: ${stats.totalWriterMentions}`)
  console.log('\n✨ Analysis complete!')
}

function generateSummaryReport(results: AnalysisResult[], stats: any): string {
  const lines: string[] = []

  lines.push('# Transcript Analysis Summary Report')
  lines.push('')
  lines.push(`**Generated:** ${new Date().toISOString()}`)
  lines.push(`**Total Videos Analyzed:** ${stats.totalVideos}`)
  lines.push('')

  lines.push('## Overview Statistics')
  lines.push('')
  lines.push(`- Videos with Skill mentions: ${stats.videosWithSkills} (${Math.round(stats.videosWithSkills / stats.totalVideos * 100)}%)`)
  lines.push(`- Videos with Book mentions: ${stats.videosWithBooks} (${Math.round(stats.videosWithBooks / stats.totalVideos * 100)}%)`)
  lines.push(`- Videos with Writer mentions: ${stats.videosWithWriters} (${Math.round(stats.videosWithWriters / stats.totalVideos * 100)}%)`)
  lines.push(`- Total Skill Mentions: ${stats.totalSkillMentions}`)
  lines.push(`- Total Book Mentions: ${stats.totalBookMentions}`)
  lines.push(`- Total Writer Mentions: ${stats.totalWriterMentions}`)
  lines.push('')

  lines.push('## Top Skills Detected')
  lines.push('')
  const skillCounts = new Map<number, { name: string; count: number }>()
  for (const result of results) {
    for (const skill of result.detectedSkills) {
      const current = skillCounts.get(skill.skillId) || { name: skill.skillName, count: 0 }
      current.count += skill.mentions
      skillCounts.set(skill.skillId, current)
    }
  }
  const topSkills = Array.from(skillCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
  
  for (const [id, data] of topSkills) {
    const videoCount = results.filter(r => r.detectedSkills.some(s => s.skillId === id)).length
    lines.push(`- **${data.name}** (ID: ${id}): ${data.count} mentions in ${videoCount} videos`)
  }
  lines.push('')

  lines.push('## Top Books Detected')
  lines.push('')
  const bookCounts = new Map<string, { title: string; author: string; count: number }>()
  for (const result of results) {
    for (const book of result.detectedBooks) {
      const current = bookCounts.get(book.bookSlug) || { 
        title: book.bookTitle, 
        author: book.author, 
        count: 0 
      }
      current.count += book.mentions
      bookCounts.set(book.bookSlug, current)
    }
  }
  const topBooks = Array.from(bookCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
  
  for (const [slug, data] of topBooks) {
    lines.push(`- **${data.title}** by ${data.author}: ${data.count} mentions`)
  }
  lines.push('')

  lines.push('## Top Writers Detected')
  lines.push('')
  const writerCounts = new Map<string, { name: string; count: number }>()
  for (const result of results) {
    for (const writer of result.detectedWriters) {
      const current = writerCounts.get(writer.writerSlug) || { 
        name: writer.writerName, 
        count: 0 
      }
      current.count += writer.mentions
      writerCounts.set(writer.writerSlug, current)
    }
  }
  const topWriters = Array.from(writerCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
  
  for (const [slug, data] of topWriters) {
    lines.push(`- **${data.name}**: ${data.count} mentions`)
  }
  lines.push('')

  lines.push('## Next Steps')
  lines.push('')
  lines.push('1. Review the detailed results in `transcript-analysis-results.json`')
  lines.push('2. Manually verify high-confidence matches for accuracy')
  lines.push('3. Check for false positives (common words mistaken for skill/book names)')
  lines.push('4. Approve relationships to be applied to video data')
  lines.push('5. Run `update-video-relationships.ts` to apply approved changes')
  lines.push('')

  return lines.join('\n')
}

analyzeTranscripts().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
