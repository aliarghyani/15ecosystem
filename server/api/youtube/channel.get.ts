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

    const client = new YouTubeClient({ apiKey: config.youtubeApiKey })
    const channel = await client.getChannelByHandle(handle)

    if (!channel) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Channel not found',
        })
    }

    return {
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
})
