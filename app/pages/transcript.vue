<script setup lang="ts">
import { getAllVideos } from '~/utils/videos'

const { locale, t } = useI18n()
const localePath = useLocalePath()

// State
const selectedVideoId = ref<string | null>(null)
const searchQuery = ref('')

// Get videos
const allVideos = computed(() => getAllVideos(locale.value as 'fa' | 'en'))

// Filter videos
const filteredVideos = computed(() => {
  if (!searchQuery.value) return allVideos.value
  const query = searchQuery.value.toLowerCase()
  return allVideos.value.filter(v =>
    (v.title[locale.value] || '').toLowerCase().includes(query) ||
    v.title.fa.toLowerCase().includes(query) ||
    v.title.en.toLowerCase().includes(query)
  )
})

// Fetch transcript
const { data: transcriptData, pending: transcriptPending, error: transcriptError, refresh } = useFetch('/api/youtube/transcript', {
  query: computed(() => ({ videoId: selectedVideoId.value })),
  immediate: false,
  watch: [selectedVideoId]
})

const selectVideo = async (videoId: string) => {
  console.log('Selecting video:', videoId)
  selectedVideoId.value = videoId
  // Manually trigger refresh to ensure fetch happens
  await refresh()
}

// Format duration
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Set page title
useHead({
  title: computed(() => `${t('transcript.title')} - 15ecosystem`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('transcript.description')),
    },
  ],
})
</script>

<template>
  <div class="max-w-7xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ $t('transcript.title') }}
      </span>
    </nav>

    <!-- Page Header -->
    <div class="mb-8">
      <h1
        class="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('transcript.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('transcript.description') }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Sidebar: Video List -->
      <div class="lg:col-span-4 space-y-4">
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass"
          :placeholder="$t('common.search') || 'Search videos...'" />

        <div
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden h-[600px] overflow-y-auto">
          <div v-for="video in filteredVideos" :key="video.id" @click="selectVideo(video.youtubeId)"
            class="p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/10': selectedVideoId === video.youtubeId }">
            <h3 class="text-sm font-medium line-clamp-2 text-gray-900 dark:text-gray-100">
              {{ video.title[locale] || video.title.fa }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">{{ video.channelName }}</p>
          </div>

          <div v-if="filteredVideos.length === 0" class="p-4 text-center text-gray-500 text-sm">
            No videos found
          </div>
        </div>
      </div>

      <!-- Main: Transcript -->
      <div class="lg:col-span-8">
        <UCard class="h-[600px] overflow-hidden flex flex-col">
          <div v-if="selectedVideoId" class="h-full overflow-y-auto p-4">
            <div v-if="transcriptPending" class="flex justify-center items-center h-full">
              <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl text-primary-500" />
            </div>

            <div v-else-if="transcriptError" class="flex flex-col items-center justify-center h-full text-red-500">
              <UIcon name="i-heroicons-exclamation-circle" class="text-4xl mb-2" />
              <p>Error loading transcript</p>
              <p class="text-xs mt-2 opacity-70">{{ transcriptError }}</p>
              <p class="text-xs mt-1 opacity-50">Video ID: {{ selectedVideoId }}</p>
            </div>

            <div v-else-if="transcriptData" class="prose dark:prose-invert max-w-none">
              <h2
                class="text-xl font-bold mb-4 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10 border-b border-gray-200 dark:border-gray-800">
                {{ transcriptData.title || 'Transcript' }}
              </h2>

              <!-- Display transcript segments -->
              <div v-if="transcriptData.segments && transcriptData.segments.length > 0">
                <div v-for="(segment, index) in transcriptData.segments" :key="index"
                  class="mb-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded transition-colors">
                  <div class="flex gap-3">
                    <span class="text-xs text-gray-400 font-mono mt-1 select-none w-12 flex-shrink-0">
                      {{ formatDuration(segment.start) }}
                    </span>
                    <p class="m-0 text-gray-800 dark:text-gray-200 leading-relaxed"
                      :dir="segment.text.match(/[\u0600-\u06FF]/) ? 'rtl' : 'ltr'">
                      {{ segment.text }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500">
                No transcript text available.
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No transcript found for this video.</p>
              <p class="text-xs mt-2">Try running the batch fetch in Dev tools.</p>
              <p class="text-xs mt-1 opacity-50">Video ID: {{ selectedVideoId }}</p>
              <p class="text-xs mt-1 opacity-50">Pending: {{ transcriptPending }}, Error: {{ !!transcriptError }}, Data: {{ !!transcriptData }}</p>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
            <UIcon name="i-heroicons-document-text" class="text-6xl mb-4 opacity-20" />
            <p class="text-lg">Select a video to view its transcript</p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for transcript container */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style>
