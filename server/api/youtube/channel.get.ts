import { getCachedChannel, setCachedChannel } from '../../utils/metadataCache'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const handle = (query.handle as string) || config.youtubeChannelHandles

    if (!handle) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Handle is required',
        })
    }

    // Check cache first
    const cachedData = await getCachedChannel(handle)
    if (cachedData) {
        console.log(`[Cache HIT] Channel: ${handle}`)
        return cachedData
    }

    console.log(`[Cache MISS] Channel: ${handle} - Fetching from API`)

    const client = new YouTubeClient({ apiKey: config.youtubeApiKey })
    const channel = await client.getChannelByHandle(handle)

    if (!channel) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Channel not found',
        })
    }

    const data = {
        id: channel.id,
        handle: channel.snippet.customUrl,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl,
        country: channel.snippet.country,
        publishedAt: channel.snippet.publishedAt,
        stats: {
            viewCount: parseInt(channel.statistics.viewCount),
            subscriberCount: parseInt(channel.statistics.subscriberCount),
            hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount,
            videoCount: parseInt(channel.statistics.videoCount),
        },
        raw: channel,
    }

    // Cache the result
    await setCachedChannel(handle, data)

    return data
})
