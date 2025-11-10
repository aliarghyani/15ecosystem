<template>
  <div class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ $t('tags.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ $t('tags.description') }}
      </p>
    </div>

    <!-- Search Input -->
    <div class="mb-8">
      <UInput
        v-model="searchQuery"
        :placeholder="$t('tags.searchPlaceholder')"
        icon="i-heroicons-magnifying-glass"
        size="lg"
        class="max-w-md mx-auto"
      />
    </div>

    <!-- Tags Grid -->
    <div v-if="filteredTags.length > 0" class="space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <UCard
          v-for="tag in filteredTags"
          :key="tag.id"
          class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:shadow-lg"
          @click="navigateToTag(tag.slug)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {{ locale === 'fa' ? tag.name.fa : tag.name.en }}
              </h3>
              <p v-if="tag.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {{ locale === 'fa' ? tag.description.fa : tag.description.en }}
              </p>
              <div class="flex items-center gap-2">
                <TagBadge
                  :tag="tag"
                  :show-count="true"
                  :clickable="false"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('tags.noTagsFound') }}
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
  // This page matches /tags exactly
})

import { getAllTags, getTagCount } from '~/utils/tags'
import TagBadge from '~/components/tags/TagBadge.vue'
import type { Tag } from '~/types'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items: Array<{ label: string; to?: string; icon?: string }> = [
    {
      label: t('breadcrumb.home'),
      to: '/',
      icon: 'i-heroicons-home'
    },
    {
      label: t('tags.title'),
      icon: 'i-heroicons-tag'
      // to omitted for current page
    }
  ]
  return items
})

const searchQuery = ref('')

// Get all tags
const allTags = computed(() => getAllTags(locale.value as 'fa' | 'en'))

// Filter tags based on search query
const filteredTags = computed(() => {
  if (!searchQuery.value.trim()) {
    return allTags.value.sort((a, b) => {
      const countA = getTagCount(a.slug, locale.value as 'fa' | 'en')
      const countB = getTagCount(b.slug, locale.value as 'fa' | 'en')
      return countB - countA // Sort by count descending
    })
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return allTags.value.filter((tag) => {
    const name = locale.value === 'fa' ? tag.name.fa : tag.name.en
    const description = tag.description ? (locale.value === 'fa' ? tag.description.fa : tag.description.en) : ''
    return name.toLowerCase().includes(query) || description.toLowerCase().includes(query)
  })
})

// Navigate to tag detail page
const navigateToTag = (tagSlug: string) => {
  router.push(localePath(`/tags/${tagSlug}`))
}
</script>

