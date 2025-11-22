import type { VideoData } from '~/types/youtube'

interface UseYoutubeVideosOptions {
    handle?: string | Ref<string>
    ids?: string[] | Ref<string[]>
}

export const useYoutubeVideos = (options: UseYoutubeVideosOptions) => {
    const query = computed(() => {
        const q: Record<string, string> = {}
        const handle = toValue(options.handle)
        const ids = toValue(options.ids)

        if (handle) {
            q.handle = handle
        }

        if (ids && ids.length > 0) {
            q.ids = ids.join(',')
        }
        return q
    })

    // Create a stable key for caching
    const cacheKey = computed(() => {
        const q = query.value
        if (q.handle) return `youtube-videos-${q.handle}`
        if (q.ids) return `youtube-videos-${q.ids}`
        return 'youtube-videos'
    })

    return useFetch<VideoData[]>('/api/youtube/videos', {
        query,
        key: cacheKey,
        dedupe: 'defer', // Deduplicate requests with same key
    })
}
