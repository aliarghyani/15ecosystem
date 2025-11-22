export default defineEventHandler(async (event) => {
    const { getCacheStats } = await import('../../utils/metadataCache')
    const stats = await getCacheStats()

    // Read the actual cache file to see its contents
    const fs = await import('fs/promises')
    const path = await import('path')
    const cacheFile = path.join(process.cwd(), 'server', 'data', 'cache', 'youtube-metadata.json')

    let fileContents = null
    let fileSize = 0
    let lastModified = null

    try {
        const fileStats = await fs.stat(cacheFile)
        fileSize = fileStats.size
        lastModified = fileStats.mtime

        const rawData = await fs.readFile(cacheFile, 'utf-8')
        const parsed = JSON.parse(rawData)

        fileContents = {
            channelCount: Object.keys(parsed.channels || {}).length,
            uploadsCount: Object.keys(parsed.uploads || {}).length,
            videosCount: Object.keys(parsed.videos?.videos || {}).length,
            channelHandles: Object.keys(parsed.channels || {}),
            sample: {
                firstChannel: Object.keys(parsed.channels || {})[0],
                firstChannelData: parsed.channels?.[Object.keys(parsed.channels || {})[0]]?.metadata
            }
        }
    } catch (error) {
        fileContents = { error: String(error) }
    }

    return {
        stats,
        file: {
            path: cacheFile,
            size: fileSize,
            lastModified,
            contents: fileContents
        },
        serverTime: new Date().toISOString()
    }
})
