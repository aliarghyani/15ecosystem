<template>
  <!-- Loading State -->
  <div v-if="!tag && slug" class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <div class="py-12">
      <UIcon name="i-twemoji-arrows-counterclockwise" class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">Loading tag...</p>
    </div>
  </div>
  
  <!-- Tag Detail Page -->
  <div v-else-if="tag" class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Tag Header -->
    <div class="mb-12">
      <div class="flex items-start gap-4 mb-6">
        <TagBadge
          :tag="tag"
          :show-count="true"
          :clickable="false"
          size="lg"
        />
        <div class="flex-1">
          <h1 class="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            {{ tagName }}
          </h1>
          <p v-if="tag.description" class="text-xl text-gray-600 dark:text-gray-400">
            {{ locale === 'fa' ? tag.description.fa : tag.description.en }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content Sections -->
    <div class="space-y-12">
      <!-- Skills Section -->
      <div v-if="content.skills.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('tags.skills') }} ({{ content.skills.length }})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          <SkillCard
            v-for="skill in content.skills"
            :key="skill.id"
            :skill="skill"
            :show-description="false"
            :show-footer="false"
            variant="compact"
          />
        </div>
      </div>

      <!-- Books Section -->
      <div v-if="content.books.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('tags.books') }} ({{ content.books.length }})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <BookCard v-for="book in content.books" :key="`${book.title}-${book.author}`" :book="book" />
        </div>
      </div>

      <!-- Writers Section -->
      <div v-if="content.writers.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('tags.writers') }} ({{ content.writers.length }})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          <WriterCard
            v-for="writer in content.writers"
            :key="writer.id"
            :writer="writer"
            :show-bio="false"
            :show-books-count="true"
            :show-skills="false"
          />
        </div>
      </div>

      <!-- Categories Section -->
      <div v-if="content.categories.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('tags.categories') }} ({{ content.categories.length }})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="category in content.categories"
            :key="category.id"
            class="hover-minimal dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:shadow-lg"
            @click="navigateToCategory(category.id)"
          >
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {{ locale === 'fa' ? category.name.fa : category.name.en }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ locale === 'fa' ? category.description.fa : category.description.en }}
            </p>
          </UCard>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="totalContentCount === 0" class="text-center py-12">
        <UCard class="dark:bg-slate-800/50 bg-white/80 backdrop-blur-sm">
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('tags.noContent') }}
          </p>
        </UCard>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center gap-4 mt-12">
      <UButton :to="localePath('/tags')" variant="soft" color="primary" icon="i-twemoji-left-arrow">
        {{ $t('tags.backToTags') }}
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
      {{ $t('tags.notFound') }}
    </p>
    <UButton :to="localePath('/tags')" color="primary">
      {{ $t('tags.backToTags') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // Ensure this page is handled correctly in SPA mode
})

import { getTagBySlug, getContentByTag } from '~/utils/tags'
import TagBadge from '~/components/tags/TagBadge.vue'
import SkillCard from '~/components/skills/SkillCard.vue'
import BookCard from '~/components/books/BookCard.vue'
import WriterCard from '~/components/writers/WriterCard.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import type { Tag } from '~/types'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

// Get tag slug from route
const slug = computed(() => {
  const param = route.params?.slug
  if (!param) return ''
  return Array.isArray(param) ? param[0] : String(param)
})

// Get tag data - use ref to avoid computed dependency issues
const tag = ref<Tag | undefined>(undefined)
const content = ref({
  skills: [] as any[],
  books: [] as any[],
  writers: [] as any[],
  categories: [] as any[]
})

// Load data when route changes
watch([slug, locale], () => {
  if (!slug.value) {
    tag.value = undefined
    content.value = { skills: [], books: [], writers: [], categories: [] }
    return
  }
  
  try {
    const currentLocale = locale.value as 'fa' | 'en'
    tag.value = getTagBySlug(slug.value, currentLocale)
    
    if (tag.value) {
      content.value = getContentByTag(tag.value.slug, currentLocale)
    } else {
      content.value = { skills: [], books: [], writers: [], categories: [] }
    }
  } catch (error) {
    console.error('Error loading tag:', error)
    tag.value = undefined
    content.value = { skills: [], books: [], writers: [], categories: [] }
  }
}, { immediate: true })

// Get tag name
const tagName = computed(() => {
  if (!tag.value) return ''
  return locale.value === 'fa' ? tag.value.name.fa : tag.value.name.en
})

// Calculate total content count
const totalContentCount = computed(() => {
  return content.value.skills.length + content.value.books.length + content.value.writers.length + content.value.categories.length
})

// Navigate to category
const navigateToCategory = (categoryId: string) => {
  router.push(localePath(`/categories/${categoryId}`))
}

// Set page title
const pageTitle = computed(() => {
  if (tag.value) {
    return `${tagName.value} - ${t('tags.title')} - 15ecosystem`
  }
  return `${t('tags.notFound')} - 15ecosystem`
})

const pageDescription = computed(() => {
  if (tag.value && tag.value.description) {
    const desc = locale.value === 'fa' ? tag.value.description.fa : tag.value.description.en
    return desc.substring(0, 160) + '...'
  }
  return t('tags.notFound')
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

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items: Array<{ label: string; to?: string; icon?: string }> = [
    {
      label: t('breadcrumb.home'),
      to: '/',
      icon: 'i-twemoji-house'
    },
    {
      label: t('tags.title'),
      to: '/tags',
      icon: 'i-twemoji-label'
    }
  ]
  
  if (tag.value) {
    items.push({
      label: tagName.value
      // to and icon omitted for current page
    })
  }
  
  return items
})
</script>

