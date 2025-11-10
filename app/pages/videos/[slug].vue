<template>
  <!-- Loading State -->
  <div v-if="!video && slug" class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <div class="py-12">
      <UIcon name="i-twemoji-arrows-counterclockwise" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">{{ $t('videos.loading') || 'Loading video...' }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Slug: {{ slug }}</p>
    </div>
  </div>
  
  <!-- Video Detail Page -->
  <div v-else-if="video" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Video Header -->
    <div class="mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ video.title[locale] || video.title.fa }}
      </h1>
      
      <!-- Large Thumbnail with Play Icon -->
      <div class="relative mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-video shadow-xl">
        <a
          :href="video.youtubeUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full h-full"
          :aria-label="`${$t('videos.watchOnYouTube')}: ${video.title[locale] || video.title.fa}`"
        >
          <NuxtImg
            :src="video.thumbnail"
            :alt="video.title[locale] || video.title.fa"
            class="w-full h-full object-cover"
            loading="eager"
            format="webp"
          />
          <!-- Play Icon Overlay (YouTube-style) -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer">
            <div class="w-24 h-24 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform min-w-[96px] min-h-[96px]">
              <UIcon name="i-twemoji-play-button" class="text-white text-4xl" :class="locale === 'fa' ? 'mr-2' : 'ml-2'" />
            </div>
          </div>
          <!-- Duration Badge -->
          <div v-if="video.duration" class="absolute bottom-4 right-4 bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg font-medium">
            {{ formatDuration(video.duration) }}
          </div>
        </a>
      </div>

      <!-- Video Metadata -->
      <div class="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
        <div v-if="video.viewCount" class="flex items-center gap-2">
          <UIcon name="i-twemoji-eyes" class="w-5 h-5" />
          <span>{{ formatViewCount(video.viewCount) }} {{ $t('videos.views') }}</span>
        </div>
        <div v-if="video.channelName" class="flex items-center gap-2">
          <UIcon name="i-twemoji-video-camera" class="w-5 h-5" />
          <span>{{ video.channelName }}</span>
        </div>
      </div>

      <!-- Watch on YouTube Button -->
      <UButton
        :href="video.youtubeUrl"
        target="_blank"
        rel="noopener noreferrer"
        color="red"
        size="lg"
        icon="i-twemoji-play-button"
        class="mb-6 min-h-[48px]"
      >
        {{ $t('videos.watchOnYouTube') }}
      </UButton>

      <!-- Description -->
      <div v-if="video.description?.[locale] || video.description?.fa" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('videos.description') || 'Description' }}
        </h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ video.description?.[locale] || video.description?.fa }}
        </p>
      </div>
    </div>

    <!-- Related Skills Section -->
    <div v-if="relatedSkills.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('videos.relatedSkills') || 'Related Skills' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('videos.relatedSkillsDescription') || 'Skills related to this video' }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        <SkillCard
          v-for="skill in relatedSkills"
          :key="skill.id"
          :skill="skill"
          :show-description="true"
          :show-footer="false"
          variant="compact"
        />
      </div>
    </div>

    <!-- Related Books Section -->
    <div v-if="relatedBooks.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('videos.relatedBooks') || 'Related Books' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('videos.relatedBooksDescription') || 'Books mentioned or related to this video' }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BookCard
          v-for="book in relatedBooks"
          :key="`${book.title}-${book.author}`"
          :book="book"
        />
      </div>
    </div>

    <!-- Related Writers Section -->
    <div v-if="relatedWriter" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('videos.relatedWriter') || 'Featured Writer' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('videos.relatedWriterDescription') || 'Writer featured in this video' }}
      </p>
      <WriterCard :writer="relatedWriter" />
    </div>

    <!-- Tags Section -->
    <div v-if="videoTags.length > 0" class="mb-12">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('tags.title') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <TagBadge
          v-for="tag in videoTags"
          :key="tag.slug"
          :tag="tag"
          :clickable="true"
          size="sm"
        />
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center gap-4 mt-12">
      <UButton :to="localePath('/videos')" variant="soft" color="primary" icon="i-twemoji-left-arrow" class="min-h-[44px]">
        {{ $t('videos.backToVideos') }}
      </UButton>
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-twemoji-house" class="min-h-[44px]">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>

  <!-- 404 Page -->
  <div v-else class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      {{ $t('videos.notFound') }}
    </p>
    <UButton :to="localePath('/videos')" color="primary" class="min-h-[44px]">
      {{ $t('videos.backToVideos') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { getVideoBySlug, generateVideoSlug } from '~/utils/videos'
import { getSkillsByIds } from '~/utils/skills'
import { getBookBySlug } from '~/utils/books'
import { getWriterBySlug } from '~/utils/writers'
import { getTagsForVideo } from '~/utils/tags'
import SkillCard from '~/components/skills/SkillCard.vue'
import BookCard from '~/components/books/BookCard.vue'
import WriterCard from '~/components/writers/WriterCard.vue'
import TagBadge from '~/components/tags/TagBadge.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import type { Video, Skill, Book, Writer, Tag } from '~/types'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Get video slug from route
const slug = computed(() => {
  const param = route.params?.slug
  if (!param) return ''
  return Array.isArray(param) ? param[0] : String(param)
})

// Get video data - use ref to avoid computed dependency issues
const video = ref<Video | undefined>(undefined)
const relatedSkills = ref<Skill[]>([])
const relatedBooks = ref<Book[]>([])
const relatedWriter = ref<Writer | undefined>(undefined)
const videoTags = ref<Tag[]>([])

// Load data when route changes
watch([slug, locale], () => {
  if (!slug.value) {
    video.value = undefined
    relatedSkills.value = []
    relatedBooks.value = []
    relatedWriter.value = undefined
    videoTags.value = []
    return
  }
  
  try {
    const currentLocale = locale.value as 'fa' | 'en'
    video.value = getVideoBySlug(slug.value, currentLocale)
    
    if (video.value) {
      // Load related skills
      relatedSkills.value = getSkillsByIds(video.value.skillIds, currentLocale)
      
      // Load related books
      if (video.value.bookIds && video.value.bookIds.length > 0) {
        relatedBooks.value = video.value.bookIds
          .map((bookSlug) => getBookBySlug(bookSlug, currentLocale))
          .filter((book) => book !== undefined) as Book[]
      } else {
        relatedBooks.value = []
      }
      
      // Load related writer
      if (video.value.writerId) {
        relatedWriter.value = getWriterBySlug(video.value.writerId, currentLocale)
      } else {
        relatedWriter.value = undefined
      }
      
      // Load tags
      videoTags.value = getTagsForVideo(video.value.id, currentLocale)
    } else {
      relatedSkills.value = []
      relatedBooks.value = []
      relatedWriter.value = undefined
      videoTags.value = []
    }
  } catch (error) {
    console.error('Error loading video:', error)
    video.value = undefined
    relatedSkills.value = []
    relatedBooks.value = []
    relatedWriter.value = undefined
    videoTags.value = []
  }
}, { immediate: true })

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

// Format view count (e.g., 50000 -> "50K")
const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Set page title - use computed to avoid infinite loops
const pageTitle = computed(() => {
  if (video.value) {
    return `${video.value.title[locale.value] || video.value.title.fa} - ${t('videos.title')} - 15ecosystem`
  }
  return `${t('videos.notFound')} - 15ecosystem`
})

const pageDescription = computed(() => {
  if (video.value) {
    return video.value.description?.[locale.value] || video.value.description?.fa || t('videos.description')
  }
  return t('videos.notFound')
})

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items: Array<{ label: string; to?: string; icon?: string }> = [
    {
      label: t('breadcrumb.home'),
      to: '/',
      icon: 'i-twemoji-house'
    },
    {
      label: t('videos.title'),
      to: '/videos',
      icon: 'i-twemoji-video-camera'
    }
  ]
  
  if (video.value) {
    items.push({
      label: video.value.title[locale.value] || video.value.title.fa
      // to and icon omitted for current page
    })
  }
  
  return items
})

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    {
      property: 'og:title',
      content: pageTitle,
    },
    {
      property: 'og:description',
      content: pageDescription,
    },
    {
      property: 'og:image',
      content: computed(() => video.value?.thumbnail || ''),
    },
    {
      property: 'og:type',
      content: 'video.other',
    },
    {
      property: 'og:video:url',
      content: computed(() => video.value?.youtubeUrl || ''),
    },
  ],
})
</script>

<style scoped>
/* Ensure aspect ratio for thumbnail */
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>

