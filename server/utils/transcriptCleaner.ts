/**
 * Transcript Cleaner Utility
 * 
 * پاکسازی ترنسکریپت‌های خام از YouTube:
 * - حذف HTML tags و timing codes
 * - نرمال‌سازی متن فارسی
 * - حذف segments تکراری
 * - تولید fullText تمیز
 */

import type { VideoTranscriptData, TranscriptSegment } from './transcriptCache'

/**
 * حذف HTML tags و timing codes از متن
 */
export function cleanHtmlTags(text: string): string {
  if (!text) return ''
  
  return text
    // حذف timing codes: <00:00:02.600>
    .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '')
    // حذف HTML tags: <c>, </c>, <i>, </i>, etc.
    .replace(/<\/?[a-z]+>/gi, '')
    // حذف فاصله‌های اضافی
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * نرمال‌سازی متن فارسی
 */
export function normalizePersianText(text: string): string {
  if (!text) return ''
  
  return text
    // تبدیل ي عربی به ی فارسی
    .replace(/ي/g, 'ی')
    // تبدیل ك عربی به ک فارسی
    .replace(/ك/g, 'ک')
    // نرمال‌سازی فاصله‌ها
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * حذف segments تکراری و همپوشانی
 * استراتژی: گروه‌بندی segments با start time نزدیک و انتخاب طولانی‌ترین
 */
export function deduplicateSegments(segments: TranscriptSegment[]): TranscriptSegment[] {
  if (segments.length === 0) return []
  
  // مرتب‌سازی بر اساس start time
  const sorted = [...segments].sort((a, b) => a.start - b.start)
  
  const result: TranscriptSegment[] = []
  let currentGroup: TranscriptSegment[] = [sorted[0]]
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    const lastInGroup = currentGroup[currentGroup.length - 1]
    
    // اگر start time نزدیک به گروه فعلی است (تفاوت کمتر از 0.5 ثانیه)
    // یا با segment قبلی overlap دارد، به گروه اضافه کن
    if (Math.abs(current.start - lastInGroup.start) < 0.5 || current.start < lastInGroup.end) {
      currentGroup.push(current)
    } else {
      // گروه تمام شد، طولانی‌ترین را انتخاب کن
      const longest = currentGroup.reduce((prev, curr) => 
        curr.text.length > prev.text.length ? curr : prev
      )
      result.push(longest)
      
      // شروع گروه جدید
      currentGroup = [current]
    }
  }
  
  // آخرین گروه را پردازش کن
  if (currentGroup.length > 0) {
    const longest = currentGroup.reduce((prev, curr) => 
      curr.text.length > prev.text.length ? curr : prev
    )
    result.push(longest)
  }
  
  return result
}

/**
 * بررسی نیاز به پاکسازی
 */
export function needsCleaning(transcript: VideoTranscriptData): boolean {
  // بررسی وجود HTML tags در fullText
  if (/<[^>]+>/.test(transcript.fullText)) {
    return true
  }
  
  // بررسی وجود HTML tags در segments
  const hasHtmlInSegments = transcript.segments.some(seg => 
    /<[^>]+>/.test(seg.text)
  )
  if (hasHtmlInSegments) {
    return true
  }
  
  // بررسی وجود segments تکراری
  const uniqueTimestamps = new Set(
    transcript.segments.map(seg => `${seg.start}-${seg.end}`)
  )
  if (uniqueTimestamps.size !== transcript.segments.length) {
    return true
  }
  
  // بررسی وجود حروف عربی
  if (/[يك]/.test(transcript.fullText)) {
    return true
  }
  
  return false
}

/**
 * پاکسازی کامل یک ترنسکریپت
 */
export function cleanTranscript(transcript: VideoTranscriptData): VideoTranscriptData {
  // پاکسازی segments
  const cleanedSegments = transcript.segments
    .map(segment => ({
      ...segment,
      text: normalizePersianText(cleanHtmlTags(segment.text))
    }))
    // حذف segments خالی
    .filter(segment => segment.text.length > 0)
  
  // حذف duplicates
  const deduplicatedSegments = deduplicateSegments(cleanedSegments)
  
  // تولید fullText از segments تمیز شده
  const fullText = deduplicatedSegments
    .map(seg => seg.text)
    .join(' ')
  
  return {
    ...transcript,
    segments: deduplicatedSegments,
    fullText: normalizePersianText(fullText)
  }
}

/**
 * آمار پاکسازی
 */
export interface CleaningStats {
  segmentsRemoved: number
  hadHtmlTags: boolean
  hadDuplicates: boolean
  hadArabicChars: boolean
}

/**
 * پاکسازی با آمار
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
