<template>
  <!-- Loading State -->
  <div v-if="!playlist && slug" class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <div class="py-12">
      <UIcon name="i-twemoji-arrows-counterclockwise" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">{{ $t('playlists.loading') || 'Loading playlist...' }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Slug: {{ slug }}</p>
    </div>
  </div>
  
  <!-- Playlist Detail Page -->
  <div v-else-if="playlist" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Playlist Header -->
    <div class="mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ playlist.title[locale] || playlist.title.fa }}
      </h1>
      
      <!-- Large Thumbnail -->
      <div class="relative mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-video shadow-xl">
        <NuxtImg
          :src="playlist.thumbnail"
          :alt="playlist.title[locale] || playlist.title.fa"
          class="w-full h-full object-cover"
          loading="eager"
          format="webp"
        />
        <!-- Video Count Badge -->
        <div class="absolute bottom-4 right-4 bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg font-medium flex items-center gap-2">
          <UIcon name="i-twemoji-video-camera" class="w-5 h-5" />
          <span>{{ playlist.videoCount }} {{ $t('playlists.videos') }}</span>
        </div>
      </div>

      <!-- Playlist Metadata -->
      <div class="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
        <div v-if="playlist.channelName" class="flex items-center gap-2">
          <UIcon name="i-twemoji-video-camera" class="w-5 h-5" />
          <span>{{ playlist.channelName }}</span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="playlist.description?.[locale] || playlist.description?.fa" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('playlists.description') || 'Description' }}
        </h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ playlist.description?.[locale] || playlist.description?.fa }}
        </p>
      </div>
    </div>

    <!-- Videos in Playlist -->
    <div v-if="playlistVideos.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('playlists.videosInPlaylist') || 'Videos in Playlist' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('playlists.videosInPlaylistDescription') || 'All videos in this playlist' }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <VideoCard
          v-for="video in playlistVideos"
          :key="video.id"
          :video="video"
          :show-description="false"
          variant="default"
        />
      </div>
    </div>

    <!-- Related Skills Section -->
    <div v-if="relatedSkills.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('playlists.relatedSkills') || 'Related Skills' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('playlists.relatedSkillsDescription') || 'Skills related to this playlist' }}
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

    <!-- Related Categories Section -->
    <div v-if="relatedCategories.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('playlists.relatedCategories') || 'Related Categories' }}
      </h2>
      <div class="flex flex-wrap gap-4">
        <UButton
          v-for="category in relatedCategories"
          :key="category.id"
          :to="localePath(`/categories/${category.id}`)"
          variant="soft"
          color="primary"
          class="min-h-[44px]"
        >
          {{ category.name[locale] || category.name.fa }}
        </UButton>
      </div>
    </div>

    <!-- Tags Section -->
    <div v-if="playlistTags.length > 0" class="mb-12">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('tags.title') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <TagBadge
          v-for="tag in playlistTags"
          :key="tag.slug"
          :tag="tag"
          :clickable="true"
          size="sm"
        />
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center gap-4 mt-12">
      <UButton :to="localePath('/playlists')" variant="soft" color="primary" icon="i-twemoji-left-arrow" class="min-h-[44px]">
        {{ $t('playlists.backToPlaylists') }}
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
      {{ $t('playlists.notFound') }}
    </p>
    <UButton :to="localePath('/playlists')" color="primary" class="min-h-[44px]">
      {{ $t('playlists.backToPlaylists') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { getPlaylistBySlug, generatePlaylistSlug } from '~/utils/playlists'
import { getVideosBySkillId, getAllVideos } from '~/utils/videos'
import { getSkillsByIds } from '~/utils/skills'
import { getCategoryById, getAllCategories } from '~/utils/categories'
import { getTagsForPlaylist } from '~/utils/tags'
import SkillCard from '~/components/skills/SkillCard.vue'
import VideoCard from '~/components/videos/VideoCard.vue'
import TagBadge from '~/components/tags/TagBadge.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import type { Playlist, Skill, Category, Tag, Video } from '~/types'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Get playlist slug from route
const slug = computed(() => {
  const param = route.params?.slug
  if (!param) return ''
  return Array.isArray(param) ? param[0] : String(param)
})

// Get playlist data - use ref to avoid computed dependency issues
const playlist = ref<Playlist | undefined>(undefined)
const playlistVideos = ref<Video[]>([])
const relatedSkills = ref<Skill[]>([])
const relatedCategories = ref<Category[]>([])
const playlistTags = ref<Tag[]>([])

// Load data when route changes
watch([slug, locale], () => {
  if (!slug.value) {
    playlist.value = undefined
    playlistVideos.value = []
    relatedSkills.value = []
    relatedCategories.value = []
    playlistTags.value = []
    return
  }
  
  try {
    const currentLocale = locale.value as 'fa' | 'en'
    playlist.value = getPlaylistBySlug(slug.value, currentLocale)
    
    if (playlist.value) {
      // Load videos in playlist
      const allVideos = getAllVideos(currentLocale)
      playlistVideos.value = allVideos.filter((video) => 
        playlist.value!.videoIds.includes(video.id)
      )
      
      // Load related skills
      relatedSkills.value = getSkillsByIds(playlist.value.skillIds, currentLocale)
      
      // Load related categories
      const allCategories = getAllCategories(currentLocale)
      relatedCategories.value = playlist.value.categoryIds
        .map((categoryId) => getCategoryById(categoryId as 'health' | 'identity' | 'career', currentLocale))
        .filter((category) => category !== undefined) as Category[]
      
      // Load tags
      playlistTags.value = getTagsForPlaylist(playlist.value.id, currentLocale)
    } else {
      playlistVideos.value = []
      relatedSkills.value = []
      relatedCategories.value = []
      playlistTags.value = []
    }
  } catch (error) {
    console.error('Error loading playlist:', error)
    playlist.value = undefined
    playlistVideos.value = []
    relatedSkills.value = []
    relatedCategories.value = []
    playlistTags.value = []
  }
}, { immediate: true })

// Set page title - use computed to avoid infinite loops
const pageTitle = computed(() => {
  if (playlist.value) {
    return `${playlist.value.title[locale.value] || playlist.value.title.fa} - ${t('playlists.title')} - 15ecosystem`
  }
  return `${t('playlists.notFound')} - 15ecosystem`
})

const pageDescription = computed(() => {
  if (playlist.value) {
    return playlist.value.description?.[locale.value] || playlist.value.description?.fa || t('playlists.description')
  }
  return t('playlists.notFound')
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
      label: t('playlists.title'),
      to: '/playlists',
      icon: 'i-twemoji-video-camera'
    }
  ]
  
  if (playlist.value) {
    items.push({
      label: playlist.value.title[locale.value] || playlist.value.title.fa
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
      content: computed(() => playlist.value?.thumbnail || ''),
    },
    {
      property: 'og:type',
      content: 'video.playlist',
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

