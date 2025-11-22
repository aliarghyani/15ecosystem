export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const handle = query.handle as string
    const ids = query.ids as string

    const client = new YouTubeClient({ apiKey: config.youtubeApiKey })
    let videoIds: string[] = []

    if (ids) {
        videoIds = ids.split(',').map((id) => id.trim()).filter(Boolean)
    } else if (handle) {
        // If handle provided, fetch uploads playlist and get all video IDs
        // Note: This might be heavy if channel has many videos, but for this use case it's okay
        const channel = await client.getChannelByHandle(handle)
        if (channel) {
            const uploadsId = await client.getUploadsPlaylistId(channel)
            if (uploadsId) {
                const items = await client.getAllPlaylistItems(uploadsId)
                videoIds = items.map((item: any) => item.contentDetails.videoId)
            }
        }
    }

    if (videoIds.length === 0) {
        return []
    }

    const videos = await client.getVideosByIds(videoIds)

    return videos.map((video: any) => ({
        id: video.id,
        channelId: video.snippet.channelId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        durationISO: video.contentDetails.duration,
        durationSeconds: parseIsoDuration(video.contentDetails.duration),
        tags: video.snippet.tags || [],
        stats: {
            viewCount: parseInt(video.statistics.viewCount),
            likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : undefined,
            commentCount: video.statistics.commentCount ? parseInt(video.statistics.commentCount) : undefined,
        },
        topics: video.topicDetails?.topicCategories || [],
        thumbnails: video.snippet.thumbnails,
        raw: video,
    }))
})
