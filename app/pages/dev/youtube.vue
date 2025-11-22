<script setup lang="ts">
const inputHandle = ref('@KhashayarTalks')
const currentHandle = ref('@KhashayarTalks')

const { data: channel, pending: channelPending, error: channelError } = await useYoutubeChannel(currentHandle)
const { data: videos, pending: videosPending, error: videosError } = await useYoutubeVideos({ handle: currentHandle })

const fetchHandle = () => {
    currentHandle.value = inputHandle.value
}
</script>

<template>
    <div class="p-6 space-y-8">
        <div class="flex items-center gap-4">
            <UInput v-model="inputHandle" placeholder="@Handle" @keyup.enter="fetchHandle" />
            <UButton @click="fetchHandle" :loading="channelPending || videosPending">Fetch</UButton>
        </div>

        <div v-if="channelError" class="text-red-500 bg-red-50 p-4 rounded">
            <p class="font-bold">Error loading channel:</p>
            <pre class="text-sm mt-2">{{ channelError }}</pre>
        </div>

        <div v-if="channel"
            class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row items-start gap-6">
            <img :src="channel.raw.snippet.thumbnails?.medium?.url || channel.raw.snippet.thumbnails?.default?.url"
                class="w-24 h-24 rounded-full" />
            <div>
                <h1 class="text-2xl font-bold">{{ channel.title }}</h1>
                <p class="text-gray-500">{{ channel.handle }}</p>
                <p class="mt-2 max-w-2xl">{{ channel.description }}</p>
                <div class="mt-4 flex gap-6 text-sm font-medium">
                    <span>{{ channel.stats.subscriberCount }} subscribers</span>
                    <span>{{ channel.stats.videoCount }} videos</span>
                    <span>{{ channel.stats.viewCount }} views</span>
                </div>
            </div>
        </div>

        <div v-if="videosError" class="text-red-500 bg-red-50 p-4 rounded">
            <p class="font-bold">Error loading videos:</p>
            <pre class="text-sm mt-2">{{ videosError }}</pre>
        </div>

        <div v-if="videos" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="video in videos" :key="video.id"
                class="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <div class="relative">
                    <img :src="video.thumbnails?.medium?.url || video.thumbnails?.default?.url"
                        class="w-full aspect-video object-cover" />
                    <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                        {{ video.durationISO.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '') }}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold line-clamp-2 mb-2" :title="video.title">{{ video.title }}</h3>
                    <p class="text-xs text-gray-500 mb-2">{{ new Date(video.publishedAt).toLocaleDateString() }}</p>
                    <div class="flex justify-between text-xs text-gray-400">
                        <span>{{ video.stats.viewCount }} views</span>
                        <span v-if="video.stats.likeCount">{{ video.stats.likeCount }} likes</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
