<template>
  <div class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1
        class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('videos.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('videos.description') }}
      </p>
    </div>

    <!-- Filter Indicators -->
    <div v-if="skillFilter || writerFilter || bookFilter" class="mb-8 space-y-4">
      <!-- Filter by Skill -->
      <UCard v-if="skillFilter" class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {{ $t('videos.filteredBySkill') }}
            </p>
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ getSkillLabel(skillFilter) }}
            </p>
          </div>
          <UButton :to="localePath('/videos')" variant="ghost" color="primary" size="sm" icon="i-twemoji-cross-mark"
            class="min-h-[44px]">
            {{ $t('common.clearFilter') || 'Clear Filter' }}
          </UButton>
        </div>
      </UCard>

      <!-- Filter by Writer -->
      <UCard v-if="writerFilter" class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {{ $t('videos.filteredByWriter') || 'Filtered by Writer' }}
            </p>
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ getWriterLabel(writerFilter) }}
            </p>
          </div>
          <UButton :to="localePath('/videos')" variant="ghost" color="primary" size="sm" icon="i-twemoji-cross-mark"
            class="min-h-[44px]">
            {{ $t('common.clearFilter') || 'Clear Filter' }}
          </UButton>
        </div>
      </UCard>

      <!-- Filter by Book -->
      <UCard v-if="bookFilter" class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {{ $t('videos.filteredByBook') || 'Filtered by Book' }}
            </p>
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ getBookLabel(bookFilter) }}
            </p>
          </div>
          <UButton :to="localePath('/videos')" variant="ghost" color="primary" size="sm" icon="i-twemoji-cross-mark"
            class="min-h-[44px]">
            {{ $t('common.clearFilter') || 'Clear Filter' }}
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Videos by Category -->
    <div v-if="hasVideos" class="space-y-12">
      <!-- Health Category -->
      <div v-if="healthVideos.length > 0">
        <div class="mb-6">
          <NuxtLink :to="localePath('/categories/health')" class="inline-block group">
            <h2
              class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('health') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400">
            {{ healthVideos.length }} {{ $t('videos.videos') }} {{ $t('common.relatedTo') || 'related to' }} {{
              getCategoryName('health') }}
          </p>
        </div>
        <VideoList :videos="healthVideos" group-by="none" :show-description="false" variant="default" />
      </div>

      <!-- Identity Category -->
      <div v-if="identityVideos.length > 0">
        <div class="mb-6">
          <NuxtLink :to="localePath('/categories/identity')" class="inline-block group">
            <h2
              class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('identity') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400">
            {{ identityVideos.length }} {{ $t('videos.videos') }} {{ $t('common.relatedTo') || 'related to' }} {{
              getCategoryName('identity') }}
          </p>
        </div>
        <VideoList :videos="identityVideos" group-by="none" :show-description="false" variant="default" />
      </div>

      <!-- Career Category -->
      <div v-if="careerVideos.length > 0">
        <div class="mb-6">
          <NuxtLink :to="localePath('/categories/career')" class="inline-block group">
            <h2
              class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getCategoryName('career') }}
            </h2>
          </NuxtLink>
          <p class="text-gray-600 dark:text-gray-400">
            {{ careerVideos.length }} {{ $t('videos.videos') }} {{ $t('common.relatedTo') || 'related to' }} {{
              getCategoryName('career') }}
          </p>
        </div>
        <VideoList :videos="careerVideos" group-by="none" :show-description="false" variant="default" />
      </div>

      <!-- Other Videos -->
      <div v-if="uncategorizedVideos.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ $t('videos.otherVideos') || 'Other Videos' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ uncategorizedVideos.length }} {{ $t('videos.videos') }}
          </p>
        </div>
        <VideoList :videos="uncategorizedVideos" group-by="none" :show-description="false" variant="default" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <UIcon name="i-twemoji-video-camera" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {{ $t('videos.noVideosFound') }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          {{ $t('videos.noVideosDescription') || 'Videos will be added soon.' }}
        </p>
      </UCard>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center mt-12">
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-twemoji-house" class="min-h-[44px]">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllVideos } from '~/utils/videos'
import { getCategoryById } from '~/utils/categories'
import { getSkillById } from '~/utils/skills'
import { getWriterBySlug } from '~/utils/writers'
import { getBookBySlug } from '~/utils/books'
import VideoList from '~/components/videos/VideoList.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Get skill filter from query params
const skillFilter = computed(() => {
  const skillId = route.query.skill
  if (skillId && typeof skillId === 'string') {
    const id = parseInt(skillId, 10)
    if (!isNaN(id) && id >= 1 && id <= 15) {
      return id
    }
  }
  return null
})

// Get writer filter from query params
const writerFilter = computed(() => {
  const writerSlug = route.query.writer
  if (writerSlug && typeof writerSlug === 'string') {
    const writer = getWriterBySlug(writerSlug, locale.value as 'fa' | 'en')
    if (writer) {
      return writerSlug
    }
  }
  return null
})

// Get book filter from query params
const bookFilter = computed(() => {
  const bookSlug = route.query.book
  if (bookSlug && typeof bookSlug === 'string') {
    const book = getBookBySlug(bookSlug, locale.value as 'fa' | 'en')
    if (book) {
      return bookSlug
    }
  }
  return null
})

// Fetch real video data
const allVideoIds = getAllVideos('fa').map(v => v.youtubeId)
const { data: realVideos } = await useYoutubeVideos({ ids: allVideoIds })

// Get all videos
const allVideos = computed(() => {
  let videos = getAllVideos(locale.value as 'fa' | 'en')

  // Merge with real data if available
  if (realVideos.value) {
    videos = videos.map(v => {
      const real = realVideos.value?.find(rv => rv.id === v.youtubeId)
      if (real) {
        return {
          ...v,
          duration: real.durationSeconds,
          viewCount: real.stats.viewCount,
          publishedAt: real.publishedAt,
          thumbnail: real.thumbnails?.medium?.url || real.thumbnails?.default?.url || v.thumbnail
        }
      }
      return v
    })
  }

  // Filter by skill if query param present
  if (skillFilter.value) {
    videos = videos.filter((video) => video.skillIds.includes(skillFilter.value!))
  }

  // Filter by writer if query param present
  if (writerFilter.value) {
    videos = videos.filter((video) => video.writerId === writerFilter.value)
  }

  // Filter by book if query param present
  if (bookFilter.value) {
    videos = videos.filter((video) =>
      video.bookIds && video.bookIds.includes(bookFilter.value!)
    )
  }

  return videos
})

// Get videos by category
const healthVideos = computed(() => {
  return allVideos.value.filter((video) => video.categoryIds.includes('health'))
})

const identityVideos = computed(() => {
  return allVideos.value.filter((video) => video.categoryIds.includes('identity'))
})

const careerVideos = computed(() => {
  return allVideos.value.filter((video) => video.categoryIds.includes('career'))
})

const uncategorizedVideos = computed(() => {
  return allVideos.value.filter((video) =>
    !video.categoryIds.includes('health') &&
    !video.categoryIds.includes('identity') &&
    !video.categoryIds.includes('career')
  )
})

// Check if there are any videos
const hasVideos = computed(() => {
  return healthVideos.value.length > 0 || identityVideos.value.length > 0 || careerVideos.value.length > 0 || uncategorizedVideos.value.length > 0
})

// Get category name
function getCategoryName(categoryId: 'health' | 'identity' | 'career'): string {
  const category = getCategoryById(categoryId, locale.value as 'fa' | 'en')
  return category?.name[locale.value] || category?.name.fa || categoryId
}

// Get skill label
function getSkillLabel(skillId: number): string {
  const skill = getSkillById(skillId, locale.value as 'fa' | 'en')
  if (skill) {
    return locale.value === 'fa' ? skill.name.fa : skill.name.en
  }
  return locale.value === 'fa' ? `مهارت ${skillId}` : `Skill ${skillId}`
}

// Get writer label
function getWriterLabel(writerSlug: string): string {
  const writer = getWriterBySlug(writerSlug, locale.value as 'fa' | 'en')
  if (writer) {
    return writer.name
  }
  return writerSlug
}

// Get book label
function getBookLabel(bookSlug: string): string {
  const book = getBookBySlug(bookSlug, locale.value as 'fa' | 'en')
  if (book) {
    return book.title
  }
  return bookSlug
}

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
      icon: 'i-twemoji-video-camera'
      // to omitted for current page
    }
  ]
  return items
})

// Set page title
useHead({
  title: computed(() => {
    return `${t('videos.title')} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return t('videos.description')
      }),
    },
  ],
})
</script>
