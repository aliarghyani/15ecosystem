import { getTranscriptStats } from '../../utils/transcriptCache'

export default defineEventHandler(async () => {
    const stats = await getTranscriptStats()
    return stats
})
