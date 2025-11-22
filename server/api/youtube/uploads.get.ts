import { getCachedUploads, setCachedUploads } from '../../utils/metadataCache'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const handle = (query.handle as string) || config.youtubeChannelHandles

    // Check cache first
    const cachedData = await getCachedUploads(handle)
    if (cachedData) {
        console.log(`[Cache HIT] Uploads for: ${handle}`)
        return cachedData
    }

    console.log(`[Cache MISS] Uploads for: ${handle} - Fetching from API`)

    const client = new YouTubeClient({ apiKey: config.youtubeApiKey })
    const channel = await client.getChannelByHandle(handle)

    if (!channel) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Channel not found',
        })
    }

    const uploadsPlaylistId = await client.getUploadsPlaylistId(channel)
    if (!uploadsPlaylistId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Uploads playlist not found',
        })
    }

    const items = await client.getAllPlaylistItems(uploadsPlaylistId)

    const data = items.map((item: any) => ({
        id: item.id,
        videoId: item.contentDetails.videoId,
        channelId: item.snippet.channelId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        position: item.snippet.position,
        thumbnails: item.snippet.thumbnails,
        raw: item,
    }))

    // Cache the result
    await setCachedUploads(handle, data)

    return data
})
