<template>
  <div class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ $t('books.title') }}
      </span>
    </nav>

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('books.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('books.description') }}
      </p>
    </div>

    <!-- Books by Category -->
    <div v-if="hasBooks" class="space-y-12">
      <!-- Health Category -->
      <div v-if="healthBooks.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getCategoryName('health') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('books.categoryDescription', { count: healthBooks.length, category: getCategoryName('health') }) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="book in healthBooks" :key="`${book.title}-${book.author}`" class="relative">
            <BookCard :book="book" />
            <div v-if="book.skillIds.length > 0" class="mt-2 flex flex-wrap gap-2">
              <NuxtLink
                v-for="skillId in book.skillIds"
                :key="skillId"
                :to="localePath(`/skills/${skillId}`)"
                class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ $t('books.relatedToSkill', { skillNumber: skillId }) }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Identity Category -->
      <div v-if="identityBooks.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getCategoryName('identity') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('books.categoryDescription', { count: identityBooks.length, category: getCategoryName('identity') }) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="book in identityBooks" :key="`${book.title}-${book.author}`" class="relative">
            <BookCard :book="book" />
            <div v-if="book.skillIds.length > 0" class="mt-2 flex flex-wrap gap-2">
              <NuxtLink
                v-for="skillId in book.skillIds"
                :key="skillId"
                :to="localePath(`/skills/${skillId}`)"
                class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ $t('books.relatedToSkill', { skillNumber: skillId }) }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Career Category -->
      <div v-if="careerBooks.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getCategoryName('career') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('books.categoryDescription', { count: careerBooks.length, category: getCategoryName('career') }) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="book in careerBooks" :key="`${book.title}-${book.author}`" class="relative">
            <BookCard :book="book" />
            <div v-if="book.skillIds.length > 0" class="mt-2 flex flex-wrap gap-2">
              <NuxtLink
                v-for="skillId in book.skillIds"
                :key="skillId"
                :to="localePath(`/skills/${skillId}`)"
                class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ $t('books.relatedToSkill', { skillNumber: skillId }) }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('books.noBooks') }}
        </p>
      </UCard>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center mt-12">
      <UButton :to="localePath('/')" variant="soft" color="primary" icon="i-heroicons-home">
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBooksByCategory } from '~/utils/books'
import { getCategoryById } from '~/utils/categories'
import BookCard from '~/components/books/BookCard.vue'

const { locale } = useI18n()
const localePath = useLocalePath()

// Get books by category
const healthBooks = computed(() => {
  return getBooksByCategory('health', locale.value as 'fa' | 'en')
})

const identityBooks = computed(() => {
  return getBooksByCategory('identity', locale.value as 'fa' | 'en')
})

const careerBooks = computed(() => {
  return getBooksByCategory('career', locale.value as 'fa' | 'en')
})

// Check if there are any books
const hasBooks = computed(() => {
  return healthBooks.value.length > 0 || identityBooks.value.length > 0 || careerBooks.value.length > 0
})

// Get category name
function getCategoryName(categoryId: 'health' | 'identity' | 'career'): string {
  const category = getCategoryById(categoryId, locale.value as 'fa' | 'en')
  return category?.name[locale.value] || category?.name.fa || categoryId
}

// Set page title
useHead({
  title: computed(() => {
    return `${useI18n().t('books.title')} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return useI18n().t('books.description')
      }),
    },
  ],
})
</script>


