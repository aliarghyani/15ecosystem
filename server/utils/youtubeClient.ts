interface YouTubeClientOptions {
    apiKey: string
}

export class YouTubeClient {
    private apiKey: string
    private baseUrl = 'https://www.googleapis.com/youtube/v3'

    constructor(options: YouTubeClientOptions) {
        this.apiKey = options.apiKey
    }

    private async request<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
        if (!this.apiKey) {
            throw createError({
                statusCode: 500,
                statusMessage: 'YouTube API key not configured',
            })
        }

        const query = new URLSearchParams({
            key: this.apiKey,
            ...Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
            ),
        })

        const url = `${this.baseUrl}${path}?${query.toString()}`

        try {
            // Add a small delay to be quota-friendly
            await new Promise((resolve) => setTimeout(resolve, 100))

            const response = await fetch(url)

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`YouTube API Error (${response.status}):`, errorText)
                throw createError({
                    statusCode: response.status,
                    statusMessage: `YouTube API Error: ${response.statusText}`,
                    data: errorText,
                })
            }

            return (await response.json()) as T
        } catch (error: any) {
            // If it's already an H3Error, rethrow it
            if (error.statusCode) {
                throw error
            }
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch from YouTube API',
                cause: error
            })
        }
    }

    async getChannelByHandle(handle: string) {
        const cleanHandle = handle.replace(/^@/, '')
        const response = await this.request<any>('/channels', {
            part: 'snippet,contentDetails,statistics,brandingSettings,topicDetails,status',
            forHandle: cleanHandle,
        })

        return response.items?.[0] || null
    }

    async getPlaylistsByChannelId(channelId: string) {
        let allItems: any[] = []
        let nextPageToken: string | undefined = undefined

        do {
            const response: any = await this.request<any>('/playlists', {
                part: 'snippet,contentDetails,status',
                channelId,
                maxResults: 50,
                pageToken: nextPageToken,
            })

            if (response.items) {
                allItems = allItems.concat(response.items)
            }
            nextPageToken = response.nextPageToken

            // Delay between pages
            if (nextPageToken) await new Promise((resolve) => setTimeout(resolve, 200))

        } while (nextPageToken)

        return allItems
    }

    async getUploadsPlaylistId(channel: any): Promise<string | null> {
        return channel?.contentDetails?.relatedPlaylists?.uploads || null
    }

    async getAllPlaylistItems(playlistId: string) {
        let allItems: any[] = []
        let nextPageToken: string | undefined = undefined

        do {
            const response: any = await this.request<any>('/playlistItems', {
                part: 'snippet,contentDetails,status',
                playlistId,
                maxResults: 50,
                pageToken: nextPageToken,
            })

            if (response.items) {
                allItems = allItems.concat(response.items)
            }
            nextPageToken = response.nextPageToken

            // Delay between pages
            if (nextPageToken) await new Promise((resolve) => setTimeout(resolve, 200))

        } while (nextPageToken)

        return allItems
    }

    async getVideosByIds(videoIds: string[]) {
        if (videoIds.length === 0) return []

        const chunks = []
        for (let i = 0; i < videoIds.length; i += 50) {
            chunks.push(videoIds.slice(i, i + 50))
        }

        let allVideos: any[] = []

        for (const chunk of chunks) {
            const response = await this.request<any>('/videos', {
                part: 'snippet,contentDetails,statistics,status,topicDetails,player',
                id: chunk.join(','),
            })

            if (response.items) {
                allVideos = allVideos.concat(response.items)
            }

            // Delay between chunks
            if (chunks.length > 1) await new Promise((resolve) => setTimeout(resolve, 200))
        }

        return allVideos
    }
}
