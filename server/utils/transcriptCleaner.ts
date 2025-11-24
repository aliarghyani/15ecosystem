/**
 * Transcript Cleaner Utility
 * 
 * Cleans raw YouTube transcripts:
 * - Removes HTML tags and timing codes
 * - Normalizes Persian text
 * - Removes duplicate segments
 * - Generates clean fullText
 */

import type { VideoTranscriptData, TranscriptSegment } from './transcriptCache'

/**
 * Remove HTML tags and timing codes from text
 */
export function cleanHtmlTags(text: string): string {
  if (!text) return ''
  
  return text
    // Remove timing codes: <00:00:02.600>
    .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '')
    // Remove HTML tags: <c>, </c>, <i>, </i>, etc.
    .replace(/<\/?[a-z]+>/gi, '')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normalize Persian text
 */
export function normalizePersianText(text: string): string {
  if (!text) return ''
  
  return text
    // Convert Arabic Yeh to Persian Yeh
    .replace(/ي/g, 'ی')
    // Convert Arabic Kaf to Persian Kaf
    .replace(/ك/g, 'ک')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Remove duplicate and overlapping segments
 * Strategy: Group segments with close start times and select the longest
 * Then remove text duplication in fullText
 */
export function deduplicateSegments(segments: TranscriptSegment[]): TranscriptSegment[] {
  if (segments.length === 0) return []
  
  // Sort by start time
  const sorted = [...segments].sort((a, b) => a.start - b.start)
  
  const result: TranscriptSegment[] = []
  const firstSegment = sorted[0]
  if (!firstSegment) return []
  
  let currentGroup: TranscriptSegment[] = [firstSegment]
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    if (!current) continue
    
    const lastInGroup = currentGroup[currentGroup.length - 1]
    if (!lastInGroup) continue
    
    // If start time is close to current group (difference less than 0.5 seconds)
    // or overlaps with previous segment, add to group
    if (Math.abs(current.start - lastInGroup.start) < 0.5 || current.start < lastInGroup.end) {
      currentGroup.push(current)
    } else {
      // Group finished, select the longest
      const longest = currentGroup.reduce((prev, curr) => 
        curr.text.length > prev.text.length ? curr : prev
      )
      result.push(longest)
      
      // Start new group
      currentGroup = [current]
    }
  }
  
  // Process the last group
  if (currentGroup.length > 0) {
    const longest = currentGroup.reduce((prev, curr) => 
      curr.text.length > prev.text.length ? curr : prev
    )
    result.push(longest)
  }
  
  return result
}

/**
 * Remove duplicate words from text
 * Solves the problem of overlapping segments that cause word duplication
 */
export function removeDuplicateWords(text: string): string {
  if (!text) return ''
  
  const words = text.split(/\s+/)
  const result: string[] = []
  let lastWords: string[] = []
  
  for (const word of words) {
    // If this word is not in the last 10 words, add it
    if (!lastWords.includes(word)) {
      result.push(word)
      lastWords.push(word)
      
      // Keep only the last 10 words
      if (lastWords.length > 10) {
        lastWords.shift()
      }
    }
  }
  
  return result.join(' ')
}

/**
 * Check if transcript needs cleaning
 */
export function needsCleaning(transcript: VideoTranscriptData): boolean {
  // Check for HTML tags in fullText
  if (/<[^>]+>/.test(transcript.fullText)) {
    return true
  }
  
  // Check for HTML tags in segments
  const hasHtmlInSegments = transcript.segments.some(seg => 
    /<[^>]+>/.test(seg.text)
  )
  if (hasHtmlInSegments) {
    return true
  }
  
  // Check for duplicate segments
  const uniqueTimestamps = new Set(
    transcript.segments.map(seg => `${seg.start}-${seg.end}`)
  )
  if (uniqueTimestamps.size !== transcript.segments.length) {
    return true
  }
  
  // Check for Arabic characters
  if (/[يك]/.test(transcript.fullText)) {
    return true
  }
  
  return false
}

/**
 * Build fullText without duplication from segments
 * Strategy: Use longest common substring to remove duplicates
 */
function buildUniqueFullText(segments: TranscriptSegment[]): string {
  if (segments.length === 0) return ''
  const firstSegment = segments[0]
  if (segments.length === 1 && firstSegment) return firstSegment.text
  
  const texts: string[] = []
  let previousText = ''
  
  for (const segment of segments) {
    const currentText = segment.text
    
    if (!previousText) {
      texts.push(currentText)
      previousText = currentText
      continue
    }
    
    // Find overlap between previous and current text
    let overlapLength = 0
    const minLength = Math.min(previousText.length, currentText.length)
    
    // Check from end of previousText and start of currentText
    for (let i = 1; i <= minLength; i++) {
      const endOfPrevious = previousText.slice(-i)
      const startOfCurrent = currentText.slice(0, i)
      
      if (endOfPrevious === startOfCurrent) {
        overlapLength = i
      }
    }
    
    // If overlap found, add only the new part
    if (overlapLength > 0) {
      const newPart = currentText.slice(overlapLength)
      if (newPart.trim()) {
        texts.push(newPart)
      }
    } else {
      // If no overlap, add with space
      texts.push(currentText)
    }
    
    previousText = currentText
  }
  
  return texts.join(' ').replace(/\s+/g, ' ').trim()
}

/**
 * Complete cleaning of a transcript
 */
export function cleanTranscript(transcript: VideoTranscriptData): VideoTranscriptData {
  // Clean segments
  const cleanedSegments = transcript.segments
    .map(segment => ({
      ...segment,
      text: normalizePersianText(cleanHtmlTags(segment.text))
    }))
    // Remove empty segments
    .filter(segment => segment.text.length > 0)
  
  // Remove duplicates
  const deduplicatedSegments = deduplicateSegments(cleanedSegments)
  
  // Generate fullText without duplication
  const fullText = buildUniqueFullText(deduplicatedSegments)
  
  return {
    ...transcript,
    segments: deduplicatedSegments,
    fullText: normalizePersianText(fullText)
  }
}

/**
 * Cleaning statistics
 */
export interface CleaningStats {
  segmentsRemoved: number
  hadHtmlTags: boolean
  hadDuplicates: boolean
  hadArabicChars: boolean
}

/**
 * Clean with statistics
 */
export function cleanTranscriptWithStats(transcript: VideoTranscriptData): {
  cleaned: VideoTranscriptData
  stats: CleaningStats
} {
  const originalSegmentCount = transcript.segments.length
  const hadHtmlTags = /<[^>]+>/.test(transcript.fullText) || 
    transcript.segments.some(seg => /<[^>]+>/.test(seg.text))
  const hadArabicChars = /[يك]/.test(transcript.fullText)
  
  const uniqueTimestamps = new Set(
    transcript.segments.map(seg => `${seg.start}-${seg.end}`)
  )
  const hadDuplicates = uniqueTimestamps.size !== transcript.segments.length
  
  const cleaned = cleanTranscript(transcript)
  
  return {
    cleaned,
    stats: {
      segmentsRemoved: originalSegmentCount - cleaned.segments.length,
      hadHtmlTags,
      hadDuplicates,
      hadArabicChars
    }
  }
}
