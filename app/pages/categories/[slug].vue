<template>
  <div v-if="category" class="max-w-6xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Category Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {{ category.name[locale] }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        {{ category.description[locale] }}
      </p>
      <div class="mt-4">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ $t('home.skillCount', { count: skills.length }) }}
        </span>
      </div>
    </div>

    <!-- Visual Category Diagram -->
    <div class="mb-12 flex justify-center">
      <div class="relative">
        <!-- Category Circle -->
        <div class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 flex items-center justify-center shadow-lg">
          <span class="text-3xl font-bold text-white">
            {{ category.name[locale].charAt(0) }}
          </span>
        </div>
        <!-- Skills Indicators -->
        <div
          v-for="(skill, index) in skills"
          :key="skill.id"
          class="absolute w-8 h-8 rounded-full bg-primary-400 dark:bg-primary-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-md"
          :style="getSkillIndicatorPosition(index, skills.length)"
        >
          {{ skill.id }}
        </div>
      </div>
    </div>

    <!-- Skills Grid -->
    <div v-if="skills.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        {{ $t('category.skillsInCategory') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <SkillCard
          v-for="skill in skills"
          :key="skill.id"
          :skill="skill"
          :show-description="true"
          :show-footer="false"
        />
      </div>
    </div>

    <!-- No Skills Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('category.noSkillsFound') }}
      </p>
    </div>

    <!-- Tags Section -->
    <div v-if="categoryTags.length > 0" class="mb-12">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('tags.title') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <TagBadge
          v-for="tag in categoryTags"
          :key="tag.slug"
          :tag="tag"
          :clickable="true"
          size="sm"
        />
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
      <UButton
        :to="localePath('/')"
        variant="soft"
        color="primary"
        icon="i-heroicons-home"
      >
        {{ $t('category.backToHome') }}
      </UButton>
      <UButton
        :to="localePath('/categories')"
        variant="outline"
        color="primary"
        icon="i-heroicons-squares-2x2"
      >
        {{ $t('category.viewAllCategories') }}
      </UButton>
    </div>
  </div>

  <!-- 404 Page -->
  <div v-else class="max-w-6xl mx-auto pt-24 px-4 pb-16 text-center">
    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      Category not found
    </p>
    <UButton :to="localePath('/')" color="primary">
      {{ $t('category.backToHome') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { getCategoryById } from '~/utils/categories'
import { getSkillsByCategory } from '~/utils/skills'
import { getTagsForCategory } from '~/utils/tags'
import SkillCard from '~/components/skills/SkillCard.vue'
import TagBadge from '~/components/tags/TagBadge.vue'
import Breadcrumb from '~/components/common/Breadcrumb.vue'
import type { Category, Tag } from '~/types'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Get category slug from route
const slug = computed(() => route.params.slug as string)

// Validate slug and get category
const category = computed<Category | undefined>(() => {
  const validSlugs = ['health', 'identity', 'career']
  if (!validSlugs.includes(slug.value)) {
    return undefined
  }
  return getCategoryById(slug.value as 'health' | 'identity' | 'career', locale.value as 'fa' | 'en')
})

// Get skills for this category
const skills = computed(() => {
  if (!category.value) {
    return []
  }
  return getSkillsByCategory(category.value.id as 'health' | 'identity' | 'career', locale.value as 'fa' | 'en')
})

// Get tags for this category
const categoryTags = computed(() => {
  if (!category.value) {
    return []
  }
  return getTagsForCategory(category.value.id, locale.value as 'fa' | 'en')
})

// Breadcrumb items
const breadcrumbItems = computed(() => {
  const items: Array<{ label: string; to?: string; icon?: string }> = [
    {
      label: t('breadcrumb.home'),
      to: '/',
      icon: 'i-heroicons-home'
    }
  ]
  
  items.push({
    label: t('breadcrumb.categories'),
    to: '/categories',
    icon: 'i-heroicons-squares-2x2'
  })
  
  if (category.value) {
    items.push({
      label: category.value.name[locale.value]
      // to and icon omitted for current page
    })
  }
  
  return items
})

// Calculate position for skill indicators in diagram
const getSkillIndicatorPosition = (index: number, total: number) => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // Start from top
  const radius = 60 // Distance from center
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return {
    left: `calc(50% + ${x}px - 16px)`,
    top: `calc(50% + ${y}px - 16px)`,
  }
}

// Set page title
useHead({
  title: computed(() => {
    if (category.value) {
      return `${category.value.name[locale.value]} - 15ecosystem`
    }
    return 'Category Not Found - 15ecosystem'
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        if (category.value) {
          return category.value.description[locale.value]
        }
        return 'Category not found'
      }),
    },
  ],
})
</script>

