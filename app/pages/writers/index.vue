<template>
  <div class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('writers.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ $t('writers.description') }}
      </p>
    </div>

    <!-- Writers by Category -->
    <div v-if="hasWriters" class="space-y-12">
      <!-- Health Category -->
      <div v-if="healthWriters.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getCategoryName('health') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('writers.categoryDescription', { count: healthWriters.length, category: getCategoryName('health') }) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          <WriterCard
            v-for="writer in healthWriters"
            :key="writer.id"
            :writer="writer"
            :show-bio="true"
            :show-books-count="true"
            :show-skills="true"
          />
        </div>
      </div>

      <!-- Identity Category -->
      <div v-if="identityWriters.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getCategoryName('identity') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('writers.categoryDescription', { count: identityWriters.length, category: getCategoryName('identity') }) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          <WriterCard
            v-for="writer in identityWriters"
            :key="writer.id"
            :writer="writer"
            :show-bio="true"
            :show-books-count="true"
            :show-skills="true"
          />
        </div>
      </div>

      <!-- Career Category -->
      <div v-if="careerWriters.length > 0">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {{ getCategoryName('career') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('writers.categoryDescription', { count: careerWriters.length, category: getCategoryName('career') }) }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          <WriterCard
            v-for="writer in careerWriters"
            :key="writer.id"
            :writer="writer"
            :show-bio="true"
            :show-books-count="true"
            :show-skills="true"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('writers.noWriters') }}
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
definePageMeta({
  // This page matches /writers exactly
})

import { getAllWriters, getWritersByCategory } from '~/utils/writers'
import { getCategoryById } from '~/utils/categories'
import WriterCard from '~/components/writers/WriterCard.vue'

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
      label: t('writers.title'),
      icon: 'i-heroicons-user-group'
      // to omitted for current page
    }
  ]
  return items
})

// Get writers by category
const healthWriters = computed(() => getWritersByCategory('health', locale.value as 'fa' | 'en'))
const identityWriters = computed(() => getWritersByCategory('identity', locale.value as 'fa' | 'en'))
const careerWriters = computed(() => getWritersByCategory('career', locale.value as 'fa' | 'en'))

const hasWriters = computed(() => {
  return healthWriters.value.length > 0 || identityWriters.value.length > 0 || careerWriters.value.length > 0
})

// Get category name
const getCategoryName = (categoryId: 'health' | 'identity' | 'career'): string => {
  const category = getCategoryById(categoryId, locale.value as 'fa' | 'en')
  return category ? (locale.value === 'fa' ? category.name.fa : category.name.en) : categoryId
}
</script>

