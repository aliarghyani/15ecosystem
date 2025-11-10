<template>
  <!-- Loading State -->
  <div v-if="!writer && slug" class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <div class="py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Loading writer...</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Slug: {{ slug }}</p>
    </div>
  </div>
  
  <!-- Writer Detail Page -->
  <div v-else-if="writer" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <NuxtLink :to="localePath('/writers')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('writers.title') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ writer.name }}
      </span>
    </nav>

    <!-- Writer Header -->
    <div class="mb-12">
      <div class="flex items-start gap-6 mb-6">
        <div class="flex-shrink-0">
          <div
            v-if="writer.photo"
            class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden shadow-lg"
          >
            <img :src="writer.photo" :alt="writer.name" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg"
          >
            <UIcon name="i-heroicons-user" class="text-white text-5xl" />
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            {{ writer.name }}
          </h1>
          <p v-if="writer.tagline" class="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {{ locale === 'fa' ? writer.tagline.fa : writer.tagline.en }}
          </p>
          <!-- Category Badges -->
          <div v-if="writer.categoryIds.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="categoryId in writer.categoryIds"
              :key="categoryId"
              :label="getCategoryName(categoryId)"
              color="primary"
              variant="soft"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Biography Section -->
    <UCard v-if="writer.biography" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ $t('writers.biography') }}
        </h2>
      </template>
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <ClickableContent
          :content="biographyText"
          :locale="locale as 'fa' | 'en'"
        />
      </div>
    </UCard>

    <!-- Related Books Section -->
    <div v-if="books.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('writers.relatedBooks') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <BookCard v-for="book in books" :key="`${book.title}-${book.author}`" :book="book" />
      </div>
    </div>
    <div v-else class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('writers.relatedBooks') }}
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        {{ $t('writers.noBooks') }}
      </p>
    </div>

    <!-- Resources Section -->
    <UCard v-if="hasResources" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ $t('writers.resources') }}
        </h2>
      </template>
      <div class="flex flex-wrap gap-3">
        <UButton
          v-if="writer.links.youtube"
          :href="writer.links.youtube"
          target="_blank"
          rel="noopener noreferrer"
          color="red"
          variant="soft"
          icon="i-heroicons-play"
        >
          YouTube
        </UButton>
        <UButton
          v-if="writer.links.website"
          :href="writer.links.website"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          variant="soft"
          icon="i-heroicons-globe-alt"
        >
          {{ $t('writers.website') }}
        </UButton>
        <UButton
          v-if="writer.links.twitter"
          :href="writer.links.twitter"
          target="_blank"
          rel="noopener noreferrer"
          color="sky"
          variant="soft"
          icon="i-simple-icons-x"
        >
          Twitter
        </UButton>
        <UButton
          v-if="writer.links.linkedin"
          :href="writer.links.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          color="blue"
          variant="soft"
          icon="i-simple-icons-linkedin"
        >
          LinkedIn
        </UButton>
        <UButton
          v-if="writer.links.instagram"
          :href="writer.links.instagram"
          target="_blank"
          rel="noopener noreferrer"
          color="pink"
          variant="soft"
          icon="i-simple-icons-instagram"
        >
          Instagram
        </UButton>
        <UButton
          v-for="link in writer.links.other"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="soft"
          icon="i-heroicons-link"
        >
          {{ link.label }}
        </UButton>
      </div>
    </UCard>

    <!-- Related Skills Section -->
    <div v-if="relatedSkills.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('writers.relatedSkills') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        <SkillCard
          v-for="skill in relatedSkills"
          :key="skill.id"
          :skill="skill"
          :show-description="false"
          :show-footer="false"
          variant="compact"
        />
      </div>
    </div>

    <!-- Tags Section (for future tag system) -->
    <div v-if="writer.tags && writer.tags.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('writers.tags') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <!-- Tags will be implemented in Story 4.6 -->
        <UBadge
          v-for="tagSlug in writer.tags"
          :key="tagSlug"
          :label="tagSlug"
          color="primary"
          variant="soft"
        />
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center gap-4 mt-12">
      <UButton :to="localePath('/writers')" variant="soft" color="primary" icon="i-heroicons-arrow-left">
        {{ $t('writers.backToWriters') }}
      </UButton>
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-heroicons-home">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>

  <!-- 404 Page -->
  <div v-else class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      {{ $t('writers.notFound') }}
    </p>
    <UButton :to="localePath('/writers')" color="primary">
      {{ $t('writers.backToWriters') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // Ensure this page is handled correctly in SPA mode
})

import { getWriterBySlug, getWriterBooks, getWriterSkills } from '~/utils/writers'
import { getCategoryById } from '~/utils/categories'
import BookCard from '~/components/books/BookCard.vue'
import SkillCard from '~/components/skills/SkillCard.vue'
import ClickableContent from '~/components/content/ClickableContent.vue'
import type { Writer, Skill } from '~/types'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const { t } = useI18n()

// Get writer slug from route
const slug = computed(() => {
  const param = route.params?.slug
  if (!param) return ''
  return Array.isArray(param) ? param[0] : String(param)
})

// Get writer data - use ref to avoid computed dependency issues
const writer = ref<Writer | undefined>(undefined)
const books = ref<Book[]>([])
const relatedSkills = ref<Skill[]>([])

// Load data when route changes
watch([slug, locale], () => {
  if (!slug.value) {
    writer.value = undefined
    books.value = []
    relatedSkills.value = []
    return
  }
  
  try {
    const currentLocale = locale.value as 'fa' | 'en'
    writer.value = getWriterBySlug(slug.value, currentLocale)
    
    if (writer.value) {
      books.value = getWriterBooks(writer.value.slug, currentLocale)
      relatedSkills.value = getWriterSkills(writer.value.slug, currentLocale) as Skill[]
    } else {
      books.value = []
      relatedSkills.value = []
    }
  } catch (error) {
    console.error('Error loading writer:', error)
    writer.value = undefined
    books.value = []
    relatedSkills.value = []
  }
}, { immediate: true })

// Get biography text
const biographyText = computed(() => {
  if (!writer.value) return ''
  return locale.value === 'fa' ? writer.value.biography.fa : writer.value.biography.en
})

// Check if writer has resources
const hasResources = computed(() => {
  if (!writer.value) return false
  const links = writer.value.links
  return !!(links.youtube || links.website || links.twitter || links.linkedin || links.instagram || (links.other && links.other.length > 0))
})

// Get category name
const getCategoryName = (categoryId: string): string => {
  const category = getCategoryById(categoryId as 'health' | 'identity' | 'career', locale.value as 'fa' | 'en')
  return category ? (locale.value === 'fa' ? category.name.fa : category.name.en) : categoryId
}

// Set page title
const pageTitle = computed(() => {
  if (writer.value) {
    return `${writer.value.name} - ${t('writers.title')} - 15ecosystem`
  }
  return `${t('writers.notFound')} - 15ecosystem`
})

const pageDescription = computed(() => {
  if (writer.value) {
    const bio = locale.value === 'fa' ? writer.value.biography.fa : writer.value.biography.en
    return bio.substring(0, 160) + '...'
  }
  return t('writers.notFound')
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

