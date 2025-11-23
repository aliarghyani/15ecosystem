import { promises as fs } from 'fs'
import type { VideoTranscriptData, TranscriptSegment } from './transcriptCache'

/**
 * Validation result for transcript data
 */
export interface TranscriptValidationResult {
    /** Overall validation result */
    valid: boolean
    /** Array of error messages */
    errors: string[]
    /** Array of warning messages */
    warnings: string[]
    /** Transcript statistics */
    stats: {
        /** Number of segments */
        segmentCount: number
        /** Length of fullText */
        textLength: number
        /** Total duration in seconds */
        duration: number
    }
}

/**
 * Minimum number of segments for a valid transcript
 */
const MIN_SEGMENT_COUNT = 10

/**
 * Validate a transcript object
 * @param transcript - The transcript data to validate
 * @returns Validation result with errors, warnings, and stats
 * @example
 * const result = validateTranscript(transcript)
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors)
 * }
 */
export function validateTranscript(transcript: any): TranscriptValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const stats = {
        segmentCount: 0,
        textLength: 0,
        duration: 0
    }

    // Check if transcript is an object
    if (!transcript || typeof transcript !== 'object') {
        errors.push('Transcript must be an object')
        return { valid: false, errors, warnings, stats }
    }

    // Check required fields
    if (!transcript.videoId || typeof transcript.videoId !== 'string') {
        errors.push('Missing or invalid videoId field')
    }

    if (!transcript.title || typeof transcript.title !== 'string') {
        errors.push('Missing or invalid title field')
    }

    if (!transcript.fullText) {
        errors.push('Missing fullText field')
    } else if (typeof transcript.fullText !== 'string') {
        errors.push('fullText must be a string')
    } else if (transcript.fullText.trim().length === 0) {
        errors.push('fullText is empty')
    } else {
        stats.textLength = transcript.fullText.length
    }

    if (!transcript.segments || !Array.isArray(transcript.segments)) {
        errors.push('Missing or invalid segments field (must be an array)')
    } else {
        stats.segmentCount = transcript.segments.length

        // Check segment count
        if (transcript.segments.length < MIN_SEGMENT_COUNT) {
            warnings.push(`Low segment count (${transcript.segments.length}), expected at least ${MIN_SEGMENT_COUNT}`)
        }

        // Validate each segment
        transcript.segments.forEach((segment: any, index: number) => {
            if (!segment || typeof segment !== 'object') {
                errors.push(`Segment ${index} is not an object`)
                return
            }

            if (typeof segment.start !== 'number') {
                errors.push(`Segment ${index} missing or invalid start time`)
            }

            if (typeof segment.end !== 'number') {
                errors.push(`Segment ${index} missing or invalid end time`)
            }

            if (!segment.text || typeof segment.text !== 'string') {
                errors.push(`Segment ${index} missing or invalid text`)
            }

            // Calculate duration from last segment
            if (typeof segment.end === 'number' && segment.end > stats.duration) {
                stats.duration = segment.end
            }
        })
    }

    // Check source field
    if (transcript.source && !['generated', 'manual', 'unavailable'].includes(transcript.source)) {
        warnings.push(`Unknown source type: ${transcript.source}`)
    }

    // Check language field
    if (!transcript.language || typeof transcript.language !== 'string') {
        warnings.push('Missing or invalid language field')
    }

    // Check fetchedAt field
    if (!transcript.fetchedAt || typeof transcript.fetchedAt !== 'string') {
        warnings.push('Missing or invalid fetchedAt field')
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        stats
    }
}

/**
 * Validate a transcript file
 * @param filePath - Path to the transcript JSON file
 * @returns Validation result with errors, warnings, and stats
 * @example
 * const result = await validateTranscriptFile('server/data/transcripts/abc123.json')
 * if (!result.valid) {
 *   console.error('File validation errors:', result.errors)
 * }
 */
export async function validateTranscriptFile(filePath: string): Promise<TranscriptValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const stats = {
        segmentCount: 0,
        textLength: 0,
        duration: 0
    }

    try {
        // Check if file exists
        await fs.access(filePath)
    } catch {
        errors.push(`File not found: ${filePath}`)
        return { valid: false, errors, warnings, stats }
    }

    try {
        // Read file content
        const content = await fs.readFile(filePath, 'utf-8')

        // Parse JSON
        let transcript: any
        try {
            transcript = JSON.parse(content)
        } catch (parseError: any) {
            errors.push(`Invalid JSON: ${parseError.message}`)
            return { valid: false, errors, warnings, stats }
        }

        // Validate transcript object
        return validateTranscript(transcript)
    } catch (error: any) {
        errors.push(`Failed to read file: ${error.message}`)
        return { valid: false, errors, warnings, stats }
    }
}

/**
 * Validate transcript structure (basic structure check without full validation)
 * @param data - The data to check for transcript structure
 * @returns True if data has basic transcript structure, false otherwise
 * @example
 * if (validateTranscriptStructure(data)) {
 *   // Data looks like a transcript
 * }
 */
export function validateTranscriptStructure(data: any): boolean {
    if (!data || typeof data !== 'object') {
        return false
    }

    // Check for required fields
    const hasVideoId = 'videoId' in data && typeof data.videoId === 'string'
    const hasSegments = 'segments' in data && Array.isArray(data.segments)
    const hasFullText = 'fullText' in data && typeof data.fullText === 'string'

    return hasVideoId && hasSegments && hasFullText
}
