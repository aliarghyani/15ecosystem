<template>
  <div v-if="skill" class="max-w-4xl mx-auto pt-24 px-4 pb-16">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink :to="localePath('/')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.home') }}
      </NuxtLink>
      <span>/</span>
      <NuxtLink :to="localePath('/categories')" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ $t('breadcrumb.categories') }}
      </NuxtLink>
      <span>/</span>
      <NuxtLink
        v-if="category"
        :to="localePath(`/categories/${category.id}`)"
        class="hover:text-primary-600 dark:hover:text-primary-400"
      >
        {{ category.name[locale] }}
      </NuxtLink>
      <span v-if="category">/</span>
      <span class="text-gray-800 dark:text-gray-200 font-medium">
        {{ $t('skills.skillNumber', { number: skill.id }) }}
      </span>
    </nav>

    <!-- Skill Header -->
    <div class="mb-12">
      <div class="flex items-center gap-4 mb-4">
        <span class="text-5xl font-bold text-primary-600 dark:text-primary-400">
          {{ skill.id }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
          {{ skill.name[locale] || skill.name.fa }}
        </h1>
      </div>
      <div v-if="category" class="text-sm text-gray-500 dark:text-gray-400">
        {{ category.name[locale] }} • {{ $t('home.skillCount', { count: category.skills.length }) }}
      </div>
    </div>

    <!-- Why It Matters Section -->
    <UCard v-if="skill.whyItMatters?.[locale] || skill.whyItMatters?.fa" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ $t('skills.whyItMatters') }}
        </h2>
      </template>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {{ skill.whyItMatters[locale] || skill.whyItMatters.fa }}
      </p>
    </UCard>

    <!-- How To Section -->
    <UCard v-if="skill.howTo?.[locale] || skill.howTo?.fa" class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ $t('skills.howTo') }}
        </h2>
      </template>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {{ skill.howTo[locale] || skill.howTo.fa }}
      </p>
    </UCard>

    <!-- Book References Section -->
    <div v-if="books.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('skills.bookReferences') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BookCard v-for="book in books" :key="`${book.title}-${book.author}`" :book="book" />
      </div>
    </div>
    <div v-else class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('skills.bookReferences') }}
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        {{ $t('skills.noBooks') }}
      </p>
    </div>

    <!-- Related Skills Section -->
    <div v-if="relatedSkills.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('skills.relatedSkills') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkillCard
          v-for="relatedSkill in relatedSkills"
          :key="relatedSkill.id"
          :skill="relatedSkill"
          :show-description="true"
          :show-footer="false"
          variant="compact"
        />
      </div>
    </div>

    <!-- Skill Navigation -->
    <div class="mt-12">
      <SkillNavigation :current-skill-id="skill.id" :category-id="skill.category" />
    </div>
  </div>

  <!-- 404 Page -->
  <div v-else class="max-w-4xl mx-auto pt-24 px-4 pb-16 text-center">
    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
      Skill not found
    </p>
    <UButton :to="localePath('/')" color="primary">
      {{ $t('category.backToHome') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { getSkillById, getRelatedSkills } from '~/utils/skills'
import { getBooksBySkillId } from '~/utils/books'
import { getCategoryById } from '~/utils/categories'
import BookCard from '~/components/books/BookCard.vue'
import SkillCard from '~/components/skills/SkillCard.vue'
import SkillNavigation from '~/components/skills/SkillNavigation.vue'
import type { Skill, Category } from '~/types'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

// Get skill slug from route (can be ID or slug)
const slug = computed(() => route.params.slug as string)

// Parse skill ID from slug (handle both numeric IDs and slugs)
const skillId = computed(() => {
  const id = parseInt(slug.value, 10)
  if (!isNaN(id) && id >= 1 && id <= 15) {
    return id
  }
  return null
})

// Get skill data
const skill = computed<Skill | undefined>(() => {
  if (!skillId.value) {
    return undefined
  }
  return getSkillById(skillId.value, locale.value as 'fa' | 'en')
})

// Get category for breadcrumb
const category = computed<Category | undefined>(() => {
  if (!skill.value) {
    return undefined
  }
  return getCategoryById(skill.value.category, locale.value as 'fa' | 'en')
})

// Get books for this skill
const books = computed(() => {
  if (!skill.value) {
    return []
  }
  return getBooksBySkillId(skill.value.id, locale.value as 'fa' | 'en')
})

// Get related skills
const relatedSkills = computed(() => {
  if (!skill.value) {
    return []
  }
  return getRelatedSkills(skill.value.id, locale.value as 'fa' | 'en')
})

// Set page title
useHead({
  title: computed(() => {
    if (skill.value) {
      return `${skill.value.name[locale.value] || skill.value.name.fa} - 15ecosystem`
    }
    return 'Skill Not Found - 15ecosystem'
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        if (skill.value) {
          return skill.value.whyItMatters?.[locale.value] || skill.value.whyItMatters?.fa || ''
        }
        return 'Skill not found'
      }),
    },
  ],
})
</script>

