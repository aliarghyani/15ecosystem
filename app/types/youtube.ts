export interface ChannelData {
    id: string
    handle: string
    title: string
    description: string
    customUrl?: string
    country?: string
    publishedAt: string
    stats: {
        viewCount: number
        subscriberCount: number
        hiddenSubscriberCount: boolean
        videoCount: number
    }
    raw: any
}

export interface PlaylistData {
    id: string
    channelId: string
    title: string
    description: string
    itemCount: number
    publishedAt: string
    raw: any
}

export interface UploadItem {
    id: string
    videoId: string
    channelId: string
    title: string
    description: string
    publishedAt: string
    position: number
    thumbnails: Record<string, { url: string; width: number; height: number }>
    raw: any
}

export interface VideoData {
    id: string
    channelId: string
    title: string
    description: string
    publishedAt: string
    durationISO: string
    durationSeconds: number
    tags?: string[]
    stats: {
        viewCount: number
        likeCount?: number
        commentCount?: number
    }
    topics?: string[]
    thumbnails: Record<string, { url: string; width: number; height: number }>
    raw: any
}
