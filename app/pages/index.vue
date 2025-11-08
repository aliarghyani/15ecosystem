<template>
  <div class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 primary-text">
        {{ $t('home.title') }}
      </h1>
      <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-6 font-medium">
        {{ $t('home.subtitle') }}
      </p>
      <p class="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-8">
        {{ $t('home.description') }}
      </p>
      <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
        {{ $t('home.introduction') }}
      </p>
    </div>

    <!-- Skills Overview -->
    <div class="mb-16">
      <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        {{ $t('home.skillsOverview') }}
      </h2>
    </div>

    <!-- Category Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <UCard
        v-for="category in categories"
        :key="category.id"
        class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
        @click="navigateToCategory(category.id)"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {{ category.name[locale] }}
            </h2>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('home.skillCount', { count: category.skills.length }) }}
            </span>
          </div>
        </template>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ category.description[locale] }}
        </p>
        <template #footer>
          <UButton
            :to="localePath(`/categories/${category.id}`)"
            variant="soft"
            color="primary"
            block
            class="mt-2"
          >
            {{ $t('home.exploreCategories') }}
          </UButton>
        </template>
      </UCard>
    </div>

    <!-- Navigation Section -->
    <div class="text-center space-y-4">
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <UButton
          :to="localePath('/categories')"
          size="lg"
          color="primary"
          variant="solid"
          icon="i-heroicons-squares-2x2"
        >
          {{ $t('home.exploreCategories') }}
        </UButton>
        <UButton
          :to="localePath('/skills')"
          size="lg"
          color="primary"
          variant="outline"
          icon="i-heroicons-academic-cap"
        >
          {{ $t('home.viewAllSkills') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllCategories } from '~/utils/categories'

const { locale } = useI18n()
const localePath = useLocalePath()

// Get categories for current locale
const categories = computed(() => getAllCategories(locale.value as 'fa' | 'en'))

// Navigation function
const navigateToCategory = (categoryId: string) => {
  navigateTo(localePath(`/categories/${categoryId}`))
}

useHead({
  title: '15ecosystem - 15 Essential Skills for 2025',
  meta: [
    {
      name: 'description',
      content: 'Learn the 15 essential skills for 2025 organized into Health, Identity, and Career categories. Bilingual platform in Persian and English.',
    },
  ],
})
</script>

