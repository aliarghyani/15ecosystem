// scripts/audit-transcripts.ts
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface TranscriptSegment {
  start: number
  end: number
  text: string
}

interface TranscriptFile {
  videoId: string
  title: string
  fetchedAt: string
  source: 'generated' | 'manual' | 'unavailable'
  language: string
  segments: TranscriptSegment[]
  fullText: string
}

interface AuditIssue {
  file: string
  videoId: string
  issue: string
  segmentCount: number
  fullTextLength: number
  source: string
}

interface AuditReport {
  auditDate: string
  totalFiles: number
  valid: number
  invalid: number
  incomplete: number
  empty: number
  issues: AuditIssue[]
  summary: {
    needsRefetch: string[]
    validTranscripts: number
    invalidStructure: number
    emptyContent: number
    unavailable: number
  }
}

async function auditTranscripts() {
  const transcriptsDir = join(process.cwd(), 'server', 'data', 'transcripts')
  const files = await readdir(transcriptsDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  const report: AuditReport = {
    auditDate: new Date().toISOString(),
    totalFiles: jsonFiles.length,
    valid: 0,
    invalid: 0,
    incomplete: 0,
    empty: 0,
    issues: [],
    summary: {
      needsRefetch: [],
      validTranscripts: 0,
      invalidStructure: 0,
      emptyContent: 0,
      unavailable: 0
    }
  }

  console.log(`\n📊 Auditing ${jsonFiles.length} transcript files...\n`)

  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(transcriptsDir, file), 'utf-8')
      const transcript: TranscriptFile = JSON.parse(content)

      // Validate structure
      if (!transcript.videoId || !transcript.segments || !transcript.fullText) {
        report.invalid++
        report.summary.invalidStructure++
        report.issues.push({
          file,
          videoId: transcript.videoId || 'unknown',
          issue: 'invalid_structure',
          segmentCount: transcript.segments?.length || 0,
          fullTextLength: transcript.fullText?.length || 0,
          source: transcript.source || 'unknown'
        })
        console.log(`❌ ${file}: Invalid structure`)
        continue
      }

      // Check if unavailable
      if (transcript.source === 'unavailable') {
        report.summary.unavailable++
        report.issues.push({
          file,
          videoId: transcript.videoId,
          issue: 'unavailable',
          segmentCount: 0,
          fullTextLength: 0,
          source: 'unavailable'
        })
        console.log(`⚠️  ${file}: Transcript unavailable`)
        continue
      }

      // Check for empty content
      if (!transcript.fullText || transcript.fullText.trim().length < 100) {
        report.empty++
        report.summary.emptyContent++
        report.summary.needsRefetch.push(transcript.videoId)
        report.issues.push({
          file,
          videoId: transcript.videoId,
          issue: 'empty_fulltext',
          segmentCount: transcript.segments.length,
          fullTextLength: transcript.fullText?.length || 0,
          source: transcript.source
        })
        console.log(`❌ ${file}: Empty fullText (${transcript.fullText?.length || 0} chars)`)
        continue
      }

      // Check for low segment count
      if (transcript.segments.length < 10) {
        report.incomplete++
        report.summary.needsRefetch.push(transcript.videoId)
        report.issues.push({
          file,
          videoId: transcript.videoId,
          issue: 'low_segment_count',
          segmentCount: transcript.segments.length,
          fullTextLength: transcript.fullText.length,
          source: transcript.source
        })
        console.log(`⚠️  ${file}: Low segments (${transcript.segments.length})`)
        continue
      }

      // Valid transcript
      report.valid++
      report.summary.validTranscripts++
      console.log(`✅ ${file}: Valid (${transcript.segments.length} segments, ${transcript.fullText.length} chars)`)
    } catch (error) {
      report.invalid++
      report.summary.invalidStructure++
      report.issues.push({
        file,
        videoId: 'parse_error',
        issue: `parse_error: ${error}`,
        segmentCount: 0,
        fullTextLength: 0,
        source: 'unknown'
      })
      console.log(`❌ ${file}: Parse error`)
    }
  }

  // Save report
  const reportPath = join(process.cwd(), 'docs', 'sources', 'transcript-audit-report.json')
  await writeFile(reportPath, JSON.stringify(report, null, 2))

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 AUDIT REPORT SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total Files:          ${report.totalFiles}`)
  console.log(`✅ Valid:             ${report.valid} (${((report.valid / report.totalFiles) * 100).toFixed(1)}%)`)
  console.log(`❌ Invalid Structure: ${report.invalid}`)
  console.log(`📄 Empty Content:     ${report.empty}`)
  console.log(`⚠️  Incomplete:        ${report.incomplete}`)
  console.log(`🚫 Unavailable:       ${report.summary.unavailable}`)
  console.log('='.repeat(60))
  console.log(`\n🔄 Need Refetch: ${report.summary.needsRefetch.length} transcripts`)
  if (report.summary.needsRefetch.length > 0) {
    console.log(report.summary.needsRefetch.slice(0, 10).join(', '))
    if (report.summary.needsRefetch.length > 10) {
      console.log(`... and ${report.summary.needsRefetch.length - 10} more`)
    }
  }
  console.log(`\n📝 Report saved to: ${reportPath}\n`)
}

auditTranscripts().catch(console.error)
