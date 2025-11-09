<template>
  <div v-if="book" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
import { getBookBySlug } from '~/utils/books'
import { getSkillsByIds } from '~/utils/skills'
import SkillCard from '~/components/skills/SkillCard.vue'
import type { Book, Skill } from '~/types'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

// Get book slug from route
const slug = computed(() => route.params.slug as string)

// Get book data
const book = computed<Book | undefined>(() => {
  return getBookBySlug(slug.value, locale.value as 'fa' | 'en')
})

// Get related skills
const relatedSkills = computed<Skill[]>(() => {
  if (!book.value) {
    return []
  }
  return getSkillsByIds(book.value.skillIds, locale.value as 'fa' | 'en')
})

// Set page title
useHead({
  title: computed(() => {
    if (book.value) {
      return `${book.value.title} - ${useI18n().t('books.title')} - 15ecosystem`
    }
    return `${useI18n().t('books.notFound')} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        if (book.value) {
          return `${useI18n().t('books.byAuthor')} ${book.value.author} - ${useI18n().t('books.relatedSkills')}`
        }
        return useI18n().t('books.notFound')
      }),
    },
  ],
})
</script>


