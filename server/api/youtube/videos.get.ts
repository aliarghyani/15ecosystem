import { getCachedVideos, setCachedVideos, getCachedUploads, setCachedUploads } from '../../utils/metadataCache'

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
        // First check if we have cached uploads for this handle
        const cachedUploads = await getCachedUploads(handle)

        if (cachedUploads) {
            console.log(`[Cache HIT] Using cached uploads for video IDs: ${handle}`)
            videoIds = cachedUploads.map(item => item.videoId)
        } else {
            console.log(`[Cache MISS] Fetching uploads for video IDs: ${handle}`)
            // If handle provided, fetch uploads playlist and get all video IDs
            const channel = await client.getChannelByHandle(handle)
            if (channel) {
                const uploadsId = await client.getUploadsPlaylistId(channel)
                if (uploadsId) {
                    const items = await client.getAllPlaylistItems(uploadsId)
                    videoIds = items.map((item: any) => item.contentDetails.videoId)

                    // Cache the uploads data
                    const uploadsData = items.map((item: any) => ({
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
                    await setCachedUploads(handle, uploadsData)
                    console.log(`[Cache WRITE] Cached ${uploadsData.length} uploads for: ${handle}`)
                }
            }
        }
    }

    if (videoIds.length === 0) {
        return []
    }

    // Check cache for all requested videos
    const cachedVideos = await getCachedVideos(videoIds)
    const cachedIds = Object.keys(cachedVideos)
    const missingIds = videoIds.filter(id => !cachedIds.includes(id))

    console.log(`[Cache] Videos - HIT: ${cachedIds.length}, MISS: ${missingIds.length}`)

    let newVideos: any[] = []
    if (missingIds.length > 0) {
        console.log(`[Cache MISS] Fetching ${missingIds.length} videos from API`)
        newVideos = await client.getVideosByIds(missingIds)

        // Transform and cache new videos
        const transformedVideos = newVideos.map((video: any) => ({
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

        await setCachedVideos(transformedVideos)
    }

    // Combine cached and new videos in the original order
    const allVideos = videoIds.map(id => {
        return cachedVideos[id] || newVideos.find((v: any) => v.id === id)
    }).filter(Boolean)

    return allVideos
})
