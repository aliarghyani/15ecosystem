import { fetchTranscript, hasTranscript } from '../../utils/transcriptCache'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { videoIds, language = 'en' } = body

    if (!videoIds || !Array.isArray(videoIds)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'videoIds array is required',
        })
    }

    const results = []
    let processed = 0
    let skipped = 0
    let failed = 0

    for (const videoId of videoIds) {
        try {
            // Check if already exists
            const exists = await hasTranscript(videoId)
            if (exists) {
                console.log(`[Batch Transcript] Skipping ${videoId} (already exists)`)
                skipped++
                continue
            }

            console.log(`[Batch Transcript] Fetching ${videoId} (${processed + 1}/${videoIds.length})`)

            const transcript = await fetchTranscript(videoId, { language })
            results.push({
                videoId,
                status: 'success',
                segments: transcript.segments.length
            })
            processed++

            // Small delay to avoid overwhelming yt-dlp
            await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
            console.error(`[Batch Transcript] Failed ${videoId}:`, error)
            results.push({
                videoId,
                status: 'failed',
                error: String(error)
            })
            failed++
        }
    }

    return {
        total: videoIds.length,
        processed,
        skipped,
        failed,
        results
    }
})
