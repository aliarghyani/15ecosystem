<script setup lang="ts">
import { getAllVideos } from '~/utils/videos'

const inputHandle = ref('@KhashayarTalks')
const currentHandle = ref('@KhashayarTalks')

const { data: channel, pending: channelPending, error: channelError } = await useYoutubeChannel(currentHandle)
const { data: videos, pending: videosPending, error: videosError } = await useYoutubeVideos({ handle: currentHandle })

const fetchHandle = () => {
    currentHandle.value = inputHandle.value
}

// Batch Fetch Transcripts
const batchFetchLoading = ref(false)
const batchFetchResult = ref<any>(null)

const fetchAllTranscripts = async () => {
    batchFetchLoading.value = true
    batchFetchResult.value = null
    try {
        const videoIds = getAllVideos('fa').map(v => v.youtubeId)
        const result = await $fetch('/api/youtube/transcript-batch', {
            method: 'POST',
            body: { videoIds, language: 'fa' }
        })
        batchFetchResult.value = result
    } catch (e) {
        console.error(e)
        batchFetchResult.value = { error: String(e) }
    } finally {
        batchFetchLoading.value = false
    }
}

// Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

// Format duration from seconds to MM:SS or HH:MM:SS
const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Format relative time (e.g., "2 days ago", "3 months ago")
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
        <!-- Search Bar -->
        <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center gap-4">
                    <UInput v-model="inputHandle" placeholder="@Handle" @keyup.enter="fetchHandle" size="lg"
                        class="flex-1 max-w-md" />
                    <UButton @click="fetchHandle" :loading="channelPending || videosPending" size="lg" color="primary">
                        Fetch
                    </UButton>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-6 space-y-8">
            <!-- Error States -->
            <UAlert v-if="channelError" color="error" variant="soft" title="Error loading channel"
                :description="String(channelError)" />

            <!-- Admin Actions -->
            <UCard>
                <template #header>
                    <h3 class="text-lg font-bold">Admin Actions</h3>
                </template>

                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                        <UButton @click="fetchAllTranscripts" :loading="batchFetchLoading" color="warning">
                            Batch Fetch Transcripts ({{ getAllVideos('fa').length }} videos)
                        </UButton>
                    </div>

                    <div v-if="batchFetchResult"
                        class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs font-mono overflow-auto max-h-64">
                        <pre>{{ JSON.stringify(batchFetchResult, null, 2) }}</pre>
                    </div>
                </div>
            </UCard>

            <!-- Channel Header -->
            <div v-if="channel"
                class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="p-6 md:p-8">
                    <div class="flex flex-col md:flex-row items-start gap-6">
                        <img :src="channel.raw.snippet.thumbnails?.medium?.url || channel.raw.snippet.thumbnails?.default?.url"
                            class="w-32 h-32 rounded-full ring-4 ring-gray-100 dark:ring-gray-800"
                            :alt="channel.title" />
                        <div class="flex-1">
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {{ channel.title }}
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400 mb-3">{{ channel.handle }}</p>

                            <div class="flex gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <span class="font-medium">
                                    {{ formatNumber(channel.stats.subscriberCount) }} subscribers
                                </span>
                                <span>{{ formatNumber(channel.stats.videoCount) }} videos</span>
                                <span>{{ formatNumber(channel.stats.viewCount) }} views</span>
                            </div>

                            <p class="text-gray-700 dark:text-gray-300 max-w-3xl line-clamp-3">
                                {{ channel.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Videos Error -->
            <UAlert v-if="videosError" color="error" variant="soft" title="Error loading videos"
                :description="String(videosError)" />

            <!-- Videos Grid -->
            <div v-if="videos && videos.length > 0">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Videos</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="video in videos" :key="video.id" class="group cursor-pointer">
                        <!-- Thumbnail -->
                        <div class="relative mb-3 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                            <img :src="video.thumbnails?.medium?.url || video.thumbnails?.default?.url"
                                class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
                                :alt="video.title" />
                            <!-- Duration Badge -->
                            <div
                                class="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                                {{ formatDuration(video.durationSeconds) }}
                            </div>
                        </div>

                        <!-- Video Info -->
                        <div class="flex gap-3">
                            <!-- Channel Avatar (small) -->
                            <img v-if="channel" :src="channel.raw.snippet.thumbnails?.default?.url"
                                class="w-9 h-9 rounded-full flex-shrink-0 mt-1" :alt="channel.title" />

                            <div class="flex-1 min-w-0">
                                <!-- Title -->
                                <h3 class="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                    :title="video.title">
                                    {{ video.title }}
                                </h3>

                                <!-- Channel Name -->
                                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {{ channel?.title }}
                                </p>

                                <!-- Views & Date -->
                                <div class="text-xs text-gray-600 dark:text-gray-400">
                                    <span>{{ formatNumber(video.stats.viewCount) }} views</span>
                                    <span class="mx-1">•</span>
                                    <span>{{ formatRelativeTime(video.publishedAt) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="videosPending" class="flex justify-center items-center py-12">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin">
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">Loading videos...</p>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!videosPending && videos && videos.length === 0" class="text-center py-12">
                <p class="text-gray-600 dark:text-gray-400">No videos found for this channel.</p>
            </div>
        </div>
    </div>
</template>
