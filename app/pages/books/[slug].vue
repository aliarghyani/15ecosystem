<template>
  <!-- Loading State -->
  <div v-if="!book && slug" class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <div class="py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Loading book...</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Slug: {{ slug }}</p>
    </div>
  </div>
  
  <!-- Book Detail Page -->
  <div v-else-if="book" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <NuxtLink :to="localePath('/books')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('books.title') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ book.title }}
      </span>
    </nav>

    <!-- Book Header -->
    <div class="mb-12">
      <div class="flex items-start gap-6 mb-6">
        <div class="flex-shrink-0">
          <div class="w-24 h-24 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shadow-lg">
            <UIcon name="i-heroicons-book-open" class="text-primary-600 dark:text-primary-400 text-4xl" />
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

    <!-- Navigation -->
    <div class="flex justify-center gap-4 mt-12">
      <UButton :to="localePath('/books')" variant="soft" color="primary" icon="i-heroicons-arrow-left">
        {{ $t('books.backToBooks') }}
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

import { getBookBySlug } from '~/utils/books'
import { getSkillsByIds } from '~/utils/skills'
import SkillCard from '~/components/skills/SkillCard.vue'
import type { Book, Skill } from '~/types'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const { t } = useI18n()

// Get book slug from route
const slug = computed(() => {
  const param = route.params?.slug
  if (!param) return ''
  return Array.isArray(param) ? param[0] : String(param)
})

// Get book data - use ref to avoid computed dependency issues
const book = ref<Book | undefined>(undefined)
const relatedSkills = ref<Skill[]>([])

// Load data when route changes
watch([slug, locale], () => {
  if (!slug.value) {
    book.value = undefined
    relatedSkills.value = []
    return
  }
  
  try {
    const currentLocale = locale.value as 'fa' | 'en'
    book.value = getBookBySlug(slug.value, currentLocale)
    
    if (book.value) {
      relatedSkills.value = getSkillsByIds(book.value.skillIds, currentLocale)
    } else {
      relatedSkills.value = []
    }
  } catch (error) {
    console.error('Error loading book:', error)
    book.value = undefined
    relatedSkills.value = []
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


