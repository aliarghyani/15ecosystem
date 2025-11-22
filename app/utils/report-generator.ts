import type { VideoTranscript } from '~/types/transcripts'
import type {
    ReportOptions,
    WordFrequencyReport,
    MentionReport,
    TopWordsReport,
    ComparisonReport,
    CategoryAnalysisReport,
    ReportMetadata
} from '~/types/reports'
import {
    countWordOccurrences,
    findMentions,
    getWordFrequency,
    getTopWords,
    normalizeText
} from '~/utils/text-analysis'
import { getAllVideos } from '~/utils/videos'

/**
 * Filter transcripts based on options
 */
function filterTranscripts(
    transcripts: VideoTranscript[],
    options: ReportOptions
): VideoTranscript[] {
    const videos = getAllVideos()
    const videoMap = new Map(videos.map(v => [v.id, v]))

    return transcripts.filter(transcript => {
        const video = videoMap.get(transcript.videoId)
        if (!video) return false

        // Filter by Video IDs
        if (options.videoIds && options.videoIds.length > 0) {
            if (!options.videoIds.includes(transcript.videoId)) return false
        }

        // Filter by Category IDs
        if (options.categoryIds && options.categoryIds.length > 0) {
            const hasCategory = video.categoryIds.some(id => options.categoryIds!.includes(id))
            if (!hasCategory) return false
        }

        // Filter by Skill IDs
        if (options.skillIds && options.skillIds.length > 0) {
            const hasSkill = video.skillIds.some(id => options.skillIds!.includes(id))
            if (!hasSkill) return false
        }

        // Filter by Date Range
        if (options.dateRange && video.publishedAt) {
            const videoDate = new Date(video.publishedAt).getTime()
            const start = new Date(options.dateRange.start).getTime()
            const end = new Date(options.dateRange.end).getTime()
            if (videoDate < start || videoDate > end) return false
        }

        return true
    })
}

/**
 * Generate metadata for a report
 */
function generateMetadata(
    type: ReportMetadata['type'],
    title: string,
    transcripts: VideoTranscript[],
    options: ReportOptions
): ReportMetadata {
    return {
        type,
        id: crypto.randomUUID(),
        title,
        generatedAt: new Date().toISOString(),
        locale: options.locale || 'fa',
        transcriptCount: transcripts.length,
        totalWords: transcripts.reduce((sum, t) => sum + t.wordCount, 0),
        options
    }
}

/**
 * Generate a word frequency report for a specific term
 */
export function generateWordFrequencyReport(
    transcripts: VideoTranscript[],
    word: string,
    options: ReportOptions = {}
): WordFrequencyReport & { metadata: ReportMetadata } {
    const filteredTranscripts = filterTranscripts(transcripts, options)
    const locale = options.locale || 'fa'

    let totalOccurrences = 0
    const videoIds: string[] = []

    // Calculate occurrences
    for (const transcript of filteredTranscripts) {
        const count = countWordOccurrences(transcript.transcript, word, {
            ...options,
            locale
        })

        if (count > 0) {
            totalOccurrences += count
            videoIds.push(transcript.videoId)
        }
    }

    const totalWords = filteredTranscripts.reduce((sum, t) => sum + t.wordCount, 0)
    const percentage = totalWords > 0 ? (totalOccurrences / totalWords) * 100 : 0

    return {
        word,
        count: totalOccurrences,
        percentage,
        totalWords,
        videoIds,
        videoCount: videoIds.length,
        metadata: generateMetadata(
            'word-frequency',
            `Word Frequency Report: "${word}"`,
            filteredTranscripts,
            options
        )
    }
}

/**
 * Generate a mention report for multiple terms
 */
export function generateMentionReport(
    transcripts: VideoTranscript[],
    terms: string[],
    options: ReportOptions = {}
): MentionReport[] {
    const filteredTranscripts = filterTranscripts(transcripts, options)
    const locale = options.locale || 'fa'

    return terms.map(term => {
        let totalCount = 0
        const videoIds: string[] = []
        const videoMentions: MentionReport['videoMentions'] = []

        for (const transcript of filteredTranscripts) {
            const mentions = findMentions(transcript.transcript, [term], {
                ...options,
                locale
            })

            const count = mentions[0]?.count || 0

            if (count > 0) {
                totalCount += count
                videoIds.push(transcript.videoId)

                // Get context snippets (simple implementation)
                const positions = mentions[0].positions
                const contexts = positions.map(pos => {
                    const start = Math.max(0, pos - 50)
                    const end = Math.min(transcript.transcript.length, pos + term.length + 50)
                    return '...' + transcript.transcript.substring(start, end) + '...'
                })

                videoMentions.push({
                    videoId: transcript.videoId,
                    count,
                    positions,
                    contexts
                })
            }
        }

        return {
            term,
            count: totalCount,
            videoIds,
            videoCount: videoIds.length,
            videoMentions,
            // Timestamps would require transcript timestamp data which we might not have fully parsed yet
        }
    })
}

/**
 * Helper to convert WordFrequency to WordFrequencyReport
 */
function enrichWordFrequency(
    frequency: { word: string; count: number; percentage: number; totalWords: number },
    transcripts: VideoTranscript[],
    options: ReportOptions
): WordFrequencyReport {
    const videoIds: string[] = []
    const locale = options.locale || 'fa'

    for (const transcript of transcripts) {
        if (countWordOccurrences(transcript.transcript, frequency.word, { ...options, locale }) > 0) {
            videoIds.push(transcript.videoId)
        }
    }

    return {
        ...frequency,
        videoIds,
        videoCount: videoIds.length
    }
}

/**
 * Generate a top words report
 */
export function generateTopWordsReport(
    transcripts: VideoTranscript[],
    limit: number = 50,
    options: ReportOptions = {}
): TopWordsReport & { metadata: ReportMetadata } {
    const filteredTranscripts = filterTranscripts(transcripts, options)
    const locale = options.locale || 'fa'

    // Combine all text
    const fullText = filteredTranscripts.map(t => t.transcript).join(' ')

    // Get top words (WordFrequency[])
    const topWordsRaw = getTopWords(fullText, limit, {
        ...options,
        locale
    })

    // Convert to WordFrequencyReport[]
    const topWords = topWordsRaw.map(fw => enrichWordFrequency(fw, filteredTranscripts, options))

    const totalWords = filteredTranscripts.reduce((sum, t) => sum + t.wordCount, 0)

    // Calculate unique words (approximation based on tokenization)
    const uniqueWords = new Set(fullText.split(/\s+/)).size

    return {
        topWords,
        totalUniqueWords: uniqueWords,
        totalWords,
        videoIds: filteredTranscripts.map(t => t.videoId),
        videoCount: filteredTranscripts.length,
        metadata: generateMetadata(
            'top-words',
            `Top ${limit} Words Report`,
            filteredTranscripts,
            options
        )
    }
}

/**
 * Generate a comparison report
 */
export function generateComparisonReport(
    transcripts: VideoTranscript[],
    terms: string[],
    options: ReportOptions = {}
): ComparisonReport & { metadata: ReportMetadata } {
    const filteredTranscripts = filterTranscripts(transcripts, options)
    const locale = options.locale || 'fa'

    const comparisons = terms.map(term => {
        let count = 0
        const videoIds: string[] = []

        for (const transcript of filteredTranscripts) {
            const termCount = countWordOccurrences(transcript.transcript, term, {
                ...options,
                locale
            })

            if (termCount > 0) {
                count += termCount
                videoIds.push(transcript.videoId)
            }
        }

        // Calculate percentage relative to total mentions of ALL terms in comparison
        // We'll update this after calculating all term counts
        return {
            term,
            count,
            percentage: 0, // Placeholder
            videoIds,
            videoCount: videoIds.length
        }
    })

    const totalMentions = comparisons.reduce((sum, c) => sum + c.count, 0)

    // Update percentages
    comparisons.forEach(c => {
        c.percentage = totalMentions > 0 ? (c.count / totalMentions) * 100 : 0
    })

    return {
        terms,
        comparisons,
        totalMentions,
        metadata: generateMetadata(
            'comparison',
            `Comparison Report: ${terms.join(', ')}`,
            filteredTranscripts,
            options
        )
    }
}

/**
 * Generate a category analysis report
 */
export function generateCategoryReport(
    transcripts: VideoTranscript[],
    categoryId: string,
    options: ReportOptions = {}
): CategoryAnalysisReport & { metadata: ReportMetadata } {
    // Force category filter
    const categoryOptions = { ...options, categoryIds: [categoryId] }
    const filteredTranscripts = filterTranscripts(transcripts, categoryOptions)
    const locale = options.locale || 'fa'

    // Get category name
    const videos = getAllVideos()
    // Try to infer category name from a video, or capitalize ID
    // In a real app we'd have a Category repository
    const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1)

    // Get top words for this category
    const fullText = filteredTranscripts.map(t => t.transcript).join(' ')
    const topWordsRaw = getTopWords(fullText, 20, {
        ...options,
        locale
    })

    const topWords = topWordsRaw.map(fw => enrichWordFrequency(fw, filteredTranscripts, options))

    const totalWords = filteredTranscripts.reduce((sum, t) => sum + t.wordCount, 0)

    return {
        categoryId,
        categoryName,
        topWords,
        totalWords,
        videoIds: filteredTranscripts.map(t => t.videoId),
        videoCount: filteredTranscripts.length,
        metadata: generateMetadata(
            'category',
            `Category Analysis: ${categoryName}`,
            filteredTranscripts,
            categoryOptions
        )
    }
}
