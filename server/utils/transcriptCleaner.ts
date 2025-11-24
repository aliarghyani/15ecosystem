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
 * سپس حذف تکرار متن در fullText
 */
export function deduplicateSegments(segments: TranscriptSegment[]): TranscriptSegment[] {
  if (segments.length === 0) return []
  
  // مرتب‌سازی بر اساس start time
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
 * حذف تکرار کلمات از متن
 * برای حل مشکل overlapping segments که باعث تکرار کلمات میشه
 */
export function removeDuplicateWords(text: string): string {
  if (!text) return ''
  
  const words = text.split(/\s+/)
  const result: string[] = []
  let lastWords: string[] = []
  
  for (const word of words) {
    // اگر این کلمه در 10 کلمه قبلی نیست، اضافه کن
    if (!lastWords.includes(word)) {
      result.push(word)
      lastWords.push(word)
      
      // فقط 10 کلمه آخر رو نگه دار
      if (lastWords.length > 10) {
        lastWords.shift()
      }
    }
  }
  
  return result.join(' ')
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
 * ساخت fullText بدون تکرار از segments
 * استراتژی: استفاده از longest common substring برای حذف تکرارها
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
    
    // پیدا کردن overlap بین متن قبلی و فعلی
    let overlapLength = 0
    const minLength = Math.min(previousText.length, currentText.length)
    
    // چک کردن از آخر previousText و اول currentText
    for (let i = 1; i <= minLength; i++) {
      const endOfPrevious = previousText.slice(-i)
      const startOfCurrent = currentText.slice(0, i)
      
      if (endOfPrevious === startOfCurrent) {
        overlapLength = i
      }
    }
    
    // اگر overlap پیدا شد، فقط قسمت جدید رو اضافه کن
    if (overlapLength > 0) {
      const newPart = currentText.slice(overlapLength)
      if (newPart.trim()) {
        texts.push(newPart)
      }
    } else {
      // اگر overlap نبود، با فاصله اضافه کن
      texts.push(currentText)
    }
    
    previousText = currentText
  }
  
  return texts.join(' ').replace(/\s+/g, ' ').trim()
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
  
  // تولید fullText بدون تکرار
  const fullText = buildUniqueFullText(deduplicatedSegments)
  
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
