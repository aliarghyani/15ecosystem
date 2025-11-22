import { getTranscript, fetchTranscript, hasTranscript } from '../../utils/transcriptCache'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const videoId = query.videoId as string
    const force = query.force === 'true'

    if (!videoId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'videoId is required',
        })
    }

    // Check if we have a cached transcript
    if (!force) {
        const cached = await getTranscript(videoId)
        if (cached) {
            console.log(`[Transcript Cache HIT] ${videoId}`)
            return cached
        }
    }

    console.log(`[Transcript Cache MISS] Fetching ${videoId}`)

    // Fetch video details to get title
    const videoTitle = query.title as string || 'Unknown Video'
    const language = query.language as string || 'en'

    try {
        const transcript = await fetchTranscript(videoId, {
            title: videoTitle,
            language
        })
        return transcript
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch transcript: ${error}`,
        })
    }
})
