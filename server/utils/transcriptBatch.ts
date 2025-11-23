import { getTranscript, getAllTranscripts } from './transcriptCache'
import { validateTranscript, type TranscriptValidationResult } from './transcriptValidation'
import type { VideoTranscriptData } from './transcriptCache'

/**
 * Result of a batch operation
 */
export interface BatchOperationResult<T> {
    /** Overall operation success */
    success: boolean
    /** Number of items processed */
    processed: number
    /** Number of items failed */
    failed: number
    /** Array of results */
    results: T[]
    /** Array of errors with context */
    errors: Array<{
        videoId: string
        error: string
    }>
}

/**
 * Progress callback for batch operations
 */
export type ProgressCallback = (current: number, total: number, videoId: string) => void

/**
 * Load all transcripts from the transcripts directory
 * @param onProgress - Optional progress callback
 * @returns Batch operation result with all transcripts
 * @example
 * const result = await loadAllTranscripts((current, total, videoId) => {
 *   console.log(`Loading ${current}/${total}: ${videoId}`)
 * })
 * console.log(`Loaded ${result.processed} transcripts`)
 */
export async function loadAllTranscripts(
    onProgress?: ProgressCallback
): Promise<BatchOperationResult<VideoTranscriptData>> {
    const errors: Array<{ videoId: string; error: string }> = []
    const results: VideoTranscriptData[] = []

    try {
        const videoIds = await getAllTranscripts()
        const total = videoIds.length

        for (let i = 0; i < videoIds.length; i++) {
            const videoId = videoIds[i]
            if (!videoId) continue

            if (onProgress) {
                onProgress(i + 1, total, videoId)
            }

            try {
                const transcript = await getTranscript(videoId)
                if (transcript) {
                    results.push(transcript)
                } else {
                    errors.push({
                        videoId,
                        error: 'Transcript not found or failed to load'
                    })
                }
            } catch (error: any) {
                errors.push({
                    videoId,
                    error: error.message || 'Unknown error'
                })
            }
        }

        return {
            success: errors.length === 0,
            processed: results.length,
            failed: errors.length,
            results,
            errors
        }
    } catch (error: any) {
        return {
            success: false,
            processed: 0,
            failed: 0,
            results: [],
            errors: [{ videoId: 'N/A', error: `Failed to get transcript list: ${error.message}` }]
        }
    }
}

/**
 * Validate all transcripts in the transcripts directory
 * @param onProgress - Optional progress callback
 * @returns Batch operation result with validation results
 * @example
 * const result = await validateAllTranscripts((current, total, videoId) => {
 *   console.log(`Validating ${current}/${total}: ${videoId}`)
 * })
 * console.log(`Valid: ${result.results.filter(r => r.valid).length}`)
 */
export async function validateAllTranscripts(
    onProgress?: ProgressCallback
): Promise<BatchOperationResult<TranscriptValidationResult & { videoId: string }>> {
    const errors: Array<{ videoId: string; error: string }> = []
    const results: Array<TranscriptValidationResult & { videoId: string }> = []

    try {
        const videoIds = await getAllTranscripts()
        const total = videoIds.length

        for (let i = 0; i < videoIds.length; i++) {
            const videoId = videoIds[i]
            if (!videoId) continue

            if (onProgress) {
                onProgress(i + 1, total, videoId)
            }

            try {
                const transcript = await getTranscript(videoId)
                if (transcript) {
                    const validation = validateTranscript(transcript)
                    results.push({
                        ...validation,
                        videoId
                    })
                } else {
                    errors.push({
                        videoId,
                        error: 'Transcript not found'
                    })
                }
            } catch (error: any) {
                errors.push({
                    videoId,
                    error: error.message || 'Unknown error'
                })
            }
        }

        return {
            success: errors.length === 0,
            processed: results.length,
            failed: errors.length,
            results,
            errors
        }
    } catch (error: any) {
        return {
            success: false,
            processed: 0,
            failed: 0,
            results: [],
            errors: [{ videoId: 'N/A', error: `Failed to get transcript list: ${error.message}` }]
        }
    }
}

/**
 * Process transcripts in batch with a custom processor function
 * @param processor - Function to process each transcript
 * @param onProgress - Optional progress callback
 * @returns Batch operation result with processed results
 * @example
 * const result = await processTranscriptsBatch(
 *   async (transcript) => {
 *     // Custom processing
 *     return { videoId: transcript.videoId, wordCount: transcript.fullText.split(' ').length }
 *   },
 *   (current, total, videoId) => console.log(`Processing ${current}/${total}`)
 * )
 */
export async function processTranscriptsBatch<T>(
    processor: (transcript: VideoTranscriptData) => Promise<T> | T,
    onProgress?: ProgressCallback
): Promise<BatchOperationResult<T>> {
    const errors: Array<{ videoId: string; error: string }> = []
    const results: T[] = []

    try {
        const videoIds = await getAllTranscripts()
        const total = videoIds.length

        for (let i = 0; i < videoIds.length; i++) {
            const videoId = videoIds[i]
            if (!videoId) continue

            if (onProgress) {
                onProgress(i + 1, total, videoId)
            }

            try {
                const transcript = await getTranscript(videoId)
                if (transcript) {
                    const result = await processor(transcript)
                    results.push(result)
                } else {
                    errors.push({
                        videoId,
                        error: 'Transcript not found'
                    })
                }
            } catch (error: any) {
                errors.push({
                    videoId,
                    error: error.message || 'Unknown error during processing'
                })
            }
        }

        return {
            success: errors.length === 0,
            processed: results.length,
            failed: errors.length,
            results,
            errors
        }
    } catch (error: any) {
        return {
            success: false,
            processed: 0,
            failed: 0,
            results: [],
            errors: [{ videoId: 'N/A', error: `Failed to get transcript list: ${error.message}` }]
        }
    }
}
