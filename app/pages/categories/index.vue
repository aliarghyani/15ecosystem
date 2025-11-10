<template>
  <div class="max-w-7xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('category.viewAllCategories') || 'All Categories' }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('category.viewAllCategoriesDescription') || 'Explore all skill categories' }}
      </p>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard
        v-for="category in allCategories"
        :key="category.id"
        class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer h-full"
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

    <!-- Navigation Buttons -->
    <div class="mt-12 text-center">
      <UButton
        :to="localePath('/')"
        variant="outline"
        color="primary"
        icon="i-heroicons-home"
      >
        {{ $t('category.backToHome') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllCategories } from '~/utils/categories'
import type { Category } from '~/types'

const { locale, t } = useI18n()
const localePath = useLocalePath()

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items: Array<{ label: string; to?: string; icon?: string }> = [
    {
      label: t('breadcrumb.home'),
      to: '/',
      icon: 'i-heroicons-home'
    },
    {
      label: t('breadcrumb.categories'),
      icon: 'i-heroicons-squares-2x2'
      // to omitted for current page
    }
  ]
  return items
})

// Get all categories
const allCategories = computed<Category[]>(() => {
  return getAllCategories(locale.value as 'fa' | 'en')
})

// Navigation function
const navigateToCategory = (categoryId: string) => {
  navigateTo(localePath(`/categories/${categoryId}`))
}

useHead({
  title: computed(() => {
    return `${useI18n().t('category.viewAllCategories') || 'All Categories'} - 15ecosystem`
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        return useI18n().t('category.viewAllCategoriesDescription') || 'Explore all skill categories'
      }),
    },
  ],
})
</script>


