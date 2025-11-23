import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

const TRANSCRIPTS_DIR = path.join(process.cwd(), 'server', 'data', 'transcripts')

/**
 * Transcript segment with timing information
 */
export interface TranscriptSegment {
    /** Start time in seconds */
    start: number
    /** End time in seconds */
    end: number
    /** Segment text content */
    text: string
}

/**
 * Complete transcript data for a video
 */
export interface VideoTranscriptData {
    /** YouTube video ID */
    videoId: string
    /** Video title */
    title: string
    /** ISO timestamp when transcript was fetched */
    fetchedAt: string
    /** Transcript source type */
    source: 'generated' | 'manual' | 'unavailable'
    /** Language code (e.g., 'en', 'fa') */
    language: string
    /** Array of transcript segments with timing */
    segments: TranscriptSegment[]
    /** Complete transcript text (all segments joined) */
    fullText: string
}

/**
 * Ensure transcripts directory exists
 * Creates the directory if it doesn't exist
 * @throws Error if directory creation fails
 */
async function ensureTranscriptsDir(): Promise<void> {
    try {
        await fs.mkdir(TRANSCRIPTS_DIR, { recursive: true })
    } catch (error: any) {
        console.error('[TranscriptCache] Failed to create transcripts directory:', error.message)
        throw new Error(`Failed to create transcripts directory: ${error.message}`)
    }
}

/**
 * Get transcript file path for a video ID
 * @param videoId - YouTube video ID
 * @returns Full path to transcript JSON file
 */
function getTranscriptPath(videoId: string): string {
    return path.join(TRANSCRIPTS_DIR, `${videoId}.json`)
}

/**
 * Check if transcript exists for a video
 * @param videoId - YouTube video ID
 * @returns True if transcript file exists, false otherwise
 * @example
 * if (await hasTranscript('abc123')) {
 *   console.log('Transcript exists')
 * }
 */
export async function hasTranscript(videoId: string): Promise<boolean> {
    try {
        await fs.access(getTranscriptPath(videoId))
        return true
    } catch {
        return false
    }
}

/**
 * Get cached transcript for a video
 * @param videoId - YouTube video ID
 * @returns Transcript data if found, null otherwise
 * @example
 * const transcript = await getTranscript('abc123')
 * if (transcript) {
 *   console.log(`Transcript has ${transcript.segments.length} segments`)
 * }
 */
export async function getTranscript(videoId: string): Promise<VideoTranscriptData | null> {
    try {
        const data = await fs.readFile(getTranscriptPath(videoId), 'utf-8')
        return JSON.parse(data)
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error(`[TranscriptCache] Error reading transcript ${videoId}:`, error.message)
        }
        return null
    }
}

/**
 * Parse VTT subtitle format to segments
 * @param vttContent - VTT file content
 * @returns Array of transcript segments
 */
function parseVTT(vttContent: string): TranscriptSegment[] {
    const segments: TranscriptSegment[] = []
    const lines = vttContent.split('\n')

    let i = 0
    while (i < lines.length) {
        const line = lines[i]?.trim() || ''

        // Look for timestamp line (format: 00:00:00.000 --> 00:00:04.500)
        if (line.includes('-->')) {
            const parts = line.split('-->')
            const startStr = parts[0]?.trim() || '00:00:00.000'
            const endStr = parts[1]?.trim() || '00:00:00.000'
            const start = parseVTTTimestamp(startStr)
            const end = parseVTTTimestamp(endStr)

            // Next line(s) should be the text
            i++
            const textLines: string[] = []
            while (i < lines.length && lines[i]?.trim() && !lines[i]?.includes('-->')) {
                const trimmed = lines[i]?.trim()
                if (trimmed !== undefined) textLines.push(trimmed)
                i++
            }

            if (textLines.length > 0) {
                segments.push({
                    start,
                    end,
                    text: textLines.join(' ')
                })
            }
        }
        i++
    }

    return segments
}

/**
 * Parse VTT timestamp to seconds
 * @param timestamp - VTT timestamp string (format: HH:MM:SS.mmm)
 * @returns Time in seconds
 */
function parseVTTTimestamp(timestamp: string): number {
    const parts = timestamp.split(':')
    const hours = parseInt(parts[0] || '0') || 0
    const minutes = parseInt(parts[1] || '0') || 0
    const seconds = parseFloat(parts[2] || '0') || 0
    return hours * 3600 + minutes * 60 + seconds
}

/**
 * Fetch transcript using yt-dlp
 * Downloads and parses transcript from YouTube using yt-dlp command-line tool
 * @param videoId - YouTube video ID
 * @param options - Fetch options
 * @param options.language - Language code (default: 'en')
 * @param options.title - Video title (default: 'Unknown Video')
 * @returns Transcript data (may have source: 'unavailable' if fetch fails)
 * @example
 * const transcript = await fetchTranscript('abc123', { language: 'en', title: 'My Video' })
 * console.log(`Fetched ${transcript.segments.length} segments`)
 */
export async function fetchTranscript(
    videoId: string,
    options: {
        language?: string
        title?: string
    } = {}
): Promise<VideoTranscriptData> {
    await ensureTranscriptsDir()

    const { language = 'en', title = 'Unknown Video' } = options
    const baseOutputPath = path.join(TRANSCRIPTS_DIR, videoId)
    // yt-dlp will add .{language}.vtt to the output path
    const expectedVttPath = `${baseOutputPath}.${language}.vtt`

    return new Promise((resolve, reject) => {
        // Build yt-dlp command
        const args = [
            '--write-auto-subs',
            '--sub-lang', language,
            '--skip-download',
            '--convert-subs', 'vtt',
            '--output', baseOutputPath,
            `https://www.youtube.com/watch?v=${videoId}`
        ]

        const ytdlp = spawn('yt-dlp', args)

        let stdout = ''
        let stderr = ''

        ytdlp.stdout.on('data', (data) => {
            stdout += data.toString()
        })

        ytdlp.stderr.on('data', (data) => {
            stderr += data.toString()
        })

        ytdlp.on('close', async (code) => {
            if (code !== 0) {
                console.error(`yt-dlp failed for ${videoId}:`, stderr)

                // Save unavailable marker
                const unavailableData: VideoTranscriptData = {
                    videoId,
                    title,
                    fetchedAt: new Date().toISOString(),
                    source: 'unavailable',
                    language,
                    segments: [],
                    fullText: ''
                }

                await fs.writeFile(
                    getTranscriptPath(videoId),
                    JSON.stringify(unavailableData, null, 2)
                )

                resolve(unavailableData)
                return
            }

            try {
                // Read the VTT file (with language code in filename)
                const vttContent = await fs.readFile(expectedVttPath, 'utf-8')

                // Parse VTT to segments
                const segments = parseVTT(vttContent)
                const fullText = segments.map(s => s.text).join(' ')

                // Determine source type (check if auto-generated)
                const source = stdout.toLowerCase().includes('auto-generated') ? 'generated' : 'manual'

                const transcriptData: VideoTranscriptData = {
                    videoId,
                    title,
                    fetchedAt: new Date().toISOString(),
                    source,
                    language,
                    segments,
                    fullText
                }

                // Save to JSON
                await fs.writeFile(
                    getTranscriptPath(videoId),
                    JSON.stringify(transcriptData, null, 2)
                )

                // Clean up VTT file
                try {
                    await fs.unlink(expectedVttPath)
                } catch { }

                console.log(`[Transcript] Fetched for ${videoId}: ${segments.length} segments, ${source}`)
                resolve(transcriptData)
            } catch (error) {
                console.error(`Failed to process transcript for ${videoId}:`, error)
                reject(error)
            }
        })
    })
}

/**
 * Get all available transcripts
 * @returns Array of video IDs that have transcripts
 * @example
 * const videoIds = await getAllTranscripts()
 * console.log(`Found ${videoIds.length} transcripts`)
 */
export async function getAllTranscripts(): Promise<string[]> {
    try {
        await ensureTranscriptsDir()
        const files = await fs.readdir(TRANSCRIPTS_DIR)
        return files
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''))
    } catch (error: any) {
        console.error('[TranscriptCache] Error reading transcripts directory:', error.message)
        return []
    }
}

/**
 * Get transcript statistics
 * @returns Statistics about cached transcripts
 * @example
 * const stats = await getTranscriptStats()
 * console.log(`Total: ${stats.total}, Available: ${stats.available}`)
 */
export async function getTranscriptStats() {
    const videoIds = await getAllTranscripts()
    let available = 0
    let unavailable = 0
    let generated = 0
    let manual = 0

    for (const videoId of videoIds) {
        const transcript = await getTranscript(videoId)
        if (transcript) {
            if (transcript.source === 'unavailable') {
                unavailable++
            } else {
                available++
                if (transcript.source === 'generated') {
                    generated++
                } else {
                    manual++
                }
            }
        }
    }

    return {
        total: videoIds.length,
        available,
        unavailable,
        generated,
        manual,
        directory: TRANSCRIPTS_DIR
    }
}
