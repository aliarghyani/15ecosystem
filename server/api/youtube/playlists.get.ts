export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const handle = query.handle as string
    let channelId = query.channelId as string

    const client = new YouTubeClient({ apiKey: config.youtubeApiKey })

    if (handle) {
        const channel = await client.getChannelByHandle(handle)
        if (channel) {
            channelId = channel.id
        }
    }

    if (!channelId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Channel ID or Handle is required',
        })
    }

    const playlists = await client.getPlaylistsByChannelId(channelId)

    return playlists.map((item: any) => ({
        id: item.id,
        channelId: item.snippet.channelId,
        title: item.snippet.title,
        description: item.snippet.description,
        itemCount: item.contentDetails.itemCount,
        publishedAt: item.snippet.publishedAt,
        raw: item,
    }))
})
