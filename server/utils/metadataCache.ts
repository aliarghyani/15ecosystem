import { promises as fs } from 'fs'
import path from 'path'
import type { ChannelData, UploadItem, VideoData } from '~/types/youtube'

interface CacheMetadata {
    lastUpdated: number
    ttl: number // Time to live in milliseconds
}

interface ChannelCache {
    metadata: CacheMetadata
    data: ChannelData
}

interface UploadsCache {
    metadata: CacheMetadata
    channelHandle: string
    data: UploadItem[]
}

interface VideosCache {
    metadata: CacheMetadata
    videos: Record<string, VideoData> // videoId -> VideoData
}

interface MetadataCache {
    channels: Record<string, ChannelCache> // channelHandle -> ChannelCache
    uploads: Record<string, UploadsCache> // channelHandle -> UploadsCache
    videos: VideosCache
}

const CACHE_DIR = path.join(process.cwd(), 'server', 'data', 'cache')
const CACHE_FILE = path.join(CACHE_DIR, 'youtube-metadata.json')
const DEFAULT_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true })
    } catch (error) {
        console.error('Failed to create cache directory:', error)
    }
}

/**
 * Read cache from disk
 */
async function readCache(): Promise<MetadataCache> {
    try {
        await ensureCacheDir()
        const data = await fs.readFile(CACHE_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        // Cache doesn't exist or is invalid, return empty cache
        return {
            channels: {},
            uploads: {},
            videos: { metadata: { lastUpdated: 0, ttl: DEFAULT_TTL }, videos: {} }
        }
    }
}

/**
 * Write cache to disk
 */
async function writeCache(cache: MetadataCache): Promise<void> {
    try {
        await ensureCacheDir()
        await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8')
    } catch (error) {
        console.error('Failed to write cache:', error)
    }
}

/**
 * Check if cache entry is valid
 */
function isCacheValid(metadata: CacheMetadata): boolean {
    const now = Date.now()
    return now - metadata.lastUpdated < metadata.ttl
}

/**
 * Get cached channel data
 */
export async function getCachedChannel(channelHandle: string): Promise<ChannelData | null> {
    const cache = await readCache()
    const channelCache = cache.channels[channelHandle]

    if (channelCache && isCacheValid(channelCache.metadata)) {
        return channelCache.data
    }

    return null
}

/**
 * Set cached channel data
 */
export async function setCachedChannel(channelHandle: string, data: ChannelData, ttl: number = DEFAULT_TTL): Promise<void> {
    const cache = await readCache()

    cache.channels[channelHandle] = {
        metadata: {
            lastUpdated: Date.now(),
            ttl
        },
        data
    }

    await writeCache(cache)
}

/**
 * Get cached uploads data
 */
export async function getCachedUploads(channelHandle: string): Promise<UploadItem[] | null> {
    const cache = await readCache()
    const uploadsCache = cache.uploads[channelHandle]

    if (uploadsCache && isCacheValid(uploadsCache.metadata)) {
        return uploadsCache.data
    }

    return null
}

/**
 * Set cached uploads data
 */
export async function setCachedUploads(channelHandle: string, data: UploadItem[], ttl: number = DEFAULT_TTL): Promise<void> {
    const cache = await readCache()

    cache.uploads[channelHandle] = {
        metadata: {
            lastUpdated: Date.now(),
            ttl
        },
        channelHandle,
        data
    }

    await writeCache(cache)
}

/**
 * Get cached video data
 */
export async function getCachedVideos(videoIds: string[]): Promise<Record<string, VideoData>> {
    const cache = await readCache()
    const result: Record<string, VideoData> = {}

    for (const videoId of videoIds) {
        const video = cache.videos.videos[videoId]
        if (video) {
            result[videoId] = video
        }
    }

    return result
}

/**
 * Set cached video data
 */
export async function setCachedVideos(videos: VideoData[], ttl: number = DEFAULT_TTL): Promise<void> {
    const cache = await readCache()

    if (!cache.videos.metadata) {
        cache.videos.metadata = {
            lastUpdated: Date.now(),
            ttl
        }
    }

    for (const video of videos) {
        cache.videos.videos[video.id] = video
    }

    cache.videos.metadata.lastUpdated = Date.now()

    await writeCache(cache)
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
    const emptyCache: MetadataCache = {
        channels: {},
        uploads: {},
        videos: { metadata: { lastUpdated: 0, ttl: DEFAULT_TTL }, videos: {} }
    }

    await writeCache(emptyCache)
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
    const cache = await readCache()

    return {
        channels: Object.keys(cache.channels).length,
        uploads: Object.keys(cache.uploads).length,
        videos: Object.keys(cache.videos.videos).length,
        cacheFile: CACHE_FILE
    }
}
