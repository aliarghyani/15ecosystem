import { getTranscript, getAllTranscripts } from './transcriptCache'
import type { TranscriptSegment } from './transcriptCache'

/**
 * Search result for a single video
 */
export interface SearchResult {
    /** Video ID */
    videoId: string
    /** Video title */
    title: string
    /** Array of matching segments */
    matches: Array<{
        /** Matching segment */
        segment: TranscriptSegment
        /** Surrounding context */
        context: {
            /** Text before match */
            before: string
            /** Text after match */
            after: string
        }
        /** Relevance score (number of matches in segment) */
        score: number
    }>
}

/**
 * Normalize Persian text for better search matching
 * @param text - Text to normalize
 * @returns Normalized text
 * @example
 * normalizePersianText('hello') // Normalizes Persian characters
 */
function normalizePersianText(text: string): string {
    if (!text) return ''

    return text
        // Normalize Arabic Yeh to Persian Yeh
        .replace(/ي/g, 'ی')
        // Normalize Arabic Kaf to Persian Kaf
        .replace(/ك/g, 'ک')
        // Remove zero-width non-joiner
        .replace(/\u200c/g, '')
        // Remove diacritics (Arabic vowel marks)
        .replace(/[\u064B-\u0652]/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim()
}

/**
 * Check if text matches query (case-insensitive, with Persian normalization)
 * @param text - Text to search in
 * @param query - Search query
 * @returns True if text contains query
 */
function matchesQuery(text: string, query: string): boolean {
    const normalizedText = normalizePersianText(text.toLowerCase())
    const normalizedQuery = normalizePersianText(query.toLowerCase())
    return normalizedText.includes(normalizedQuery)
}

/**
 * Count occurrences of query in text
 * @param text - Text to search in
 * @param query - Search query
 * @returns Number of occurrences
 */
function countMatches(text: string, query: string): number {
    const normalizedText = normalizePersianText(text.toLowerCase())
    const normalizedQuery = normalizePersianText(query.toLowerCase())

    if (!normalizedQuery) return 0

    let count = 0
    let pos = 0

    while ((pos = normalizedText.indexOf(normalizedQuery, pos)) !== -1) {
        count++
        pos += normalizedQuery.length
    }

    return count
}

/**
 * Search across all transcripts for a query
 * @param query - Search query (keyword or phrase)
 * @param options - Search options
 * @returns Array of search results sorted by relevance
 * @example
 * const results = await searchTranscripts('leadership', { maxResults: 10 })
 * results.forEach(result => {
 *   console.log(`${result.title}: ${result.matches.length} matches`)
 * })
 */
export async function searchTranscripts(
    query: string,
    options: {
        /** Maximum number of results to return */
        maxResults?: number
        /** Minimum score threshold */
        minScore?: number
    } = {}
): Promise<SearchResult[]> {
    const { maxResults = 50, minScore = 1 } = options

    if (!query || query.trim().length === 0) {
        return []
    }

    try {
        const videoIds = await getAllTranscripts()
        const results: SearchResult[] = []

        for (const videoId of videoIds) {
            const transcript = await getTranscript(videoId)
            if (!transcript) continue

            // Search in full text first for efficiency
            if (!matchesQuery(transcript.fullText, query)) {
                continue
            }

            // Find matching segments
            const matches: SearchResult['matches'] = []

            transcript.segments.forEach((segment, index) => {
                if (matchesQuery(segment.text, query)) {
                    const score = countMatches(segment.text, query)

                    if (score >= minScore) {
                        // Get context (previous and next segments)
                        const before = index > 0 ? transcript.segments[index - 1]?.text || '' : ''
                        const after = index < transcript.segments.length - 1 ? transcript.segments[index + 1]?.text || '' : ''

                        matches.push({
                            segment,
                            context: { before, after },
                            score
                        })
                    }
                }
            })

            if (matches.length > 0) {
                results.push({
                    videoId: transcript.videoId,
                    title: transcript.title,
                    matches
                })
            }
        }

        // Sort by total score (sum of all match scores)
        results.sort((a, b) => {
            const scoreA = a.matches.reduce((sum, m) => sum + m.score, 0)
            const scoreB = b.matches.reduce((sum, m) => sum + m.score, 0)
            return scoreB - scoreA
        })

        return results.slice(0, maxResults)
    } catch (error) {
        console.error('[TranscriptSearch] Error searching transcripts:', error)
        return []
    }
}

/**
 * Search within a specific transcript by video ID
 * @param videoId - Video ID to search in
 * @param query - Search query
 * @returns Search result for the video, or null if not found
 * @example
 * const result = await searchTranscriptByVideoId('abc123', 'innovation')
 * if (result) {
 *   console.log(`Found ${result.matches.length} matches`)
 * }
 */
export async function searchTranscriptByVideoId(
    videoId: string,
    query: string
): Promise<SearchResult | null> {
    if (!query || query.trim().length === 0) {
        return null
    }

    try {
        const transcript = await getTranscript(videoId)
        if (!transcript) {
            return null
        }

        // Search in full text first
        if (!matchesQuery(transcript.fullText, query)) {
            return null
        }

        // Find matching segments
        const matches: SearchResult['matches'] = []

        transcript.segments.forEach((segment, index) => {
            if (matchesQuery(segment.text, query)) {
                const score = countMatches(segment.text, query)

                // Get context
                const before = index > 0 ? transcript.segments[index - 1]?.text || '' : ''
                const after = index < transcript.segments.length - 1 ? transcript.segments[index + 1]?.text || '' : ''

                matches.push({
                    segment,
                    context: { before, after },
                    score
                })
            }
        })

        if (matches.length === 0) {
            return null
        }

        return {
            videoId: transcript.videoId,
            title: transcript.title,
            matches
        }
    } catch (error) {
        console.error(`[TranscriptSearch] Error searching transcript ${videoId}:`, error)
        return null
    }
}

/**
 * Find transcript segments containing a keyword
 * @param videoId - Video ID to search in
 * @param keyword - Keyword to find
 * @returns Array of matching segments with context
 * @example
 * const segments = await findTranscriptSegments('abc123', 'leadership')
 * segments.forEach(seg => {
 *   console.log(`${seg.segment.text} (score: ${seg.score})`)
 * })
 */
export async function findTranscriptSegments(
    videoId: string,
    keyword: string
): Promise<Array<{
    segment: TranscriptSegment
    context: { before: string; after: string }
    score: number
}>> {
    const result = await searchTranscriptByVideoId(videoId, keyword)
    return result?.matches || []
}
