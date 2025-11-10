<template>
  <!-- Loading State -->
  <div v-if="!book && slug" class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <div class="py-12">
      <UIcon name="i-twemoji-arrows-counterclockwise" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Loading book...</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Slug: {{ slug }}</p>
    </div>
  </div>
  
  <!-- Book Detail Page -->
  <div v-else-if="book" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Book Header -->
    <div class="mb-12">
      <div class="flex items-start gap-6 mb-6">
        <div class="flex-shrink-0">
          <div class="w-24 h-24 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shadow-lg">
            <UIcon name="i-twemoji-open-book" class="text-primary-600 dark:text-primary-400 text-4xl" />
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            {{ book.title }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {{ $t('books.byAuthor') }} {{ book.author }}
          </p>
        </div>
      </div>
    </div>

    <!-- Related Skills Section -->
    <div v-if="relatedSkills.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('books.relatedSkills') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('books.relatedSkillsDescription') }}
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

    <!-- Related Videos Section -->
    <div v-if="relatedVideos.length > 0" class="mb-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ $t('books.relatedVideos') }}
        </h2>
        <UButton
          v-if="relatedVideos.length > 8"
          :to="localePath(`/videos?book=${slug}`)"
          variant="ghost"
          color="primary"
          size="sm"
          icon="i-twemoji-video-camera"
          class="min-h-[44px]"
        >
          {{ $t('videos.viewAll') }}
        </UButton>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('books.relatedVideosDescription') }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <VideoCard
          v-for="video in relatedVideos.slice(0, 8)"
          :key="video.id"
          :video="video"
          :show-description="false"
          variant="default"
        />
      </div>
      <div v-if="relatedVideos.length > 8" class="mt-6 text-center">
        <UButton
          :to="localePath(`/videos?book=${slug}`)"
          variant="soft"
          color="primary"
          class="min-h-[44px]"
        >
          {{ $t('videos.viewAllVideos', { count: relatedVideos.length }) }}
        </UButton>
      </div>
    </div>

    <!-- Related Writers Section -->
    <div v-if="relatedWriters.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('books.relatedWriters') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('books.relatedWritersDescription') }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <WriterCard
          v-for="writer in relatedWriters"
          :key="writer.slug"
          :writer="writer"
          :show-bio="false"
          :show-tagline="true"
          :show-books-count="true"
          :show-skills="false"
          variant="compact"
        />
      </div>
    </div>

    <!-- Tags Section -->
    <div v-if="bookTags.length > 0" class="mb-12">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('tags.title') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <TagBadge
          v-for="tag in bookTags"
          :key="tag.slug"
          :tag="tag"
          :clickable="true"
          size="sm"
        />
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center gap-4 mt-12">
      <UButton :to="localePath('/books')" variant="soft" color="primary" icon="i-twemoji-left-arrow">
        {{ $t('books.backToBooks') }}
      </UButton>
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-twemoji-house">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>

  <!-- 404 Page -->
  <div v-else class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      {{ $t('books.notFound') }}
    </p>
    <UButton :to="localePath('/books')" color="primary">
      {{ $t('books.backToBooks') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // Ensure this page is handled correctly in SPA mode
})

import { getBookBySlug, getBookSlug, getVideosByBook, getWritersByBook } from '~/utils/books'
import { getSkillsByIds } from '~/utils/skills'
import { getTagsForBook } from '~/utils/tags'
import SkillCard from '~/components/skills/SkillCard.vue'
import VideoCard from '~/components/videos/VideoCard.vue'
import WriterCard from '~/components/writers/WriterCard.vue'
import TagBadge from '~/components/tags/TagBadge.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import type { Book, Skill, Tag, Video, Writer } from '~/types'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Get book slug from route
const slug = computed(() => {
  const param = route.params?.slug
  if (!param) return ''
  return Array.isArray(param) ? param[0] : String(param)
})

// Get book data - use ref to avoid computed dependency issues
const book = ref<Book | undefined>(undefined)
const relatedSkills = ref<Skill[]>([])
const relatedVideos = ref<Video[]>([])
const relatedWriters = ref<Writer[]>([])
const bookTags = ref<Tag[]>([])

// Load data when route changes
watch([slug, locale], () => {
  if (!slug.value) {
    book.value = undefined
    relatedSkills.value = []
    relatedVideos.value = []
    relatedWriters.value = []
    bookTags.value = []
    return
  }
  
  try {
    const currentLocale = locale.value as 'fa' | 'en'
    book.value = getBookBySlug(slug.value, currentLocale)
    
    if (book.value) {
      const bookSlug = getBookSlug(book.value.title, book.value.author)
      relatedSkills.value = getSkillsByIds(book.value.skillIds, currentLocale)
      relatedVideos.value = getVideosByBook(bookSlug, currentLocale)
      relatedWriters.value = getWritersByBook(bookSlug, currentLocale)
      bookTags.value = getTagsForBook(bookSlug, currentLocale)
    } else {
      relatedSkills.value = []
      relatedVideos.value = []
      relatedWriters.value = []
      bookTags.value = []
    }
  } catch (error) {
    console.error('Error loading book:', error)
    book.value = undefined
    relatedSkills.value = []
    relatedVideos.value = []
    relatedWriters.value = []
    bookTags.value = []
  }
}, { immediate: true })

// Set page title - use computed to avoid infinite loops
const pageTitle = computed(() => {
  if (book.value) {
    return `${book.value.title} - ${t('books.title')} - 15ecosystem`
  }
  return `${t('books.notFound')} - 15ecosystem`
})

const pageDescription = computed(() => {
  if (book.value) {
    return `${t('books.byAuthor')} ${book.value.author} - ${t('books.relatedSkills')}`
  }
  return t('books.notFound')
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
      label: t('books.title'),
      to: '/books',
      icon: 'i-twemoji-open-book'
    }
  ]
  
  if (book.value) {
    items.push({
      label: book.value.title
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
  ],
})
</script>


