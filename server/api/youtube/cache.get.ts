import { getCacheStats, clearCache } from '../../utils/metadataCache'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const action = query.action as string

    if (action === 'clear') {
        await clearCache()
        return { success: true, message: 'Cache cleared successfully' }
    }

    const stats = await getCacheStats()
    return stats
})
